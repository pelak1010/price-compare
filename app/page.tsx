"use client";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  }

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
            <button key={item} onClick={() => { setQuery(item); }} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1 text-xs text-[#888] hover:border-indigo-500 hover:text-indigo-400 transition-colors">
              {item}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="text-[#555] text-sm animate-pulse">Finding the best prices...</div>
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