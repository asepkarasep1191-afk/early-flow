import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { i as scorePair } from "./score-DFY6aSYT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-CZuihAIt.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var SEARCHES = [
	"solana",
	"base",
	"ethereum",
	"bsc",
	"pepe",
	"ai",
	"dog",
	"cat"
];
async function getJson(url) {
	const ctrl = new AbortController();
	const t = setTimeout(() => ctrl.abort(), 12e3);
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			headers: { accept: "application/json" }
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	} finally {
		clearTimeout(t);
	}
}
var scanEarly_createServerFn_handler = createServerRpc({
	id: "1e12b887aeaee0b874b5be0c3120eb0b2b33a350e712b867ee04549b3e3243e2",
	name: "scanEarly",
	filename: "src/lib/scan.ts"
}, (opts) => scanEarly.__executeServer(opts));
var scanEarly = createServerFn({ method: "GET" }).handler(scanEarly_createServerFn_handler, async () => {
	const [boosts, profiles, ...searches] = await Promise.all([
		getJson("https://api.dexscreener.com/token-boosts/top/v1"),
		getJson("https://api.dexscreener.com/token-profiles/latest/v1"),
		...SEARCHES.map((q) => getJson(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(q)}`))
	]);
	const social = /* @__PURE__ */ new Map();
	for (const b of [...boosts || [], ...profiles || []]) {
		if (!b.tokenAddress || !b.chainId) continue;
		const key = `${b.chainId}:${b.tokenAddress.toLowerCase()}`;
		const amt = (b.totalAmount || b.amount || 1) > 0 ? Math.min(6, (b.totalAmount || b.amount || 1) / 50 + 1) : 1;
		social.set(key, (social.get(key) || 0) + amt);
	}
	const seen = /* @__PURE__ */ new Set();
	const coins = [];
	let scanned = 0;
	for (const s of searches) for (const pair of s?.pairs || []) {
		scanned += 1;
		const key = `${pair.chainId}:${pair.baseToken?.address}`;
		if (!pair.baseToken?.address || seen.has(key)) continue;
		seen.add(key);
		const heat = social.get(`${pair.chainId}:${pair.baseToken.address.toLowerCase()}`) || 0;
		const scored = scorePair(pair, heat);
		if (scored) coins.push(scored);
	}
	coins.sort((a, b) => b.score - a.score);
	return {
		coins: coins.slice(0, 80),
		scanned,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		source: "DexScreener live · boost/profile = social heat · buy-pressure = smart-money proxy (GMGN-style)"
	};
});
//#endregion
export { scanEarly_createServerFn_handler };
