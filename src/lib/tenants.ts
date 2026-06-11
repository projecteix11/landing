// Public restaurant directory data source.
// Fetched at BUILD TIME (SSG) from the Gobbly API and baked into static HTML.
// New listed restaurants appear on the next deploy.

export const API_URL = import.meta.env.API_URL ?? 'https://api.gobbly.app'

// Base domain for tenant subdomains, e.g. "{slug}.gobbly.app".
export const TENANT_DOMAIN = import.meta.env.TENANT_DOMAIN ?? 'gobbly.app'

export interface TenantBranding {
  primaryColor?: string
  logo?: string
  coverImage?: string
  tagline?: string
  cuisine?: string
}

export interface ListedTenant {
  id: string
  name: string
  slug: string
  city: string | null
  logo_url: string | null
  branding: TenantBranding | null
}

/** Full landing URL for a tenant's own subdomain site. */
export function tenantUrl(slug: string): string {
  return `https://${slug}.${TENANT_DOMAIN}`
}

/**
 * Fetch the opt-in (is_listed) active tenants for the public directory.
 *
 * In dev, failures degrade to an empty list. In production builds an empty
 * directory FAILS THE BUILD — a localhost API_URL baked into the CI image once
 * shipped an empty "Our clients" section to prod for every deploy, silently.
 * Set ALLOW_EMPTY_DIRECTORY=true to ship an intentionally empty directory.
 */
export async function fetchListedTenants(): Promise<ListedTenant[]> {
  let tenants: ListedTenant[] = []
  let failure: string | null = null
  try {
    const res = await fetch(`${API_URL}/tenants/public`)
    if (res.ok) {
      const json = (await res.json()) as { data: ListedTenant[] | null }
      tenants = json.data ?? []
    } else {
      failure = `/tenants/public responded ${res.status}`
    }
  } catch (e) {
    failure = `failed to fetch public directory: ${e}`
  }

  if (failure) console.warn(`[tenants] ${failure} (API_URL=${API_URL})`)

  if (
    tenants.length === 0 &&
    import.meta.env.PROD &&
    import.meta.env.ALLOW_EMPTY_DIRECTORY !== 'true'
  ) {
    throw new Error(
      `[tenants] Production build with an empty restaurant directory (API_URL=${API_URL}${failure ? `, ${failure}` : ''}). ` +
        'Fix API_URL or set ALLOW_EMPTY_DIRECTORY=true to ship without it.',
    )
  }

  return tenants
}
