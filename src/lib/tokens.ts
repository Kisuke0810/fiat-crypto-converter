import type { TokenDef } from '../types/index.ts';

export const TOKENS: TokenDef[] = [
  { symbol: 'BTC',  label: 'BTC (Bitcoin)',    coingeckoId: 'bitcoin' },
  { symbol: 'ETH',  label: 'ETH (Ethereum)',   coingeckoId: 'ethereum' },
  { symbol: 'USDT', label: 'USDT (Tether)',    coingeckoId: 'tether' },
  { symbol: 'USDC', label: 'USDC (USD Coin)',  coingeckoId: 'usd-coin' },
  { symbol: 'SOL',  label: 'SOL (Solana)',     coingeckoId: 'solana' },
  { symbol: 'XRP',  label: 'XRP (Ripple)',     coingeckoId: 'ripple' },
  { symbol: 'BNB',  label: 'BNB (BNB)',        coingeckoId: 'binancecoin' },
  { symbol: 'ADA',  label: 'ADA (Cardano)',    coingeckoId: 'cardano' },
  { symbol: 'DOGE', label: 'DOGE (Dogecoin)',  coingeckoId: 'dogecoin' },
  { symbol: 'TRX',  label: 'TRX (TRON)',       coingeckoId: 'tron' },

  // 任意トークン（AUBE/SWK）。AUBEは後日正式APIが出るまでUIに残すだけでもOK。
  { symbol: 'AUBE', label: 'AUBE', prefer: 'metaxpro',
    contractAddress: '0x46ea0c865da3b7b78f3ad7b9b6aa41ef9a14dd45', network: 'ethereum' },
  { symbol: 'SWK',  label: 'SWK',
    contractAddress: '0xddfbe9173c90deb428fdd494cb16125653172919', network: 'ethereum' },
];

export const findToken = (sym: string) =>
  TOKENS.find(t => t.symbol.toLowerCase() === sym.toLowerCase());
