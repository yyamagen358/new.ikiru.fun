const miniCards = [
  {
    icon: "🎵",
    iconBg: "bg-portal-lavender/40",
    title: "今日の癒し音楽",
    desc: "心が静まる432Hzのヒーリングサウンド",
    isNew: false,
    href: "/portal/heal",
  },
  {
    icon: "🤖",
    iconBg: "bg-portal-sage/40",
    title: "ASI最新動向",
    desc: "人工超知性の最前線レポート",
    isNew: false,
    href: "/portal/knowledge",
  },
  {
    icon: "✍️",
    iconBg: "bg-portal-rose/40",
    title: "今日の詩",
    desc: "魂に触れる言葉たちをお届けします",
    isNew: true,
    href: "/portal/heal",
  },
  {
    icon: "🌟",
    iconBg: "bg-portal-amber/40",
    title: "Rebirth Story",
    desc: "再生と覚醒の旅を歩む仲間の物語",
    isNew: false,
    href: "/portal/connect",
  },
];

export function TodaySpotlight() {
  return (
    <section className="portal-animate-in bg-portal-cream py-20 px-5 md:px-20">
      <div className="max-w-[1100px] mx-auto relative overflow-hidden rounded-[32px] border-[1.5px] border-portal-amber/20 shadow-[0_8px_40px_rgba(180,120,80,0.13)] bg-gradient-to-br from-[#FFF2E8] via-[#FDEAEA] to-[#F5EEF8] p-10 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        <span className="font-serif absolute top-[-20px] right-10 text-[8rem] font-bold text-portal-amber/[0.08] leading-none pointer-events-none select-none">
          今日
        </span>

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-portal-rose to-portal-amber text-white text-[0.78rem] font-bold tracking-[0.1em] px-[18px] py-[6px] rounded-full mb-5">
            ✦ 今日のおすすめ
          </span>
          <h2 className="font-serif text-[2rem] font-bold text-portal-text-dark leading-[1.4] mb-4">
            AIと魂が出会う時代に、<br />あなたはどう生きるか
          </h2>
          <p className="font-round text-[0.95rem] text-portal-text-mid leading-[1.9] mb-7">
            Claude 4の登場でASI時代の幕が開いた。テクノロジーが加速するほど、魂の声を聴く力が問われる。AIと共に生きるとは、自分の内側を深く知ることから始まります。
          </p>
          <div className="flex flex-wrap items-center gap-5 font-round text-[0.8rem] text-portal-text-soft">
            <span className="flex items-center gap-[6px]"><span>🤖</span> ASI×スピリチュアル</span>
            <span className="flex items-center gap-[6px]"><span>🕐</span> 6分で読める</span>
            <span className="flex items-center gap-[6px]"><span>👁</span> 2,380 views</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-5">
          {miniCards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="bg-white/70 rounded-2xl px-6 py-5 flex items-center gap-4 border border-portal-amber/15 transition-all duration-200 hover:bg-white/95 hover:translate-x-[6px]"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-[1.3rem] shrink-0 ${card.iconBg}`}>
                {card.icon}
              </div>
              <div>
                <h4 className="font-serif text-[0.88rem] font-semibold text-portal-text-dark mb-[2px]">
                  {card.title}
                  {card.isNew && (
                    <span className="font-round ml-[6px] text-[0.65rem] bg-portal-rose text-white px-2 py-[2px] rounded-[10px] font-bold tracking-[0.05em] align-middle">
                      NEW
                    </span>
                  )}
                </h4>
                <p className="font-round text-[0.78rem] text-portal-text-soft">{card.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
