import React from 'react';
import type { Fiat, CoinSymbol } from '../types';
import { TOKENS, findToken } from '../lib/tokens';
import { getPrice } from '../lib/pricing';
import { toFixedFloor } from '../lib/number';
import { t, getLang } from '../i18n';

type Mode = 'fiatToCoin' | 'coinToFiat';
const FIATS: { value: Fiat; label: string }[] = [
  { value: 'jpy', label: 'JPY（日本円）' },
  { value: 'usd', label: 'USD（US Dollar）' },
  { value: 'eur', label: 'EUR（Euro）' },
];

export default function Converter() {
  const lang = getLang() as 'ja' | 'en';
  const [mode, setMode] = React.useState<Mode>('fiatToCoin');
  const [fiat, setFiat] = React.useState<Fiat>('jpy');
  const [coin, setCoin] = React.useState<CoinSymbol>('USDT');
  const [amount, setAmount] = React.useState<string>('5000');
  const [result, setResult] = React.useState<string>('—');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const compute = React.useCallback(async () => {
    setErr(null);
    const val = Number(amount);
    if (!isFinite(val) || val <= 0) { setResult('—'); return; }
    const def = findToken(coin);
    if (!def) { setErr(t('unsupported')); return; }
    setLoading(true);
    const pr = await getPrice(def, fiat);
    setLoading(false);
    if (!pr.ok || !pr.price?.[fiat]) { setErr(t('errorFetch')); return; }
    const price = pr.price[fiat];
    const out = mode === 'fiatToCoin' ? val / price : val * price;
    const isJA = lang === 'ja';
    setResult(
      mode === 'fiatToCoin'
        ? `${toFixedFloor(out)} ${coin}`
        : `${isJA ? '¥' : ''}${toFixedFloor(out)} ${fiat.toUpperCase()}`
    );
  }, [amount, coin, fiat, mode, lang]);

  React.useEffect(() => { const id = setTimeout(compute, 60); return () => clearTimeout(id); }, [compute]);
  React.useEffect(() => {
    const id = setInterval(() => { if (document.visibilityState === 'visible') compute(); }, 30000);
    return () => clearInterval(id);
  }, [compute]);

  return (
    <div className="card">
      <h1 className="title">{t('title')}</h1>
      <div className="seg">
        <button className={mode==='fiatToCoin' ? 'segbtn active':'segbtn'} onClick={() => setMode('fiatToCoin')}>
          {t('modeFiatToCoin')}
        </button>
        <button className={mode==='coinToFiat' ? 'segbtn active':'segbtn'} onClick={() => setMode('coinToFiat')}>
          {t('modeCoinToFiat')}
        </button>
      </div>
      <div className="row">
        <label>{t('fiat')}</label>
        <select value={fiat} onChange={e => setFiat(e.target.value as Fiat)}>
          {FIATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>
      <div className="row">
        <label>{mode === 'fiatToCoin' ? t('amount') : t('quantity')}</label>
        <input inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)}
               placeholder={mode === 'fiatToCoin' ? '5000' : '33.751856'} />
      </div>
      <div className="row">
        <label>{t('coin')}</label>
        <select value={coin} onChange={e => setCoin(e.target.value as CoinSymbol)}>
          {TOKENS.map(tk => <option key={tk.symbol} value={tk.symbol}>{tk.label}</option>)}
        </select>
      </div>
      <div className="result">
        <div className="label">{t('result')}</div>
        <div className="value">{loading ? '…' : result}</div>
        {err && <div className="error">{err}</div>}
      </div>
      <p className="note">{t('note')}</p>
    </div>
  );
}
