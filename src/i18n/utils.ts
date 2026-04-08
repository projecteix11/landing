import type { Locale, Translations } from './types'
import en from './en.json'
import es from './es.json'
import ca from './ca.json'

const translations: Record<Locale, Translations> = { en, es, ca }

export const locales: Locale[] = ['en', 'es', 'ca']
export const defaultLocale: Locale = 'en'

export function getLocaleFromUrl(url: URL): Locale {
  const segment = url.pathname.split('/')[1]
  if (locales.includes(segment as Locale)) return segment as Locale
  return defaultLocale
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations[defaultLocale]
}

export function localePath(locale: Locale, path: string = '/'): string {
  return `/${locale}${path === '/' ? '/' : path}`
}

export function getAlternateUrls(basePath: string = '/'): Array<{ locale: Locale; url: string }> {
  return locales.map((locale) => ({
    locale,
    url: `https://gobbly.app/${locale}${basePath === '/' ? '/' : basePath}`,
  }))
}
