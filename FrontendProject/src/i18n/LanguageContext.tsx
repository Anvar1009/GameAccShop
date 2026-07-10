import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  interpolate,
  readStoredLanguage,
  STORAGE_KEY,
  translations,
  type Language,
  type TranslateParams,
  type TranslationKey,
} from "./translations";

export interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: TranslateParams) => string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: TranslateParams) => {
      const template = translations[language][key] ?? translations.en[key] ?? key;
      return interpolate(template, params);
    },
    [language]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}
