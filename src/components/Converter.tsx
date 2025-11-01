import React from 'react';
import { Fiat, CoinSymbol } from '../types';
import { TOKENS, findToken } from '../lib/tokens';
import { getPrice } from '../lib/pricing';
import { t } from '../i18n';
import { formatAmount, ensureConsistentUnits } from '../utils/formatter';

type Mode = 'fiatToCoin' | 'coinToFiat';
const FIATS: { value: Fiat; label: string }[] = [
  { value: 'jpy', label: 'JPY（日本円）' },
  { value: 'usd', label: 'USD（US Dollar）' },
  { value: 'eur', label: 'EUR（Euro）' },
];

export default function Converter() {
  const [mode, setMode] = React.useState<Mode>('fiatToCoin');
  const [fiat, setFiat] = React.useState<Fiat>('jpy');
  const [coin, setCoin] = React.useState<CoinSymbol>('USDT');
  const [amount, setAmount] = React.useState<string>('5000');
  const [result, setResult] = React.useState<string>('—');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = React.useState<string | null>(null);
  const [lastSource, setLastSource] = React.useState<'CoinGecko' | 'CMC' | null>(null);

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
    // 更新情報（HH:mm + ソース）
    const srcLabel: 'CoinGecko' | 'CMC' = (pr.source === 'coingecko' ? 'CoinGecko' : pr.source === 'cmc' ? 'CMC' : 'CoinGecko');
    if (pr.fetchedAt) {
      const d = new Date(pr.fetchedAt);
      const hh = d.getHours().toString().padStart(2, '0');
      const mm = d.getMinutes().toString().padStart(2, '0');
      setLastUpdated(`${hh}:${mm}`);
      setLastSource(srcLabel);
    }
    // 出力通貨に統一したフォーマット
    const outputCurrency = (mode === 'fiatToCoin' ? coin : fiat.toUpperCase()) as string;
    const formatted = formatAmount(out, outputCurrency, 'code');
    try {
      ensureConsistentUnits(outputCurrency, formatted);
      setErr(null);
      setResult(formatted);
    } catch {
      setErr('表示を一時停止しました（通貨表示の不一致を検知）。ページを更新して再試行してください。');
      setResult('—');
    }
  }, [amount, coin, fiat, mode]);

  React.useEffect(() => { const id = setTimeout(compute, 120); return () => clearTimeout(id); }, [compute]);
  React.useEffect(() => {
    const id = setInterval(() => { if (document.visibilityState === 'visible') compute(); }, 30000);
    return () => clearInterval(id);
  }, [compute]);

  const inputCurrency = mode === 'fiatToCoin' ? fiat.toUpperCase() : coin;
  const outputCurrency = mode === 'fiatToCoin' ? coin : fiat.toUpperCase();

  const onCopy = async () => { try { await navigator.clipboard.writeText(result); } catch {} };

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
        <button className="copy-btn" type="button" aria-label="結果をコピー" title="コピー" onClick={onCopy} disabled={!result || result==='—'}>⧉</button>
        <div className="label">{t('result')}（{Number(amount).toLocaleString()} {inputCurrency} → {outputCurrency}）</div>
        <div className="value">{loading ? '…' : result}</div>
        {lastUpdated && lastSource && (
          <div className="result-updated">更新: {lastUpdated}（{lastSource}）</div>
        )}
        {err && <div className="error">{err}</div>}
        <div className="note">{t('note')}</div>
      </div>
    </div>
  );
}
