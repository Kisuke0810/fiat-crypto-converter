import { useEffect } from 'react';
import Converter from './components/Converter';
import { t } from './i18n';

export default function App() {
  useEffect(() => {
    document.documentElement.lang = 'ja';
    document.title = '法定通貨 ⇄ 暗号資産 かんたん換算';
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">{t('title')}</header>
      <main className="app-main">
        <div className="app-container">
          <Converter />
        </div>
      </main>
    </div>
  );
}
