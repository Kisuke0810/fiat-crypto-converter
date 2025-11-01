export type UnitStyle = 'symbol' | 'code';

const FIAT_CODES = ['JPY', 'USD', 'EUR', 'GBP', 'AUD', 'CAD'] as const;
const CRYPTO_CODES = ['BTC', 'ETH', 'USDT', 'USDC', 'SOL', 'MATIC', 'ARB', 'BNB'] as const;

const isFiat = (c: string) => FIAT_CODES.includes(c.toUpperCase() as any);
const isCrypto = (c: string) => CRYPTO_CODES.includes(c.toUpperCase() as any);

export function formatAmount(value: number, currency: string, unitStyle: UnitStyle = 'code'): string {
  if (Number.isNaN(value)) return '—';
  const code = currency.toUpperCase();
  const abs = Math.abs(value);
  if (isFiat(code)) {
    const fixed = abs.toFixed(2);
    const trimmed = fixed.replace(/\.00$/, '');
    const withSep = Number(trimmed).toLocaleString('ja-JP');
    if (unitStyle === 'symbol') {
      if (code === 'JPY') return `¥${withSep}`;
      if (code === 'USD') return `$${withSep}`;
      if (code === 'EUR') return `€${withSep}`;
    }
    return `${withSep} ${code}`;
  }

  // crypto
  let text = abs.toFixed(6).replace(/\.?0+$/, '');
  if (abs !== 0 && abs < 1e-6) text = '< 0.000001';
  const withSep = text.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${withSep} ${code}`;
}

export function ensureConsistentUnits(outputCurrency: string, displayed: string) {
  const out = outputCurrency.toUpperCase();
  const symbolMap: Record<string, string> = { JPY: '¥', USD: '$', EUR: '€' };
  const sym = symbolMap[out];
  const hasJPY = displayed.includes('JPY') || displayed.includes('¥');
  const hasUSD = displayed.includes('USD') || displayed.includes('$');
  const hasEUR = displayed.includes('EUR') || displayed.includes('€');
  const codeMismatch = (hasJPY && out !== 'JPY') || (hasUSD && out !== 'USD') || (hasEUR && out !== 'EUR');
  const symbolMismatch = sym ? (displayed.includes(sym) && !displayed.endsWith(out)) : false;
  if (codeMismatch || symbolMismatch) throw new Error('UNIT_MISMATCH');
}
