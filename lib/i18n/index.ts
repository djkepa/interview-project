import en from './en.json';

export type Locale = 'en';
export type TranslationKeys = typeof en;

const translations: Record<Locale, TranslationKeys> = {
  en,
};

let currentLocale: Locale = 'en';

export const setLocale = (locale: Locale) => {
  currentLocale = locale;
};

export const getLocale = (): Locale => currentLocale;

export const t = (key: string): string => {
  const keys = key.split('.');
  let value: unknown = translations[currentLocale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  return typeof value === 'string' ? value : key;
};

export { translations };
