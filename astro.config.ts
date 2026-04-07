import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import devOnlyPages from './integrations/dev-only-pages'

export default defineConfig({
  site: 'https://gobbly.app',
  integrations: [
    devOnlyPages({ pages: ['design/colors'] }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
