import React from 'react';
import { setLang as coreSetLang, t as coreT, getLang as coreGetLang } from './index';

type Lang = 'ja' | 'en';
type Ctx = { lang: Lang; t: typeof coreT; setLang: (l: Lang)=>void };
export const I18nContext = React.createContext<Ctx>({
  lang: coreGetLang() as Lang,
  t: coreT,
  setLang: (l: Lang) => coreSetLang(l),
});

export function I18nProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const setLang = (l: Lang) => coreSetLang(l);
  const value = React.useMemo(() => ({ lang, t: coreT, setLang }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => React.useContext(I18nContext);

