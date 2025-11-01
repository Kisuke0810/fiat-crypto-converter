import React, { useEffect } from 'react';
import Converter from './components/Converter';
import './styles/app.css';
// i18n removed (ja-only)

export default function App() {

  // 日本語固定：タイトル/HTML lang を即時セット + bfcache 復帰時に再適用
  useEffect(() => {
    const apply = () => {
      document.title = '法定通貨 ⇄ 暗号資産 かんたん換算';
      if (document.documentElement.lang !== 'ja') {
        document.documentElement.lang = 'ja';
      }
    };
    apply();
    const onPageShow = (e: PageTransitionEvent) => {
      if ((e as any).persisted) apply();
    };
    window.addEventListener('pageshow', onPageShow as any);
    return () => window.removeEventListener('pageshow', onPageShow as any);
  }, []);

  return (
    <div className="page">
      <header className="appbar">
        <div className="brand">
          <div className="logo">₿</div>
          <div className="brand-text">Fiat ⇄ Crypto</div>
        </div>
        
      </header>

      <main className="container">
        <section className="hero">
          <h1 className="headline">法定通貨 ⇄ 暗号資産 かんたん換算</h1>
          <p className="sub">Simple・Fast・Accurate*</p>
        </section>

        <Converter />

        <p className="note">* 参考計算です。実際の購入レートやスプレッド・手数料により差が出ます。一部の銘柄は未対応の場合があります。</p>
      </main>

      <footer className="footer">
        <small>© {new Date().getFullYear()} Converter</small>
      </footer>
    </div>
  );
}
