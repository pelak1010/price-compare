export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-16 gap-8">
      
      {/* Logo */}
      <div className="text-3xl font-bold text-white tracking-tight">
        price<span className="text-indigo-400">wise</span>
      </div>

      {/* Tagline */}
      <p className="text-[#888] text-center max-w-md text-[15px] leading-relaxed">
        Search any product. Compare prices across the web. Get an AI-powered best-pick verdict instantly.
      </p>

      {/* Search bar */}
      <div className="w-full max-w-xl flex rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#141414]">
        <input
          type="text"
          placeholder="Search for a product e.g. Sony WH-1000XM5..."
          className="flex-1 bg-transparent border-none outline-none px-5 py-4 text-white text-[15px] placeholder-[#555]"
        />
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-4 text-sm font-medium transition-colors whitespace-nowrap">
          Compare prices
        </button>
      </div>

      {/* Trending searches */}
      <div className="flex gap-2 flex-wrap justify-center items-center">
        <span className="text-[#555] text-xs">Trending:</span>
        {["MacBook Air M3", "Nike Air Max", "Dyson V15", "GoPro Hero 13"].map((item) => (
          <button key={item} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1 text-xs text-[#888] hover:border-indigo-500 hover:text-indigo-400 transition-colors">
            {item}
          </button>
        ))}
      </div>

      {/* Feature pills */}
      <div className="grid grid-cols-3 gap-3 max-w-xl w-full">
        {[
          { icon: "🔍", title: "10+ retailers", desc: "Amazon, PB Tech, Mighty Ape and more" },
          { icon: "🤖", title: "AI verdict", desc: "Claude picks the best deal for you" },
          { icon: "🔔", title: "Price alerts", desc: "Get notified when prices drop" },
        ].map((f) => (
          <div key={f.title} className="bg-[#111] border border-[#1e1e1e] rounded-xl p-4">
            <div className="text-lg mb-1">{f.icon}</div>
            <div className="text-xs font-semibold text-[#ccc] mb-1">{f.title}</div>
            <div className="text-xs text-[#555] leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </div>

    </main>
  );
}