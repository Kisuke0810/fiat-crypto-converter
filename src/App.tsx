import React from 'react';
import Converter from './components/Converter';
import LanguageToggle from './components/LanguageToggle';
import './styles/app.css';
import { setLang, t } from './i18n';

export default function App() {
  const [lang, setL] = React.useState<'ja' | 'en'>('ja');
  React.useEffect(() => { setLang(lang); }, [lang]);

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
