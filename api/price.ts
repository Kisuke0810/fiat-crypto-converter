// Vercel serverless function: /api/price
// - Primary source: CoinGecko
// - Fallback: CoinMarketCap (requires env key)
// - 5s timeout, up to 3 retries
// - 90s in-memory cache
// - JSON: { ok, symbol, fiat, price, source, cached?, error? }

type Fiat = 'jpy' | 'usd' | 'eur';

type Result = {
  ok: boolean;
  symbol?: string;
  fiat?: string;
  source?: 'cmc' | 'coingecko' | 'unknown';
  price?: { jpy?: number; usd?: number; eur?: number };
  cached?: boolean;
  error?: string;
};

type CacheVal = { ts: number; data: Result };

const cache = new Map<string, CacheVal>();
const CACHE_TTL_MS = 90 * 1000; // 90s
const TIMEOUT_MS = 5000; // 5s
const RETRIES = 3;

const CMC_BASE = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest';
const CG_BASE  = 'https://api.coingecko.com/api/v3';

function getKey(symbol: string, fiat: Fiat) {
  return `${symbol.toUpperCase()}:${fiat}`;
}

function now() { return Date.now(); }

function fromEnv(key: string): string | undefined {
  // Primary: CMC_API_KEY. Fallback: VITE_CMC_API_KEY
  return process.env[key] || process.env[`VITE_${key}`];
}

async function fetchWithTimeout(url: string, init?: RequestInit, timeoutMs = TIMEOUT_MS): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

async function withRetry<T>(fn: () => Promise<T>, retries = RETRIES): Promise<T> {
  let lastErr: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < retries - 1) await new Promise(r => setTimeout(r, 150 * (i + 1)));
    }
  }
  throw lastErr;
}

async function fetchCMC(symbol: string, fiat: Fiat): Promise<number | undefined> {
  const key = fromEnv('CMC_API_KEY');
  if (!key) throw new Error('no_key');
  const url = `${CMC_BASE}?symbol=${encodeURIComponent(symbol.toUpperCase())}&convert=${fiat.toUpperCase()}`;
  const r = await fetchWithTimeout(url, { headers: { 'X-CMC_PRO_API_KEY': key, accept: 'application/json' } });
  if (!r.ok) throw new Error(String(r.status));
  const j = await r.json();
  const data = j?.data?.[symbol.toUpperCase()]?.[0];
  const price = data?.quote?.[fiat.toUpperCase()]?.price;
  if (price == null) return undefined;
  return Number(price);
}

async function fetchCG(symbol: string, fiat: Fiat): Promise<number | undefined> {
  // Try by id mapping for common majors; otherwise fall back to /simple/price by id guess
  // For a limited scope, we map a few known symbols.
  const idMap: Record<string, string> = {
    BTC: 'bitcoin', ETH: 'ethereum', USDT: 'tether', USDC: 'usd-coin',
    SOL: 'solana', XRP: 'ripple', BNB: 'binancecoin', ADA: 'cardano', DOGE: 'dogecoin', TRX: 'tron'
  };
  const id = idMap[symbol.toUpperCase()];
  if (!id) return undefined;
  const url = `${CG_BASE}/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=${fiat}`;
  const r = await fetchWithTimeout(url, { headers: { accept: 'application/json' } });
  if (!r.ok) return undefined;
  const j = await r.json();
  return j?.[id]?.[fiat];
}

function ok(symbol: string, fiat: Fiat, price: number, source: Result['source'], cached = false): Result {
  return { ok: true, symbol, fiat, source, cached, price: { [fiat]: price } };
}

function fail(error: string, symbol?: string, fiat?: string, source: Result['source'] = 'unknown'): Result {
  return { ok: false, symbol, fiat, source, error };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method && req.method !== 'GET') {
      res.statusCode = 405; res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify({ ok: false, error: 'method_not_allowed' } satisfies Result));
    }

    // Support both VercelRequest (req.query) and Node IncomingMessage (req.url)
    const qSymbol = (req.query?.symbol ?? undefined) as string | undefined;
    const qFiat = (req.query?.fiat ?? undefined) as string | undefined;
    const url = new URL(req.url, `http://${req.headers.host}`);
    const symbol = (qSymbol ?? url.searchParams.get('symbol') ?? '').toString().toUpperCase();
    const fiat = ((qFiat ?? url.searchParams.get('fiat') ?? 'jpy').toString().toLowerCase()) as Fiat;

    if (!symbol) {
      res.statusCode = 400; res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify(fail('missing_symbol', undefined, fiat)));
    }
    if (!['jpy','usd','eur'].includes(fiat)) {
      res.statusCode = 400; res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify(fail('unsupported_fiat', symbol, fiat)));
    }

    const key = getKey(symbol, fiat);
    const c = cache.get(key);
    if (c && (now() - c.ts) < CACHE_TTL_MS) {
      res.statusCode = 200; res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify({ ...c.data, cached: true } satisfies Result));
    }

    // Try CoinGecko first, then fallback to CMC
    let price: number | undefined;
    let source: Result['source'] = 'coingecko';
    try {
      const cg = await withRetry(() => fetchCG(symbol, fiat));
      if (cg != null) price = cg;
    } catch (e: any) {
      // ignore and try CMC
    }
    if (price == null) {
      try {
        const cmc = await withRetry(() => fetchCMC(symbol, fiat));
        if (cmc != null) { price = cmc; source = 'cmc'; }
      } catch {}
    }

    if (price == null) {
      const out = fail('not_found', symbol, fiat);
      res.statusCode = 502; res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify(out));
    }

    const data = ok(symbol, fiat, price, source, false);
    cache.set(key, { ts: now(), data });
    res.statusCode = 200; res.setHeader('content-type', 'application/json');
    return res.end(JSON.stringify(data));
  } catch (e: any) {
    const out = fail(e?.message ?? 'error');
    res.statusCode = 500; res.setHeader('content-type', 'application/json');
    return res.end(JSON.stringify(out));
  }
}
