import type { Fiat, PriceResult, TokenDef } from '../types/index.ts';
const base = 'https://api.coingecko.com/api/v3';

async function priceById(id: string, fiat: Fiat) {
  const url = `${base}/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=${fiat}`;
  const r = await fetch(url, { headers: { accept: 'application/json' } });
  if (!r.ok) return;
  const j = await r.json();
  return j?.[id]?.[fiat];
}

async function priceByContract(contract: string, fiat: Fiat) {
  const url = `${base}/simple/token_price/ethereum?contract_addresses=${contract}&vs_currencies=${fiat}`;
  const r = await fetch(url, { headers: { accept: 'application/json' } });
  if (!r.ok) return;
  const j = await r.json();
  return j?.[contract.toLowerCase()]?.[fiat];
}

export async function coingeckoPrice(token: TokenDef, fiat: Fiat): Promise<PriceResult> {
  try {
    let p: number | undefined;
    if (token.coingeckoId) p = await priceById(token.coingeckoId, fiat);
    else if (token.contractAddress) p = await priceByContract(token.contractAddress.toLowerCase(), fiat);
    if (p == null) return { ok: false, source: 'coingecko', error: 'not_found' };
    return { ok: true, source: 'coingecko', price: { [fiat]: p } };
  } catch (e: any) {
    return { ok: false, source: 'coingecko', error: e?.message ?? 'error' };
  }
}
