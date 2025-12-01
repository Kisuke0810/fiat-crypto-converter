import { useState, useEffect, useCallback } from 'react';
import type { Fiat, CoinSymbol } from '../types/index.ts';
import { TOKENS, findToken } from '../lib/tokens';
import { getPrice } from '../lib/pricing';
import { toFixedFloor, addThousands, stripThousands, formatFiat } from '../lib/number';
import { t } from '../i18n';
import CopyButton from './atoms/CopyButton';

type Mode = 'fiatToCoin' | 'coinToFiat';

const FIATS: { value: Fiat; label: string }[] = [
  { value: 'jpy', label: 'JPY（日本円）' },
  { value: 'usd', label: 'USD（US Dollar）' },
  { value: 'eur', label: 'EUR（Euro）' },
];

export default function Converter() {
  const [mode, setMode]   = useState<Mode>('fiatToCoin');
  const [fiat, setFiat]   = useState<Fiat>('jpy');
  const [coin, setCoin]   = useState<CoinSymbol>('USDT');
  const [amount, setAmount] = useState('5000');
  const [result, setResult] = useState('—');
  const [resultUnit, setResultUnit] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [cachedFlag, setCachedFlag] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fmtHM = (d: Date) => {
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    return `${hh}:${mm}`;
  };

  const formatOut = (n: number, kind: 'crypto'|'fiat') => {
    if (!Number.isFinite(n)) return '—';
    if (kind === 'crypto') return toFixedFloor(n, 6).replace(/\.?0+$/, '');
    return toFixedFloor(n, 2).replace(/\.00$/, '');
  };

  const compute = useCallback(async () => {
    setErr(null);
    const val = Number(stripThousands(amount));
    if (!Number.isFinite(val) || val <= 0) { setResult('—'); return; }

    const def = findToken(coin);
    if (!def) { setErr(t('unsupported')); return; }

    setLoading(true);
    const pr = await getPrice(def, fiat);
    setLoading(false);

    if (!pr.ok || !pr.price?.[fiat]) { setErr(t('errorFetch')); return; }
    const price = pr.price[fiat]!;
    const out = mode === 'fiatToCoin' ? val / price : val * price;

    if (mode === 'fiatToCoin') {
      const txt = formatOut(out, 'crypto');
      setResult(`${txt} ${coin}`);
      setResultUnit(coin);
    } else {
      const txt = formatFiat(out, fiat);
      const f = fiat.toUpperCase();
      setResult(`${txt} ${f}`);
      setResultUnit(f);
    }
    setLastUpdated(fmtHM(new Date()));
    setSource(pr.source || '');
    setCachedFlag(Boolean(pr.cached));
  }, [amount, coin, fiat, mode]);

  useEffect(() => {
    const id = setTimeout(compute, 100);
    return () => clearTimeout(id);
  }, [compute]);

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') compute();
    }, 30000);
    return () => clearInterval(id);
  }, [compute]);

  return (
    <div
      style={{
        background: '#fff',
        padding: 24,
        borderRadius: 16,
        boxShadow: '0 10px 28px rgba(34,40,66,.08)',
        width: '100%',
        maxWidth: 720,
        margin: '0 auto',
        border: '1px solid #eef0f6'
      }}
    >

      <div style={{display:'flex', gap:12, margin:'4px 0 18px'}}>
        <button
          style={{padding:'12px 16px', borderRadius:12, border:'1px solid #dfe3f0', background: mode==='fiatToCoin'?'#eaf1ff':'#f7f8fd', fontSize:16, fontWeight:600, cursor:'pointer'}}
          onClick={() => setMode('fiatToCoin')}
        >
          {t('modeFiatToCoin')}
        </button>
        <button
          style={{padding:'12px 16px', borderRadius:12, border:'1px solid #dfe3f0', background: mode==='coinToFiat'?'#eaf1ff':'#f7f8fd', fontSize:16, fontWeight:600, cursor:'pointer'}}
          onClick={() => setMode('coinToFiat')}
        >
          {t('modeCoinToFiat')}
        </button>
      </div>

      <div style={{display:'grid', gap:10, margin:'14px 0'}}>
        <label>{t('fiat')}</label>
        <select className="big-input" value={fiat} onChange={e => setFiat(e.target.value as Fiat)}>
          {FIATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>

      <div style={{display:'grid', gap:10, margin:'14px 0'}}>
        <label>{mode === 'fiatToCoin' ? t('amount') : t('quantity')}</label>
        <input className="big-input" inputMode="decimal" value={amount}
          onChange={e => {
            const raw = e.target.value;
            setAmount(raw.replace(/[^\d.,]/g, ''));
          }}
          onBlur={() => {
            // 入力の見やすさ向上：JPY かつ 法定通貨入力時は3桁区切り
            if (fiat === 'jpy' && mode === 'fiatToCoin') {
              const v = stripThousands(amount);
              if (v) setAmount(addThousands(v));
            }
          }}
          onFocus={(e) => {
            // 編集しやすいようにカンマ除去
            const v = stripThousands(e.currentTarget.value);
            setAmount(v);
            requestAnimationFrame(() => {
              const el = e.currentTarget;
              el.selectionStart = el.selectionEnd = el.value.length;
            });
          }}
          placeholder={mode === 'fiatToCoin' ? '5000' : '33.751856'} />
      </div>

      <div style={{display:'grid', gap:10, margin:'14px 0'}}>
        <label>{t('coin')}</label>
        <select className="big-input" value={coin} onChange={e => setCoin(e.target.value as CoinSymbol)}>
          {TOKENS.map(tk => <option key={tk.symbol} value={tk.symbol}>{tk.label}</option>)}
        </select>
      </div>

      <div className="result-box" style={{marginTop:18}}>
        <div style={{fontSize:13, color:'#667', letterSpacing:'.02em'}}>{t('result')}</div>
        <div className="result-line" style={{marginTop:6}}>
          {loading
            ? <div className="result-value">…</div>
            : (<>
                <span className="result-value">{result.split(' ')[0]}</span>
                <span className="result-unit">{resultUnit || result.split(' ')[1] || ''}</span>
              </>)
          }
        </div>
        {!loading && result !== '—' && <CopyButton text={result} />}
        {lastUpdated && (
          <div className="result-meta">更新: {lastUpdated}（{source ? source.toUpperCase() : '—'}{cachedFlag ? '・cache' : ''}）</div>
        )}
        {err && <div className="error" style={{marginTop:8}}>{err}</div>}
      </div>

      <p style={{marginTop:12, color:'#667', fontSize:12}}>{t('note')}</p>
    </div>
  );
}
