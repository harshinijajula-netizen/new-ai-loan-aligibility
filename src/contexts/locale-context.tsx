"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { type Locale, getTranslation } from "@/lib/i18n";

type LocaleContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, fallback?: string) => string;
};

const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key, fb) => fb || key,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleRaw] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    const saved = localStorage.getItem("loaniq_locale") as Locale | null;
    return saved && ["en", "hi", "te"].includes(saved) ? saved : "en";
  });

  const setLocale = (l: Locale) => {
    setLocaleRaw(l);
    localStorage.setItem("loaniq_locale", l);
  };

  const t = (key: string, fallback?: string) => getTranslation(key, locale, fallback);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
