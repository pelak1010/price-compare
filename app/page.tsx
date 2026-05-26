"use client";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [verdict, setVerdict] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingVerdict, setLoadingVerdict] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    setVerdict("");
    setHistory([]);

    const [searchRes, historyRes] = await Promise.all([
      fetch(`/api/search?q=${encodeURIComponent(query)}`),
      fetch(`/api/history?q=${encodeURIComponent(query)}`),
    ]);

    const searchData = await searchRes.json();
    const historyData = await historyRes.json();

    const items = searchData.results || [];
    setResults(items);
    setHistory(historyData.history || []);
    setLoading(false);

    if (items.length > 0) {
      setLoadingVerdict(true);
      const v = await fetch("/api/verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, results: items }),
      });
      const vdata = await v.json();
      setVerdict(vdata.verdict);
      setLoadingVerdict(false);
    }
  }

  // Build chart data from history
  const chartData = (() => {
    if (history.length < 2) return null;
    const bySource: Record<string, { date: string; price: number }[]> = {};
    history.forEach((h) => {
      const price = parseFloat(h.price?.replace(/[^0-9.]/g, "") || "0");
      if (!price) return;
      if (!bySource[h.source]) bySource[h.source] = [];
      bySource[h.source].push({
        date: new Date(h.searched_at).toLocaleDateString(),
        price,
      });
    });
    return bySource;
  })();

  const maxPrice = chartData
    ? Math.max(...Object.values(chartData).flat().map((d) => d.price))
    : 0;

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center px-4 py-16 gap-8">

      <div className="text-3xl font-bold text-white tracking-tight">
        price<span className="text-indigo-400">wise</span>
      </div>

      <p className="text-[#888] text-center max-w-md text-[15px] leading-relaxed">
        Search any product. Compare prices across the web. Get an AI-powered best-pick verdict instantly.
      </p>

      <div className="w-full max-w-xl flex rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#141414]">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search for a product e.g. Sony WH-1000XM5..."
          className="flex-1 bg-transparent border-none outline-none px-5 py-4 text-white text-[15px] placeholder-[#555]"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-4 text-sm font-medium transition-colors whitespace-nowrap"
        >
          {loading ? "Searching..." : "Compare prices"}
        </button>
      </div>

      {!results.length && !loading && (
        <div className="flex gap-2 flex-wrap justify-center items-center">
          <span className="text-[#555] text-xs">Trending:</span>
          {["MacBook Air M3", "Nike Air Max", "Dyson V15", "GoPro Hero 13"].map((item) => (
            <button key={item} onClick={() => setQuery(item)}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1 text-xs text-[#888] hover:border-indigo-500 hover:text-indigo-400 transition-colors">
              {item}
            </button>
          ))}
        </div>
      )}

      {loading && <div className="text-[#555] text-sm animate-pulse">Finding the best prices...</div>}

      {(verdict || loadingVerdict) && (
        <div className="w-full max-w-2xl bg-indigo-950 border border-indigo-800 rounded-xl p-5">
          <div className="text-indigo-400 text-xs font-semibold mb-2">🤖 AI BEST-PICK VERDICT</div>
          {loadingVerdict
            ? <div className="text-indigo-300 text-sm animate-pulse">Analysing results...</div>
            : <div className="text-indigo-100 text-sm leading-relaxed">{verdict}</div>
          }
        </div>
      )}

      {chartData && Object.keys(chartData).length > 0 && (
        <div className="w-full max-w-2xl bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
          <div className="text-[#888] text-xs font-semibold mb-4">📈 PRICE HISTORY</div>
          <div className="flex flex-col gap-3">
            {Object.entries(chartData).slice(0, 5).map(([source, points]) => (
              <div key={source}>
                <div className="text-[#555] text-xs mb-1">{source}</div>
                <div className="flex items-end gap-1 h-12">
                  {points.slice(-10).map((p, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-indigo-600 rounded-sm"
                        style={{ height: `${Math.max(4, (p.price / maxPrice) * 40)}px` }}
                        title={`${p.date}: $${p.price}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-[#333] text-xs mt-2">{history.length} price points recorded</div>
        </div>
      )}

      {results.length > 0 && (
        <div className="w-full max-w-2xl flex flex-col gap-3">
          <div className="text-[#555] text-xs">{results.length} results for "{query}"</div>
          {results.map((r, i) => (
            <a key={i} href={r.link} target="_blank" rel="noopener noreferrer"
              className="flex gap-4 bg-[#111] border border-[#1e1e1e] rounded-xl p-4 hover:border-indigo-500 transition-colors">
              {r.thumbnail && <img src={r.thumbnail} alt={r.title} className="w-16 h-16 object-contain rounded-lg bg-[#1a1a1a]" />}
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{r.title}</div>
                <div className="text-[#888] text-xs mt-1">{r.source}</div>
                {r.rating && <div className="text-[#555] text-xs mt-1">⭐ {r.rating} ({r.reviews} reviews)</div>}
              </div>
              <div className="text-indigo-400 font-bold text-lg shrink-0">{r.price}</div>
            </a>
          ))}
        </div>
      )}

    </main>
  );
}