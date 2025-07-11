// Currently supported locales for the application
export const LOCALES = [
  "en", // English
] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
