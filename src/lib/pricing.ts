import type { Fiat, PriceResult, TokenDef } from '../types/index.ts';
import { coingeckoPrice } from '../adapters/coingecko';
import { cmcPrice } from '../adapters/cmc';
import { metaxProPrice } from '../adapters/metaxpro';

export async function getPrice(token: TokenDef, fiat: Fiat): Promise<PriceResult> {
  const tryCG   = async () => await coingeckoPrice(token, fiat);
  const tryCMC  = async () => await cmcPrice(token, fiat);
  const tryMeta = async () => await metaxProPrice(fiat);

  if (token.symbol === 'AUBE') {
    const p1 = await tryMeta(); if (p1.ok) return p1;
    const p2 = await tryCG();   if (p2.ok) return p2;
    const p3 = await tryCMC();  if (p3.ok) return p3;
    return { ok: false, source: 'unknown', error: p1.error || p2.error || p3.error || 'unsupported' };
  }

  const pCG  = await tryCG();  if (pCG.ok)  return pCG;
  const pCMC = await tryCMC(); if (pCMC.ok) return pCMC;
  return { ok: false, source: 'unknown', error: pCG.error || pCMC.error || 'unsupported' };
}
