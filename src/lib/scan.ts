import { createServerFn } from "@tanstack/react-start";
import { scorePair, type PairRaw, type ScoredCoin } from "./score";

type Listing = { chainId?: string; tokenAddress?: string; amount?: number; totalAmount?: number };

const LIST_URLS = [
  "https://api.dexscreener.com/token-boosts/latest/v1",
  "https://api.dexscreener.com/token-boosts/top/v1",
  "https://api.dexscreener.com/token-profiles/latest/v1",
  "https://api.dexscreener.com/community-takeovers/latest/v1",
];

async function getJson<T>(url: string): Promise<T | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12_000);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { accept: "application/json" } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function chunks<T>(items: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export const scanEarly = createServerFn({ method: "GET" }).handler(async (): Promise<{
  coins: ScoredCoin[];
  scanned: number;
  at: string;
  source: string;
}> => {
  const lists = await Promise.all(LIST_URLS.map((url) => getJson<Listing[]>(url)));
  const social = new Map<string, number>();
  const byChain = new Map<string, string[]>();

  for (const list of lists) {
    for (const item of list || []) {
      if (!item.chainId || !item.tokenAddress) continue;
      const addr = item.tokenAddress;
      const key = `${item.chainId}:${addr.toLowerCase()}`;
      const heat = Math.min(6, ((item.totalAmount || item.amount || 10) / 40) + 1);
      social.set(key, (social.get(key) || 0) + heat);
      const bucket = byChain.get(item.chainId) || [];
      if (!bucket.some((a) => a.toLowerCase() === addr.toLowerCase())) bucket.push(addr);
      byChain.set(item.chainId, bucket);
    }
  }

  const jobs: Promise<PairRaw[] | null>[] = [];
  for (const [chain, addrs] of byChain) {
    for (const group of chunks(addrs.slice(0, 90), 30)) {
      const url = `https://api.dexscreener.com/tokens/v1/${chain}/${group.join(",")}`;
      jobs.push(getJson<PairRaw[]>(url));
    }
  }
  const pairGroups = await Promise.all(jobs);

  const best = new Map<string, PairRaw>();
  let scanned = 0;
  for (const group of pairGroups) {
    for (const pair of group || []) {
      scanned += 1;
      const base = pair.baseToken?.address;
      if (!base || !pair.chainId) continue;
      const key = `${pair.chainId}:${base.toLowerCase()}`;
      const prev = best.get(key);
      const liq = pair.liquidity?.usd || 0;
      if (!prev || liq > (prev.liquidity?.usd || 0)) best.set(key, pair);
    }
  }

  const coins: ScoredCoin[] = [];
  for (const [key, pair] of best) {
    const scored = scorePair(pair, social.get(key) || 0);
    if (scored) coins.push(scored);
  }
  coins.sort((a, b) => b.score - a.score || b.vol1 - a.vol1);

  return {
    coins: coins.slice(0, 80),
    scanned,
    at: new Date().toISOString(),
    source:
      "DexScreener boost, profile, dan takeover terbaru. Major (SOL/ETH/BTC/stable) dibuang. Akumulasi dari rasio beli, bukan feed GMGN.",
  };
});