export type Fiat = 'jpy' | 'usd' | 'eur';
export type CoinSymbol =
  | 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'SOL' | 'XRP' | 'BNB' | 'ADA' | 'DOGE' | 'TRX'
  | 'SWK';
export interface PriceMap { jpy?: number; usd?: number; eur?: number; }
export interface PriceResult { ok: boolean; source: 'coingecko' | 'cmc' | 'unknown'; price?: PriceMap; error?: string; }
export interface TokenDef {
  symbol: CoinSymbol; label: string; coingeckoId?: string;
  contractAddress?: string; network?: 'ethereum';
}

