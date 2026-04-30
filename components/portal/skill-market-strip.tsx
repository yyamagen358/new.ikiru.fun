const skillPills = [
  { emoji: "🎵", label: "音楽制作" },
  { emoji: "✍️", label: "ライティング" },
  { emoji: "🤖", label: "AIプロンプト" },
  { emoji: "🎨", label: "画像生成" },
  { emoji: "📊", label: "動画編集" },
  { emoji: "🌸", label: "スピリチュアル鑑定" },
];

export function SkillMarketStrip() {
  return (
    <section
      id="asaichi"
      className="relative overflow-hidden py-16 px-5 [@media(min-width:900px)]:px-20"
      style={{ background: "linear-gradient(135deg, #2C1F1A 0%, #3D2B1F 100%)" }}
    >
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(232,180,184,0.12) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto grid grid-cols-1 [@media(min-width:900px)]:grid-cols-[1fr_auto] gap-12 items-center">
        <div>
          <h2 className="font-serif text-[2rem] text-portal-cream leading-[1.3] mb-3">
            スキル朝市
            <span className="block font-round text-[1.1rem] font-normal mt-1" style={{ color: "rgba(255,248,240,0.7)" }}>
              あなたの才能が、誰かの人生を変える
            </span>
          </h2>

          <p className="font-round text-[0.95rem] leading-[1.8] max-w-[520px]" style={{ color: "rgba(255,248,240,0.6)" }}>
            AIを使ったコンテンツ制作、音楽生成、ブログ記事作成…<br />
            あなたが積み上げてきたスキルを、必要としている人に届けましょう。
          </p>

          <div className="flex flex-wrap gap-[10px] mt-5">
            {skillPills.map((pill) => (
              <span
                key={pill.label}
                className="font-round text-[0.78rem] font-medium tracking-[0.04em] px-4 py-[6px] rounded-full"
                style={{
                  background: "rgba(255,248,240,0.10)",
                  border: "1px solid rgba(255,248,240,0.20)",
                  color: "rgba(255,248,240,0.8)",
                }}
              >
                {pill.emoji} {pill.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <a
            href="https://yyamagen358.github.io/asaichi-skills/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-round text-[0.95rem] font-bold tracking-[0.05em] text-portal-text-dark bg-portal-cream px-9 py-4 rounded-full whitespace-nowrap transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] inline-flex items-center gap-2"
          >
            朝市を見る →
          </a>
          <a
            href="https://yyamagen358.github.io/asaichi-skills/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-round text-[0.85rem] font-medium whitespace-nowrap px-7 py-3 rounded-full transition-all duration-200 inline-flex items-center gap-2 border border-white/25 text-white/70 hover:border-white/60 hover:text-white/95"
          >
            出品する
          </a>
        </div>
      </div>
    </section>
  );
}
