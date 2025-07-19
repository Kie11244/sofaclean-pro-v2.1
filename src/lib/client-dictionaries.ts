import thMessages from './dictionaries/th.json'
import enMessages from './dictionaries/en.json'
import type { Locale } from '@/i18n.config'

type Dictionary = typeof thMessages;

type DictionaryLoader = {
  sync: () => Dictionary;
};

const enLoader: DictionaryLoader = { sync: () => enMessages as Dictionary };
const thLoader: DictionaryLoader = { sync: () => thMessages };

export const dictionaries: Record<Locale, DictionaryLoader> = {
  en: enLoader,
  th: thLoader,
};
