import React from 'react';
import Converter from './components/Converter';
import LanguageToggle from './components/LanguageToggle';
import './styles/app.css';
import { t, setLang as i18nSetLang, getLang } from './i18n';

// タイトル文言（UIテキストは既存のまま。タイトルのみここで管理）
const PAGE_TITLES: Record<'ja' | 'en', string> = {
  ja: '法定通貨 ⇄ 暗号資産 かんたん換算',
  en: 'Fiat ⇄ Crypto Quick Converter',
};

function AppShell({ lang, onChange }: { lang: 'ja'|'en'; onChange: (l:'ja'|'en')=>void }) {
  return (
    <div className="page">
      <header className="appbar">
        <div className="brand">
          <div className="logo">₿</div>
          <div className="brand-text">Fiat ⇄ Crypto</div>
        </div>
        <LanguageToggle value={lang} onChange={onChange} />
      </header>

      <main className="container">
        <section className="hero">
          <h1 className="headline">{t('title')}</h1>
          <p className="sub">Simple • Fast • Accurate*</p>
        </section>

        <Converter lang={lang} />
        <p className="note">* {t('note')}</p>
      </main>

      <footer className="footer">
        <small>© {new Date().getFullYear()} Converter</small>
      </footer>
    </div>
  );
}

export default function App() {
  // ★ アプリ唯一の言語状態（初期値はi18nの保存値/デフォルト）
  const [lang, setAppLang] = React.useState<'ja'|'en'>(getLang());

  // ★ 辞書側へ同期 + タイトル即時反映（言語変更時のみ）
  React.useEffect(() => {
    // i18nの現在値を同期
    i18nSetLang(lang);

    const applyTitle = () => {
      // getLang() と state のどちらでも判定可能にし、言語コードの揺れを吸収
      const raw = (typeof getLang === 'function' ? getLang() : lang || '').toString().toLowerCase();
      const isJa = ['ja', 'jp', 'ja-jp', 'ja_jp'].includes(raw);
      document.title = PAGE_TITLES[isJa ? 'ja' : 'en'];
    };

    // 初回 & 言語変更直後
    applyTitle();
    // ここでは言語変更時のみ更新し、初期は index.html の INSTANT_TITLE v2 に任せる
    return () => {};
  }, [lang]);

  return (
    <AppShell lang={lang} onChange={setAppLang} />
  );
}
