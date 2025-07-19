import 'server-only'
import type { Locale } from '@/i18n.config'

const serverDictionaries = {
  th: () => import('./dictionaries/th.json').then(module => module.default),
  en: () => import('./dictionaries/en.json').then(module => module.default),
}

export const getDictionary = async (locale: Locale) => {
    return locale === 'en' ? await serverDictionaries.en() : await serverDictionaries.th();
}
