import React from 'react';
import Converter from './components/Converter';
import './styles/app.css';
import { setLang, t } from './i18n';
export default function App() {
  const [lang, setL] = React.useState<'ja' | 'en'>('ja');
  React.useEffect(() => { setLang(lang); }, [lang]);
  return (
    <div className="container">
      <div className="seg" style={{justifyContent:'flex-end'}}>
        <button className="segbtn" onClick={() => setL(lang==='ja'?'en':'ja')}>
          {t('lang')}: {lang.toUpperCase()}
        </button>
      </div>
      <Converter />
    </div>
  );
}
