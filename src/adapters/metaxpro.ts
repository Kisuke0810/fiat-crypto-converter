import type { Fiat, PriceResult } from '../types/index.ts';
const endpoint = import.meta.env.VITE_METAX_PRO_PRICE_URL as string | undefined;

export async function metaxProPrice(fiat: Fiat): Promise<PriceResult> {
  if (!endpoint) return { ok: false, source: 'metaxpro', error: 'no_endpoint' };
  try {
    const r = await fetch(endpoint, { headers: { accept: 'application/json' } });
    if (!r.ok) return { ok: false, source: 'metaxpro', error: String(r.status) };
    const j = await r.json();
    const p = j?.price?.[fiat];
    if (p == null) return { ok: false, source: 'metaxpro', error: 'not_found' };
    return { ok: true, source: 'metaxpro', price: { [fiat]: Number(p) } };
  } catch (e: any) {
    return { ok: false, source: 'metaxpro', error: e?.message ?? 'error' };
  }
}
