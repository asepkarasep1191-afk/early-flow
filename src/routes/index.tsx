import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ExternalLink,
  RefreshCw,
  Search,
  Star,
  Waves,
} from "lucide-react";
import { scanEarly } from "@/lib/scan";
import {
  fmtCompact,
  fmtPct,
  fmtUsd,
  reviewCoin,
  signalLabel,
  type ScoredCoin,
  type SignalId,
} from "@/lib/score";

export const Route = createFileRoute("/")({ component: Home });

const FILTERS: { id: "all" | SignalId; label: string }[] = [
  { id: "all", label: "Semua early" },
  { id: "volume-lead", label: "Volume lead" },
  { id: "accumulation", label: "Accumulation" },
  { id: "range-break", label: "Range break" },
  { id: "lowcap-heat", label: "Low-cap heat" },
];

const CHAINS = ["all", "solana", "base", "ethereum", "bsc"] as const;

function Home() {
  const [coins, setCoins] = useState<ScoredCoin[]>([]);
  const [scanned, setScanned] = useState(0);
  const [at, setAt] = useState<string | null>(null);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [chain, setChain] = useState<(typeof CHAINS)[number]>("all");
  const [watch, setWatch] = useState<string[]>([]);
  const [onlyWatch, setOnlyWatch] = useState(false);
  const [open, setOpen] = useState<ScoredCoin | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("early-watch");
      if (raw) setWatch(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
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

  useEffect(() => {
    void load();
  }, []);

  function toggleWatch(id: string) {
    setWatch((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev].slice(0, 40);
      localStorage.setItem("early-watch", JSON.stringify(next));
      return next;
    });
  }

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return coins.filter((c) => {
      if (chain !== "all" && c.chain !== chain) return false;
      if (filter !== "all" && !c.signals.includes(filter)) return false;
      if (onlyWatch && !watch.includes(c.id)) return false;
      if (!query) return true;
      return (
        c.symbol.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.address.toLowerCase().includes(query)
      );
    });
  }, [coins, q, filter, chain, onlyWatch, watch]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: coins.length };
    for (const coin of coins) for (const s of coin.signals) c[s] = (c[s] || 0) + 1;
    return c;
  }, [coins]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 md:px-6">
      <header className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Waves className="size-5" />
            <span className="font-mono text-xs tracking-widest uppercase">Early Flow</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Screener sebelum momentum pecah</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Tangkap koin saat volume dan akumulasi sudah naik, harga belum lari jauh. Bukan screener yang sudah hijau 100%.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs text-muted">
            {at ? new Date(at).toLocaleTimeString() : "—"} · {scanned} pair
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg disabled:opacity-60"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Scan
          </button>
        </div>
      </header>

      <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Kandidat" value={String(coins.length)} />
        <Stat label="Volume lead" value={String(counts["volume-lead"] || 0)} />
        <Stat label="Accumulation" value={String(counts.accumulation || 0)} />
        <Stat label="Range / low-cap" value={String((counts["range-break"] || 0) + (counts["lowcap-heat"] || 0))} />
      </section>

      <div className="mt-5 flex flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari symbol, nama, atau address"
            className="h-11 w-full rounded-lg border border-border bg-surface pr-3 pl-10 text-sm text-fg outline-none placeholder:text-muted focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`h-10 rounded-full px-3 text-sm ${
                filter === f.id ? "bg-primary text-primary-fg" : "bg-surface text-fg border border-border"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {CHAINS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChain(c)}
              className={`h-10 rounded-lg px-3 font-mono text-xs uppercase ${
                chain === c ? "bg-surface-2 text-primary border border-primary" : "text-muted border border-border"
              }`}
            >
              {c}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOnlyWatch((v) => !v)}
            className={`ml-auto inline-flex h-10 items-center gap-1 rounded-lg px-3 text-sm ${
              onlyWatch ? "bg-warn text-primary-fg" : "border border-border text-muted"
            }`}
          >
            <Star className="size-4" />
            Watch
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-down/40 bg-surface px-3 py-2 text-sm text-down">{error}</p>
      )}

      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <div className="hidden grid-cols-[2.2fr_0.8fr_0.9fr_0.9fr_0.8fr_1.4fr_0.5fr] gap-2 border-b border-border bg-surface px-3 py-2 font-mono text-xs text-muted md:grid">
          <span>Token</span>
          <span className="text-right">Harga</span>
          <span className="text-right">Mcap</span>
          <span className="text-right">Vol 1h / 24h</span>
          <span className="text-right">1h / 24h</span>
          <span>Sinyal</span>
          <span className="text-right">Skor</span>
        </div>
        {loading && coins.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">Memindai pair DexScreener…</p>
        ) : rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">Tidak ada koin yang lolos filter early ini.</p>
        ) : (
          <ul>
            {rows.map((c) => (
              <li key={c.id} className="border-b border-border last:border-0">
                <button
                  type="button"
                  onClick={() => setOpen(c)}
                  className="grid w-full grid-cols-1 gap-2 px-3 py-3 text-left hover:bg-surface md:grid-cols-[2.2fr_0.8fr_0.9fr_0.9fr_0.8fr_1.4fr_0.5fr] md:items-center"
                >
                  <div className="flex items-start gap-2">
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatch(c.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.stopPropagation();
                          toggleWatch(c.id);
                        }
                      }}
                      className="mt-0.5 inline-flex size-8 items-center justify-center rounded-md border border-border"
                      aria-label="watch"
                    >
                      <Star className={`size-4 ${watch.includes(c.id) ? "fill-warn text-warn" : "text-muted"}`} />
                    </span>
                    <span>
                      <span className="font-semibold">{c.symbol}</span>
                      <span className="ml-2 text-sm text-muted">{c.name}</span>
                      <span className="mt-0.5 block font-mono text-xs text-muted uppercase">
                        {c.chain} · {c.dex}
                        {c.social > 0 ? ` · heat ${c.social.toFixed(0)}` : ""}
                      </span>
                    </span>
                  </div>
                  <span className="font-mono text-sm md:text-right">{fmtUsd(c.price)}</span>
                  <span className="font-mono text-sm text-muted md:text-right">${fmtCompact(c.mcap)}</span>
                  <span className="font-mono text-sm md:text-right">
                    ${fmtCompact(c.vol1)}
                    <span className="text-muted"> / ${fmtCompact(c.vol24)}</span>
                  </span>
                  <span className="font-mono text-sm md:text-right">
                    <Pct v={c.chg1} /> <span className="text-muted">/</span> <Pct v={c.chg24} />
                  </span>
                  <span className="flex flex-wrap gap-1">
                    {c.signals.map((s) => (
                      <span key={s} className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-primary">
                        {signalLabel(s)}
                      </span>
                    ))}
                  </span>
                  <span className="font-mono text-lg font-semibold text-primary md:text-right">{c.score}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-3 text-xs text-muted">{source}</p>

      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-bg/70 p-3 md:items-center" onClick={() => setOpen(null)}>
          <article
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-surface p-4 shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  {open.symbol} <span className="text-sm font-normal text-muted">{open.name}</span>
                </h2>
                <p className="font-mono text-xs text-muted uppercase">{open.chain} · {open.dex}</p>
              </div>
              <div className="font-mono text-3xl font-semibold text-primary">{open.score}</div>
            </div>
            <p className="mt-3 text-sm text-fg">{open.note}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Meta k="Harga" v={fmtUsd(open.price)} />
              <Meta k="Market cap" v={`$${fmtCompact(open.mcap)}`} />
              <Meta k="Likuiditas" v={`$${fmtCompact(open.liq)}`} />
              <Meta k="Buy pressure 1h" v={`${(open.buyPressure * 100).toFixed(0)}%`} />
              <Meta k="Vol / tx 1h" v={`$${fmtCompact(open.volPerTx)}`} />
              <Meta k="Tx 1h" v={String(open.tx1)} />
              <Meta k="Δ 5m" v={fmtPct(open.chg5)} />
              <Meta k="Δ 6h" v={fmtPct(open.chg6)} />
            </dl>
            <Review coin={open} />
            <div className="mt-4 flex gap-2">
              <a
                href={open.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-fg"
              >
                <ExternalLink className="size-4" />
                DexScreener
              </a>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="h-11 rounded-lg border border-border px-4 text-sm"
              >
                Tutup
              </button>
            </div>
            <p className="mt-3 flex items-start gap-2 text-xs text-muted">
              <Activity className="mt-0.5 size-3 shrink-0" />
              Bukan sinyal beli. Cek chart, likuiditas, dan holder sendiri. GMGN tidak punya API publik — akumulasi di sini dari rasio buy dan ukuran transaksi.
            </p>
          </article>
        </div>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-3">
      <div className="font-mono text-xs text-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Pct({ v }: { v: number }) {
  const cls = v > 0 ? "text-primary" : v < 0 ? "text-down" : "text-muted";
  return <span className={cls}>{fmtPct(v)}</span>;
}

function Review({ coin }: { coin: ScoredCoin }) {
  const review = reviewCoin(coin);
  const tone =
    review.tone === "wait" ? "text-down" : review.tone === "check" ? "text-warn" : "text-primary";
  return (
    <section className="mt-4 rounded-lg border border-border bg-bg px-3 py-3">
      <h3 className={`text-sm font-semibold ${tone}`}>{review.headline}</h3>
      <div className="mt-3 border-t border-border pt-3">
        <div className="text-xs text-muted">Harga entry disarankan</div>
        <div className="font-mono text-2xl font-semibold">{review.entry == null ? "Tidak ada" : fmtUsd(review.entry)}</div>
        <p className="mt-1 text-sm text-muted">{review.entryNote}</p>
      </div>
      <ul className="mt-3 flex flex-col gap-2 text-sm text-fg">
        {review.points.map((point) => (
          <li key={point} className="border-t border-border pt-2 first:border-0 first:pt-0">
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="font-mono">{v}</dd>
    </div>
  );
}
