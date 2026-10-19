import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RefreshCw, i as Search, o as ExternalLink, r as Star, s as Activity, t as Waves } from "../_libs/lucide-react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as signalLabel, n as fmtPct, r as fmtUsd, t as fmtCompact } from "./score-DFY6aSYT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cds-QkCt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var scanEarly = createServerFn({ method: "GET" }).handler(createSsrRpc("1e12b887aeaee0b874b5be0c3120eb0b2b33a350e712b867ee04549b3e3243e2"));
var FILTERS = [
	{
		id: "all",
		label: "Semua early"
	},
	{
		id: "volume-lead",
		label: "Volume lead"
	},
	{
		id: "accumulation",
		label: "Accumulation"
	},
	{
		id: "range-break",
		label: "Range break"
	},
	{
		id: "lowcap-heat",
		label: "Low-cap heat"
	}
];
var CHAINS = [
	"all",
	"solana",
	"base",
	"ethereum",
	"bsc"
];
function Home() {
	const [coins, setCoins] = (0, import_react.useState)([]);
	const [scanned, setScanned] = (0, import_react.useState)(0);
	const [at, setAt] = (0, import_react.useState)(null);
	const [source, setSource] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [q, setQ] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [chain, setChain] = (0, import_react.useState)("all");
	const [watch, setWatch] = (0, import_react.useState)([]);
	const [onlyWatch, setOnlyWatch] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem("early-watch");
			if (raw) setWatch(JSON.parse(raw));
		} catch {}
	}, []);
	async function load() {
		setLoading(true);
		setError(null);
		try {
			const res = await scanEarly();
			setCoins(res.coins);
			setScanned(res.scanned);
			setAt(res.at);
			setSource(res.source);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Scan gagal");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	function toggleWatch(id) {
		setWatch((prev) => {
			const next = prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev].slice(0, 40);
			localStorage.setItem("early-watch", JSON.stringify(next));
			return next;
		});
	}
	const rows = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return coins.filter((c) => {
			if (chain !== "all" && c.chain !== chain) return false;
			if (filter !== "all" && !c.signals.includes(filter)) return false;
			if (onlyWatch && !watch.includes(c.id)) return false;
			if (!query) return true;
			return c.symbol.toLowerCase().includes(query) || c.name.toLowerCase().includes(query) || c.address.toLowerCase().includes(query);
		});
	}, [
		coins,
		q,
		filter,
		chain,
		onlyWatch,
		watch
	]);
	const counts = (0, import_react.useMemo)(() => {
		const c = { all: coins.length };
		for (const coin of coins) for (const s of coin.signals) c[s] = (c[s] || 0) + 1;
		return c;
	}, [coins]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-screen max-w-6xl px-4 py-6 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center gap-2 text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waves, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs tracking-widest uppercase",
							children: "Early Flow"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold tracking-tight md:text-3xl",
						children: "Screener sebelum momentum pecah"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm text-muted",
						children: "Tangkap koin saat volume dan akumulasi sudah naik, harga belum lari jauh. Bukan screener yang sudah hijau 100%."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-mono text-xs text-muted",
						children: [
							at ? new Date(at).toLocaleTimeString() : "—",
							" · ",
							scanned,
							" pair"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void load(),
						disabled: loading,
						className: "inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-4 ${loading ? "animate-spin" : ""}` }), "Scan"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Kandidat",
						value: String(coins.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Volume lead",
						value: String(counts["volume-lead"] || 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Accumulation",
						value: String(counts.accumulation || 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Range / low-cap",
						value: String((counts["range-break"] || 0) + (counts["lowcap-heat"] || 0))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-3 left-3 size-4 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Cari symbol, nama, atau address",
							className: "h-11 w-full rounded-lg border border-border bg-surface pr-3 pl-10 text-sm text-fg outline-none placeholder:text-muted focus:border-primary"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setFilter(f.id),
							className: `h-10 rounded-full px-3 text-sm ${filter === f.id ? "bg-primary text-primary-fg" : "bg-surface text-fg border border-border"}`,
							children: f.label
						}, f.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [CHAINS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setChain(c),
							className: `h-10 rounded-lg px-3 font-mono text-xs uppercase ${chain === c ? "bg-surface-2 text-primary border border-primary" : "text-muted border border-border"}`,
							children: c
						}, c)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setOnlyWatch((v) => !v),
							className: `ml-auto inline-flex h-10 items-center gap-1 rounded-lg px-3 text-sm ${onlyWatch ? "bg-warn text-primary-fg" : "border border-border text-muted"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4" }), "Watch"]
						})]
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 rounded-lg border border-down/40 bg-surface px-3 py-2 text-sm text-down",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 overflow-hidden rounded-xl border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden grid-cols-[2.2fr_0.8fr_0.9fr_0.9fr_0.8fr_1.4fr_0.5fr] gap-2 border-b border-border bg-surface px-3 py-2 font-mono text-xs text-muted md:grid",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Token" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-right",
							children: "Harga"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-right",
							children: "Mcap"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-right",
							children: "Vol 1h / 24h"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-right",
							children: "1h / 24h"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sinyal" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-right",
							children: "Skor"
						})
					]
				}), loading && coins.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-10 text-center text-sm text-muted",
					children: "Memindai pair DexScreener…"
				}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-10 text-center text-sm text-muted",
					children: "Tidak ada koin yang lolos filter early ini."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "border-b border-border last:border-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOpen(c),
						className: "grid w-full grid-cols-1 gap-2 px-3 py-3 text-left hover:bg-surface md:grid-cols-[2.2fr_0.8fr_0.9fr_0.9fr_0.8fr_1.4fr_0.5fr] md:items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									role: "button",
									tabIndex: 0,
									onClick: (e) => {
										e.stopPropagation();
										toggleWatch(c.id);
									},
									onKeyDown: (e) => {
										if (e.key === "Enter") {
											e.stopPropagation();
											toggleWatch(c.id);
										}
									},
									className: "mt-0.5 inline-flex size-8 items-center justify-center rounded-md border border-border",
									"aria-label": "watch",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-4 ${watch.includes(c.id) ? "fill-warn text-warn" : "text-muted"}` })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: c.symbol
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 text-sm text-muted",
										children: c.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-0.5 block font-mono text-xs text-muted uppercase",
										children: [
											c.chain,
											" · ",
											c.dex,
											c.social > 0 ? ` · heat ${c.social.toFixed(0)}` : ""
										]
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-sm md:text-right",
								children: fmtUsd(c.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-sm text-muted md:text-right",
								children: ["$", fmtCompact(c.mcap)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-sm md:text-right",
								children: [
									"$",
									fmtCompact(c.vol1),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted",
										children: [" / $", fmtCompact(c.vol24)]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-sm md:text-right",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pct, { v: c.chg1 }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: "/"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pct, { v: c.chg24 })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex flex-wrap gap-1",
								children: c.signals.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-primary",
									children: signalLabel(s)
								}, s))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-lg font-semibold text-primary md:text-right",
								children: c.score
							})
						]
					})
				}, c.id)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted",
				children: source
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 flex items-end justify-center bg-bg/70 p-3 md:items-center",
				onClick: () => setOpen(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "w-full max-w-lg rounded-xl border border-border bg-surface p-4 shadow-none",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-xl font-semibold",
								children: [
									open.symbol,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-normal text-muted",
										children: open.name
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs text-muted uppercase",
								children: [
									open.chain,
									" · ",
									open.dex
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-3xl font-semibold text-primary",
								children: open.score
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-fg",
							children: open.note
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 grid grid-cols-2 gap-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									k: "Harga",
									v: fmtUsd(open.price)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									k: "Market cap",
									v: `$${fmtCompact(open.mcap)}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									k: "Likuiditas",
									v: `$${fmtCompact(open.liq)}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									k: "Buy pressure 1h",
									v: `${(open.buyPressure * 100).toFixed(0)}%`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									k: "Vol / tx 1h",
									v: `$${fmtCompact(open.volPerTx)}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									k: "Social heat",
									v: open.social > 0 ? open.social.toFixed(1) : "tenang"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									k: "Δ 5m",
									v: fmtPct(open.chg5)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
									k: "Δ 6h",
									v: fmtPct(open.chg6)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: open.url,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }), "DexScreener"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setOpen(null),
								className: "h-11 rounded-lg border border-border px-4 text-sm",
								children: "Tutup"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 flex items-start gap-2 text-xs text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "mt-0.5 size-3 shrink-0" }), "Bukan sinyal beli. Cek chart, likuiditas, dan holder sendiri. GMGN tidak punya API publik — akumulasi di sini dari rasio buy dan ukuran transaksi."]
						})
					]
				})
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-surface px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-mono text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-2xl font-semibold",
			children: value
		})]
	});
}
function Pct({ v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: v > 0 ? "text-primary" : v < 0 ? "text-down" : "text-muted",
		children: fmtPct(v)
	});
}
function Meta({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-muted",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "font-mono",
		children: v
	})] });
}
//#endregion
export { Home as component };
