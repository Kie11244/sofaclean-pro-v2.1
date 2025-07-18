
const th = () => import('./dictionaries/th.json').then(module => module.default)
const en = () => import('./dictionaries/en.json').then(module => module.default)

// Synchronous versions for client components
import thMessages from './dictionaries/th.json';
import enMessages from './dictionaries/en.json';

type DictionaryLoader = (() => Promise<any>) & { sync: () => any };

const enLoader: DictionaryLoader = Object.assign(en, { sync: () => enMessages });
const thLoader: DictionaryLoader = Object.assign(th, { sync: () => thMessages });

export const dictionaries: { [key: string]: DictionaryLoader } = {
  en: enLoader,
  th: thLoader,
}
