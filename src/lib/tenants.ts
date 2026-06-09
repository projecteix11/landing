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
 * Returns [] on any failure so the build never breaks on a transient API error.
 */
export async function fetchListedTenants(): Promise<ListedTenant[]> {
  try {
    const res = await fetch(`${API_URL}/tenants/public`)
    if (!res.ok) {
      console.warn(`[tenants] /tenants/public responded ${res.status}`)
      return []
    }
    const json = (await res.json()) as { data: ListedTenant[] | null }
    return json.data ?? []
  } catch (e) {
    console.warn('[tenants] failed to fetch public directory:', e)
    return []
  }
}
