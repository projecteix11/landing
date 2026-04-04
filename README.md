# Gobbly — Landing Page

Marketing landing page for **Gobbly**, an all-in-one restaurant management platform.

## Tech Stack

- [Astro](https://astro.build/) — static site framework
- [Tailwind CSS v4](https://tailwindcss.com/) — styling via `@tailwindcss/vite`
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [pnpm](https://pnpm.io/) — package manager

## Prerequisites

You need **Node.js 18+** and **pnpm** installed.

If you don't have pnpm:

```bash
# With npm
npm install -g pnpm

# Or with corepack (recommended, comes with Node.js)
corepack enable
corepack prepare pnpm@latest --activate
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:4321)
pnpm dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server on `localhost:4321` |
| `pnpm build` | Build for production (`dist/`) |
| `pnpm preview` | Preview production build locally |

## Project Structure

```
src/
├── layouts/Layout.astro           # Base HTML layout (meta, fonts, SEO)
├── pages/index.astro              # Landing page
├── styles/global.css              # Tailwind v4 theme + animations
└── components/
    ├── sections/                  # Page sections (Hero, Features, Pricing...)
    ├── layout/                    # Navbar, Footer
    └── ui/                        # Reusable components (SectionHeader, StarRating...)
```

Static assets go in `public/` (served at root, e.g. `public/favicon.svg` → `/favicon.svg`).
