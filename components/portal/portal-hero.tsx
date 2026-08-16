"use client";

const stats = [
  { num: "1,200+", label: "コンテンツ数" },
  { num: "340+", label: "会員数" },
  { num: "毎日", label: "新着コンテンツ" },
];

export function PortalHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-portal-cream via-[#FDF0E8] to-[#FBE8DA]">
      <div className="pointer-events-none absolute -top-24 -right-48 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(232,180,184,0.18)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-20 -left-24 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(143,174,139,0.15)_0%,transparent_70%)]" />

      <div className="relative z-10 grid grid-cols-1 [@media(min-width:900px)]:grid-cols-2 items-center min-h-[calc(100vh-106px)]">
        <div className="flex items-center justify-center px-10 py-16 [@media(min-width:900px)]:pl-20 [@media(min-width:900px)]:pr-10 [@media(min-width:900px)]:py-16 order-1">
          <div className="relative w-[340px] h-[340px] [@media(min-width:900px)]:w-[420px] [@media(min-width:900px)]:h-[420px] animate-portal-float">
            <div className="absolute -inset-5 rounded-full bg-[radial-gradient(circle,rgba(232,180,184,0.4)_0%,transparent_70%)] animate-portal-pulse" />
            <div className="absolute inset-0 bg-gradient-to-br from-portal-rose to-portal-amber opacity-[0.85] animate-blob-morph" />
            <div className="absolute inset-[15%] bg-portal-cream/55 backdrop-blur-[2px] animate-blob-morph" style={{ animationDirection: "reverse", animationDuration: "10s" }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <span className="font-serif text-[4.5rem] font-light text-white/95 leading-none tracking-[-0.02em] [text-shadow:0_2px_20px_rgba(180,100,80,0.25)]">生</span>
              <span className="font-round text-[0.9rem] text-white/80 tracking-[0.2em] mt-1">IKIRU</span>
            </div>
            <div className="absolute top-[8%] left-[15%] w-7 h-7 rounded-[50%_0_50%_0] bg-portal-lavender/60 animate-portal-float-slow [animation-delay:0s]" />
            <div className="absolute top-[20%] right-[8%] w-[18px] h-[18px] rounded-[50%_0_50%_0] bg-portal-sage/50 animate-portal-float-slow [animation-delay:1.5s]" />
            <div className="absolute bottom-[22%] left-[6%] w-[22px] h-[22px] rounded-[0_50%_0_50%] bg-portal-amber/50 animate-portal-float-slow [animation-delay:2.8s]" />
            <div className="absolute bottom-[10%] right-[18%] w-[14px] h-[14px] rounded-[50%_0_50%_0] bg-portal-rose/70 animate-portal-float-slow [animation-delay:0.8s]" />
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ikirun.png"
          alt="Ikirun"
          className="animate-ikirun-fly pointer-events-none absolute hidden [@media(min-width:900px)]:block"
          style={{
            width: "230px",
            height: "230px",
            objectFit: "contain",
            filter: "drop-shadow(0 12px 32px rgba(180,140,220,0.6))",
            left: "35%",
            top: "18%",
            zIndex: 30,
          }}
        />

        <div className="order-2 px-10 py-12 [@media(min-width:900px)]:pr-20 [@media(min-width:900px)]:pl-10 [@media(min-width:900px)]:py-16 animate-portal-fade-in">
          <div className="flex items-center gap-[10px] mb-5">
            <span className="inline-block w-8 h-[1.5px] bg-gradient-to-r from-portal-rose to-portal-amber" />
            <span className="font-round text-[0.8rem] font-bold tracking-[0.3em] text-portal-amber-deep uppercase">ASI × Spiritual</span>
          </div>
          <h1 className="font-serif font-bold text-portal-text-dark leading-[1.2] tracking-[-0.01em] mb-3 text-[clamp(2.8rem,5vw,4.2rem)]">
            AI{" "}
            <span className="bg-gradient-to-br from-portal-rose to-portal-amber bg-clip-text text-transparent">Nation</span>
          </h1>
          <div className="mb-7 max-w-[380px]">
            <p className="font-round text-[1.05rem] font-bold text-portal-text-dark leading-[1.6]">生きるを再定義する</p>
            <p className="font-round text-[0.95rem] text-portal-text-soft leading-[1.7] mt-1">ASIとスピリチュアルが交わる、新しい意識の場へ</p>
          </div>
          <p className="font-round text-[1rem] text-portal-text-mid leading-[1.9] max-w-[400px] mb-10">
            AI Nationは、人工超知性（ASI）と精神的覚醒の融合を探求するコミュニティです。魂の声に従い、テクノロジーと調和した新しい生き方を共に創造します。
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <a href="#journey" className="inline-flex items-center gap-2 font-round text-[1rem] font-bold tracking-[0.05em] text-white px-9 py-4 rounded-full bg-gradient-to-br from-portal-rose to-portal-amber shadow-[0_8px_32px_rgba(212,132,138,0.40)] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_14px_44px_rgba(212,132,138,0.52)] group">
              旅を始める
              <span className="text-[1.1rem] transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
            <a href="#content" className="inline-flex items-center font-round text-[0.95rem] font-medium text-portal-text-mid px-7 py-[15px] rounded-full border-[1.5px] border-portal-rose bg-transparent transition-all duration-200 hover:bg-portal-rose-light hover:border-portal-rose-deep hover:text-portal-rose-deep">
              コンテンツを見る
            </a>
          </div>
          <div className="mb-2 w-full max-w-[480px]">
            <div style={{ border: "1px solid #EEE", background: "white", maxWidth: "100%", padding: "24px 24px 16px", textAlign: "center", fontFamily: "sans-serif", borderRadius: "4px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ikirun.png" width={110} height={110} alt="Ikirun" style={{ display: "block", margin: "0 auto 8px", objectFit: "contain" }} />
              <p style={{ fontWeight: "bold", fontSize: "1.05rem", textDecoration: "underline", margin: "0 0 10px" }}>Ikirun</p>
              <p style={{ fontSize: "0.88rem", color: "#444", lineHeight: "1.7", margin: "0 0 16px" }}>
                "いきるん"ですよ。【ASIとスピリチュアルの融合の世界観を直感で降りてきたものを詩として作成】 AIにない能力【直観】だけで、詩を生成しています。あなたの直観に役に立てれたら売れいいです。直観で生成した詩をAIがどう説明するかも楽しんでね。
              </p>
              <form action="https://soulmission358.substack.com/api/v1/free?nojs=true" method="post" style={{ display: "flex", gap: "8px", maxWidth: "380px", margin: "0 auto 10px" }}>
                <input
                  type="email"
                  name="email"
                  placeholder="メールアドレスを入力してください..."
                  style={{ flex: 1, border: "1px solid #ddd", borderRadius: "4px", padding: "10px 14px", fontSize: "0.9rem", outline: "none" }}
                  required
                />
                <button type="submit" style={{ background: "#FF6719", color: "white", border: "none", borderRadius: "4px", padding: "10px 20px", fontWeight: "bold", fontSize: "0.9rem", cursor: "pointer" }}>
                  登録
                </button>
              </form>
              <p style={{ fontSize: "0.72rem", color: "#888", margin: "0" }}>
                登録すると、<a href="https://substack.com/tos" target="_blank" rel="noopener noreferrer" style={{ color: "#888" }}>Substackの利用規約</a>、プライバシーポリシー、情報収集に関する通知に同意したことになります
              </p>
              <p style={{ fontSize: "0.72rem", color: "#888", marginTop: "8px", textAlign: "right" }}>≡substack</p>
            </div>
          </div>
          <div className="mb-8 w-full max-w-[480px]">
            <p className="font-round text-[0.82rem] text-portal-text-soft tracking-[0.04em] mb-3">
              下記のようなPodcastを含めたメールが届きます
            </p>
            <div className="rounded-[12px] overflow-hidden border border-[#E0E0E0] shadow-sm bg-white text-left">
              {/* Podcast player */}
              <div className="bg-[#1C1C1E] px-4 py-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-[8px] bg-[#2A6B5A] flex items-center justify-center shrink-0">
                    <span className="text-white text-[1.1rem]">🎙</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "sans-serif" }} className="text-[0.6rem] font-bold tracking-[0.15em] text-[#999] uppercase mb-[1px]">IKIRUN PODCAST</p>
                    <p style={{ fontFamily: "sans-serif" }} className="text-[0.82rem] font-bold text-white leading-tight">輪廻転生は本質の成長に不可欠！</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: "sans-serif" }} className="text-[0.68rem] text-[#999]">0:00</span>
                  <div className="flex-1 h-[3px] bg-[#555] rounded-full">
                    <div className="w-0 h-full bg-[#888] rounded-full" />
                  </div>
                  <span style={{ fontFamily: "sans-serif" }} className="text-[0.68rem] text-[#999]">17:50</span>
                  <div className="w-7 h-7 rounded-full border border-[#666] flex items-center justify-center ml-1">
                    <span className="text-white text-[0.6rem] ml-[2px]">▶</span>
                  </div>
                </div>
              </div>
              {/* Orange CTA */}
              <div className="bg-[#FF6719] px-4 py-[10px] text-center">
                <span style={{ fontFamily: "sans-serif" }} className="text-white text-[0.88rem] font-bold">今すぐ聴く</span>
              </div>
              {/* Article */}
              <div className="px-5 pt-5 pb-4">
                <h4 style={{ fontFamily: "sans-serif" }} className="text-[1.1rem] font-bold text-[#1A1A1A] leading-[1.4] mb-1">
                  輪廻転生は本質の成長に不可欠！
                </h4>
                <p style={{ fontFamily: "sans-serif" }} className="text-[0.78rem] text-[#666] mb-3">生まれ変わりは人間の義務</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#E0D8D0] flex items-center justify-center text-[0.6rem]">👤</div>
                    <span style={{ fontFamily: "sans-serif" }} className="text-[0.72rem] font-bold text-[#1A1A1A]">IKIRUN</span>
                    <span style={{ fontFamily: "sans-serif" }} className="text-[0.72rem] text-[#999]">5月1</span>
                  </div>
                  <span style={{ fontFamily: "sans-serif" }} className="text-[0.7rem] text-[#666] border border-[#DDD] rounded-full px-2 py-[2px]">APPで読む ↗</span>
                </div>
                <div className="flex gap-3 pb-3 border-b border-[#F0F0F0] mb-3">
                  {["♡", "💬", "⬆", "↺"].map((icon) => (
                    <span key={icon} style={{ fontFamily: "sans-serif" }} className="text-[#999] text-[0.9rem]">{icon}</span>
                  ))}
                </div>
                <p style={{ fontFamily: "sans-serif" }} className="text-[0.78rem] text-[#444] leading-[1.8]">
                  一人一人の人間がエネルギー体として振動波（波動）を発振し受振しているが、それは人間だけではない。動物・植物・鉱物そして人間が排除している菌やウィルスも人間同様のエネルギー体として…
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-9 pt-9 border-t border-portal-amber/20">
            {stats.map((s) => (
              <div key={s.label} className="text-left">
                <p className="font-serif text-[1.9rem] font-bold text-portal-amber-deep leading-none mb-1">{s.num}</p>
                <p className="font-round text-[0.78rem] text-portal-text-soft tracking-[0.06em]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
