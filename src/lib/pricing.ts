import type { Fiat, PriceResult, TokenDef } from '../types';
import { coingeckoPrice } from '../adapters/coingecko';
import { cmcPrice } from '../adapters/cmc';
export async function getPrice(token: TokenDef, fiat: Fiat): Promise<PriceResult> {
  const pCG = await coingeckoPrice(token, fiat);
  if (pCG.ok) return { ...pCG, fetchedAt: Date.now() };
  const pCMC = await cmcPrice(token, fiat);
  if (pCMC.ok) return { ...pCMC, fetchedAt: Date.now() };
  return { ok: false, source: 'unknown', error: pCG.error || pCMC.error || 'unsupported' };
}
