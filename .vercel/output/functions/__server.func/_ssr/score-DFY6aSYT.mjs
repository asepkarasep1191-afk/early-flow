//#region node_modules/.nitro/vite/services/ssr/assets/score-DFY6aSYT.js
var SIGNAL_LABEL = {
	"volume-lead": "Volume lead",
	accumulation: "Accumulation",
	"range-break": "Range break",
	"lowcap-heat": "Low-cap heat"
};
function signalLabel(id) {
	return SIGNAL_LABEL[id];
}
function n(v) {
	return typeof v === "number" && Number.isFinite(v) ? v : 0;
}
function scorePair(p, socialBoost) {
	const price = Number(p.priceUsd || 0);
	if (!price || !p.baseToken?.symbol) return null;
	const mcap = n(p.marketCap) || n(p.fdv);
	const liq = n(p.liquidity?.usd);
	const vol24 = n(p.volume?.h24);
	const vol1 = n(p.volume?.h1);
	const vol6 = n(p.volume?.h6);
	const chg5 = n(p.priceChange?.m5);
	const chg1 = n(p.priceChange?.h1);
	const chg6 = n(p.priceChange?.h6);
	const chg24 = n(p.priceChange?.h24);
	if (vol24 < 25e3 || liq < 8e3) return null;
	if (chg24 > 180) return null;
	const buys1 = n(p.txns?.h1?.buys);
	const tx1 = buys1 + n(p.txns?.h1?.sells);
	const buyPressure = tx1 > 0 ? buys1 / tx1 : .5;
	const volPerTx = tx1 > 0 ? vol1 / tx1 : 0;
	const hourlyPace = vol6 > 0 ? vol6 / 6 : 0;
	const volLeadRatio = hourlyPace > 0 ? vol1 / hourlyPace : vol1 > 5e3 ? 2 : 0;
	const priceStillEarly = chg24 < 35 && chg1 < 18 && chg1 > -8;
	const volumeLead = volLeadRatio >= 1.35 && vol1 >= 8e3 && priceStillEarly;
	const accumulation = buyPressure >= .58 && volPerTx >= 180 && chg1 < 12 && chg24 < 40 && vol1 >= 6e3;
	const rangeBreak = (Math.abs(chg6) < 12 || chg6 < 2) && chg1 >= 3 && chg1 <= 22 && volLeadRatio >= 1.2 && vol1 >= 1e4;
	const turnover = mcap > 0 ? vol24 / mcap : 0;
	const lowcapHeat = mcap > 0 && mcap <= 25e6 && turnover >= .15 && chg24 < 60 && (socialBoost > 0 || volLeadRatio >= 1.15);
	const signals = [];
	if (volumeLead) signals.push("volume-lead");
	if (accumulation) signals.push("accumulation");
	if (rangeBreak) signals.push("range-break");
	if (lowcapHeat) signals.push("lowcap-heat");
	if (signals.length === 0) return null;
	let score = 0;
	score += Math.min(28, (volLeadRatio - 1) * 16);
	score += Math.min(22, Math.max(0, buyPressure - .5) * 90);
	score += Math.min(16, Math.log10(Math.max(volPerTx, 1)) * 4);
	if (rangeBreak) score += 14;
	if (lowcapHeat) score += 12 + Math.min(8, socialBoost * 2);
	if (priceStillEarly) score += 8;
	if (chg24 < 0 && chg1 > 0) score += 6;
	if (chg1 > 25) score -= 10;
	if (chg24 > 80) score -= 12;
	if (liq < 2e4) score -= 4;
	score = Math.max(1, Math.min(99, Math.round(score)));
	const notes = [];
	if (volumeLead) notes.push(`vol 1h ${volLeadRatio.toFixed(1)}× pace, price masih +${chg24.toFixed(0)}% / 24h`);
	if (accumulation) notes.push(`buy ${(buyPressure * 100).toFixed(0)}% · $${Math.round(volPerTx)} / tx`);
	if (rangeBreak) notes.push(`keluar range, +${chg1.toFixed(1)}% / 1h`);
	if (lowcapHeat) notes.push(`mcap $${fmtCompact(mcap)} · turnover ${(turnover * 100).toFixed(0)}%`);
	return {
		id: `${p.chainId}:${p.baseToken.address}`,
		symbol: p.baseToken.symbol,
		name: p.baseToken.name,
		chain: p.chainId,
		dex: p.dexId,
		address: p.baseToken.address,
		url: p.url,
		price,
		mcap,
		liq,
		vol24,
		vol1,
		vol6,
		chg5,
		chg1,
		chg6,
		chg24,
		buyPressure,
		volPerTx,
		social: socialBoost,
		signals,
		score,
		note: notes.join(" · ")
	};
}
function fmtUsd(v) {
	if (!Number.isFinite(v) || v === 0) return "—";
	if (v >= 1) return `$${v.toLocaleString(void 0, { maximumFractionDigits: 2 })}`;
	if (v >= .01) return `$${v.toFixed(4)}`;
	return `$${v.toPrecision(3)}`;
}
function fmtCompact(v) {
	if (!Number.isFinite(v) || v <= 0) return "—";
	if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
	if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
	if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
	return v.toFixed(0);
}
function fmtPct(v) {
	return `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
}
//#endregion
export { signalLabel as a, scorePair as i, fmtPct as n, fmtUsd as r, fmtCompact as t };
