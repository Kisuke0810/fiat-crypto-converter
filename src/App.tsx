import { useEffect } from 'react';
import Converter from './components/Converter';

export default function App() {
  useEffect(() => {
    document.documentElement.lang = 'ja';
    document.title = '法定通貨 ⇄ 暗号資産 かんたん換算';
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="title-main">法定通貨 ⇄ 暗号資産</h1>
        <div className="title-sub">かんたん換算</div>
      </header>
      <main className="app-main">
        <div className="app-container">
          <Converter />
        </div>
      </main>
    </div>
  );
}
