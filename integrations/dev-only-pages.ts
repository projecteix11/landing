import type { AstroIntegration } from 'astro'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'

interface DevOnlyPagesOptions {
  /**
   * List of page paths to exclude from production builds.
   * Paths are relative to `src/pages/` without the file extension.
   * Example: ['design/colors'] excludes src/pages/design/colors.astro
   */
  pages: string[]
}

const MANIFEST_PATH = path.join(os.tmpdir(), '.astro-dev-only-pages.json')

function loadManifest(): Array<{ original: string; renamed: string }> {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'))
  } catch {
    return []
  }
}

function saveManifest(entries: Array<{ original: string; renamed: string }>) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(entries), 'utf-8')
}

function clearManifest() {
  try { fs.unlinkSync(MANIFEST_PATH) } catch { /* noop */ }
}

function restoreFromManifest(logger?: { info: (msg: string) => void }) {
  const entries = loadManifest()
  for (const { original, renamed } of entries) {
    if (fs.existsSync(renamed)) {
      fs.renameSync(renamed, original)
      logger?.info(`Restored: ${path.basename(original)}`)
    }
  }
  clearManifest()
}

/**
 * Astro integration that excludes specific pages from production builds.
 * Pages remain fully accessible during `astro dev`.
 *
 * How it works:
 * - During `astro:config:setup` (before route collection), the target pages
 *   are temporarily renamed (adding a `.dev-only` suffix) so Astro never
 *   registers them as routes.
 * - A manifest file in the OS temp directory tracks renamed files so they
 *   can be restored reliably after the build, even across process boundaries.
 * - Process exit handlers provide a safety net for unexpected crashes.
 */
export default function devOnlyPages(options: DevOnlyPagesOptions): AstroIntegration {
  let cleanupRegistered = false

  function registerCleanup() {
    if (cleanupRegistered) return
    cleanupRegistered = true
    process.on('exit', () => restoreFromManifest())
    process.on('SIGINT', () => { restoreFromManifest(); process.exit(130) })
    process.on('SIGTERM', () => { restoreFromManifest(); process.exit(143) })
  }

  return {
    name: 'dev-only-pages',
    hooks: {
      'astro:config:setup': ({ command, logger }) => {
        // Restore any leftover from a previous crashed build
        restoreFromManifest(logger)

        if (command !== 'build') return

        logger.info(`Excluding dev-only pages from build: ${options.pages.join(', ')}`)

        registerCleanup()

        const entries: Array<{ original: string; renamed: string }> = []

        // Rename files BEFORE Astro collects routes
        for (const page of options.pages) {
          const possibleExtensions = ['.astro', '.md', '.mdx']
          for (const ext of possibleExtensions) {
            const filePath = path.resolve('src/pages', page + ext)
            if (fs.existsSync(filePath)) {
              const renamedPath = filePath + '.dev-only'
              fs.renameSync(filePath, renamedPath)
              entries.push({ original: filePath, renamed: renamedPath })
              logger.info(`Temporarily hidden: ${page + ext}`)
              break
            }
          }
        }

        saveManifest(entries)
      },

      'astro:build:done': ({ logger }) => {
        restoreFromManifest(logger)
      },
    },
  }
}
