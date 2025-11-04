import type { Fiat, PriceResult, TokenDef } from '../types/index.ts';
import { coingeckoPrice } from '../adapters/coingecko';
import { cmcPrice } from '../adapters/cmc';

export async function getPrice(token: TokenDef, fiat: Fiat): Promise<PriceResult> {
  const tryCG   = async () => await coingeckoPrice(token, fiat);
  const tryCMC  = async () => await cmcPrice(token, fiat);

  const pCG  = await tryCG();  if (pCG.ok)  return pCG;
  const pCMC = await tryCMC(); if (pCMC.ok) return pCMC;
  return { ok: false, source: 'unknown', error: pCG.error || pCMC.error || 'unsupported' };
}
