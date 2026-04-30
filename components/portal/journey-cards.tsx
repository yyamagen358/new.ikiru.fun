export function JourneyCards() {
  const cards = [
    {
      id: 1,
      icon: "🌸",
      title: "心を癒す",
      titleEn: "Heal Your Heart",
      desc: "詩と音楽、Twin Rayの愛、そしてRebirthの物語があなたの心に寄り添います。",
      tags: ["詩", "音楽", "Twin Ray", "Rebirth"],
      href: "/portal/heal",
      gradientBg: "from-[#FDF5F5] via-[#F9E8EA] to-[#F5D8DA]",
      border: "border-portal-rose/40",
      iconBg: "bg-portal-rose/35",
      tagBg: "bg-portal-rose/40",
      tagText: "text-portal-rose-deep",
      btnText: "text-portal-rose-deep",
      delay: "delay-[0ms]",
    },
    {
      id: 2,
      icon: "🌿",
      title: "知を深める",
      titleEn: "Deepen Knowledge",
      desc: "ASIの最前線、生き方のブログ、図書館のような深い知識があなたを導きます。",
      tags: ["ASI", "ブログ", "生き方", "図書館"],
      href: "/portal/knowledge",
      gradientBg: "from-[#F4F7F4] via-[#E8F0E8] to-[#D8E8D8]",
      border: "border-portal-sage/40",
      iconBg: "bg-portal-sage/35",
      tagBg: "bg-portal-sage/40",
      tagText: "text-portal-sage-deep",
      btnText: "text-portal-sage-deep",
      delay: "delay-[150ms]",
    },
    {
      id: 3,
      icon: "✨",
      title: "仲間と繋がる",
      titleEn: "Connect",
      desc: "StoriesとAI朝市、そしてコミュニティで同じ旅をする仲間と出会いましょう。",
      tags: ["Stories", "朝市", "コミュニティ"],
      href: "/portal/connect",
      gradientBg: "from-[#F5F3F8] via-[#EBE6F2] to-[#DDD6EA]",
      border: "border-portal-lavender/40",
      iconBg: "bg-portal-lavender/35",
      tagBg: "bg-portal-lavender/40",
      tagText: "text-portal-lavender-deep",
      btnText: "text-portal-lavender-deep",
      delay: "delay-[300ms]",
    },
  ];

  return (
    <section id="journey" className="portal-animate-in relative overflow-hidden bg-white py-24 px-5 md:px-20">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-portal-rose via-portal-amber to-portal-rose opacity-40" />

      <div className="text-center mb-16">
        <p className="font-round text-xs tracking-[0.35em] uppercase font-bold text-portal-amber-deep mb-4">
          Start Your Journey
        </p>
        <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] font-semibold text-portal-text-dark mb-4">
          あなたの旅を始めましょう
        </h2>
        <p className="font-round text-base text-portal-text-soft max-w-md mx-auto leading-relaxed">
          心・知・繋がり — 三つの扉があなたを待っています
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-[1100px] mx-auto">
        {cards.map((card) => (
          <a
            key={card.id}
            href={card.href}
            className={`portal-animate-in ${card.delay} group rounded-[20px] p-12 text-center relative overflow-hidden cursor-pointer transition-all duration-300 bg-gradient-to-br ${card.gradientBg} border-[1.5px] ${card.border} hover:-translate-y-2 hover:shadow-[0_16px_56px_rgba(180,120,80,0.20)] block`}
          >
            <div className={`w-[72px] h-[72px] rounded-full flex items-center justify-center text-[2rem] mx-auto mb-6 ${card.iconBg}`}>
              {card.icon}
            </div>
            <h3 className="font-serif text-[1.45rem] font-bold text-portal-text-dark mb-2">
              {card.title}
            </h3>
            <p className="font-round text-[0.75rem] tracking-[0.2em] uppercase text-portal-text-soft mb-4">
              {card.titleEn}
            </p>
            <p className="font-round text-[0.9rem] text-portal-text-mid leading-[1.8] mb-6">
              {card.desc}
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className={`font-round text-[0.75rem] font-medium tracking-[0.03em] px-[14px] py-1 rounded-[20px] ${card.tagBg} ${card.tagText}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className={`font-round text-[0.82rem] font-bold tracking-[0.05em] flex items-center justify-center gap-1 group-hover:gap-2 transition-all duration-200 ${card.btnText}`}>
              探索する
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
