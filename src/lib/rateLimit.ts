type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type Store = Map<string, RateLimitBucket>;

function getStore(): Store {
  const g = globalThis as unknown as { __afiuRateLimitStore?: Store };
  if (!g.__afiuRateLimitStore) g.__afiuRateLimitStore = new Map();
  return g.__afiuRateLimitStore;
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit(key: string, opts: { windowMs: number; max: number }): RateLimitResult {
  const now = Date.now();
  const store = getStore();

  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    const resetAt = now + opts.windowMs;
    store.set(key, { count: 1, resetAt });
    return { ok: true, remaining: Math.max(0, opts.max - 1), resetAt };
  }

  current.count += 1;
  store.set(key, current);

  const remaining = Math.max(0, opts.max - current.count);
  return { ok: current.count <= opts.max, remaining, resetAt: current.resetAt };
}

export function getClientIpFromHeaders(headers: Headers): string {
  const xf = headers.get('x-forwarded-for');
  if (xf) return xf.split(',')[0].trim();
  const xr = headers.get('x-real-ip');
  if (xr) return xr.trim();
  return 'unknown';
}
