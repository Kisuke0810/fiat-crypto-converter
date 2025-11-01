import React from 'react';
import Converter from './components/Converter';
import LanguageToggle from './components/LanguageToggle';
import './styles/app.css';
import { setLang, t, getLang } from './i18n';

export default function App() {
  const [lang, setL] = React.useState<'ja' | 'en'>('ja');
  React.useEffect(() => { setLang(lang); }, [lang]);

  // 言語変更時に html@lang と document.title を適用し、
  // bfcache 復帰（pageshow persisted）でも再適用する。
  React.useEffect(() => {
    const apply = (l: 'ja' | 'en') => {
      document.documentElement.setAttribute('lang', l);
      document.title = l === 'ja'
        ? '法定通貨 ⇄ 暗号資産 かんたん換算'
        : 'Fiat ⇄ Crypto Quick Converter';
    };
    // 初期 & 言語変更時に適用（i18n側が外部で変わった場合も考慮）
    apply((typeof getLang === 'function' ? getLang() : lang) as 'ja' | 'en');
    const onPageShow = (e: PageTransitionEvent) => {
      if ((e as any).persisted) {
        apply((typeof getLang === 'function' ? getLang() : lang) as 'ja' | 'en');
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [lang]);

  return (
    <div className="page">
      <header className="appbar">
        <div className="brand">
          <div className="logo">₿</div>
          <div className="brand-text">Fiat ⇄ Crypto</div>
        </div>
        <LanguageToggle />
      </header>

      <main className="container">
        <section className="hero">
          <h1 className="headline">{t('title')}</h1>
          <p className="sub">Simple • Fast • Accurate*</p>
        </section>

        <Converter />

        <p className="note">* {t('note')}</p>
      </main>

      <footer className="footer">
        <small>© {new Date().getFullYear()} Converter</small>
      </footer>
    </div>
  );
}
