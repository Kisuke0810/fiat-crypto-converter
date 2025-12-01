import type { Fiat, PriceResult, TokenDef } from '../types/index.ts';

// Frontend pricing fetcher
// - Calls backend API: /api/price?symbol=XXX&fiat=yyy
// - 60s in-memory cache (per tab)

type CacheVal = { ts: number; data: PriceResult };
const cache = new Map<string, CacheVal>();
const TTL = 60 * 1000; // 60s

const keyOf = (sym: string, fiat: Fiat) => `${sym.toUpperCase()}:${fiat}`;

export async function getPrice(token: TokenDef, fiat: Fiat): Promise<PriceResult> {
  const symbol = token.symbol.toUpperCase();
  const key = keyOf(symbol, fiat);
  const now = Date.now();
  const c = cache.get(key);
  if (c && (now - c.ts) < TTL) return { ...c.data, cached: true } as PriceResult;

  try {
    const url = `/api/price?symbol=${encodeURIComponent(symbol)}&fiat=${fiat}`;
    const r = await fetch(url, { headers: { accept: 'application/json' } });
    const j = await r.json();
    const out: PriceResult = j;
    if (out?.ok) cache.set(key, { ts: now, data: out });
    return out;
  } catch (e: any) {
    return { ok: false, source: 'unknown', error: e?.message ?? 'error' };
  }
}
