import type { Fiat, PriceResult, TokenDef } from '../types';
const key = import.meta.env.VITE_CMC_API_KEY as string | undefined;
export async function cmcPrice(token: TokenDef, fiat: Fiat): Promise<PriceResult> {
  if (!key) return { ok: false, source: 'cmc', error: 'no_key' };
  try {
    const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${token.symbol}&convert=${fiat.toUpperCase()}`;
    const r = await fetch(url, { headers: { 'X-CMC_PRO_API_KEY': key, accept: 'application/json' } });
    if (!r.ok) return { ok: false, source: 'cmc', error: String(r.status) };
    const j = await r.json();
    const data = j?.data?.[token.symbol]?.[0];
    const price = data?.quote?.[fiat.toUpperCase()]?.price;
    if (price == null) return { ok: false, source: 'cmc', error: 'not_found' };
    return { ok: true, source: 'cmc', price: { [fiat]: Number(price) } };
  } catch (e: any) {
    return { ok: false, source: 'cmc', error: e?.message ?? 'error' };
  }
}

