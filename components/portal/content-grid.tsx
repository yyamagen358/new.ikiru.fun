"use client";

import { useState } from "react";

const categories = [
  { label: "すべて", value: "all" },
  { label: "詩🌸", value: "poetry" },
  { label: "音楽🎵", value: "music" },
  { label: "ASI🤖", value: "asi" },
  { label: "生き方🌿", value: "life" },
  { label: "Twin Ray💫", value: "twinray" },
  { label: "Rebirth✨", value: "rebirth" },
  { label: "Stories📖", value: "stories" },
  { label: "朝市🛖", value: "asaichi" },
];

type CardTheme = "poetry" | "music" | "asi" | "life" | "twinray";

interface ContentCard {
  theme: CardTheme;
  emoji: string;
  category: string;
  title: string;
  date: string;
  readTime: string;
  href: string;
}

const cards: ContentCard[] = [
  {
    theme: "poetry",
    emoji: "🌸",
    category: "詩",
    title: "五月の風が運ぶ言葉、\n魂への静かな約束",
    date: "5月3日",
    readTime: "3分",
    href: "https://content.ikiru.fun/today/poetry",
  },
  {
    theme: "music",
    emoji: "🎵",
    category: "音楽",
    title: "ソルフェジオ周波数 639Hz\n人間関係の調和と愛の共鳴",
    date: "5月2日",
    readTime: "45分",
    href: "https://content.ikiru.fun/today/music",
  },
  {
    theme: "asi",
    emoji: "🧠",
    category: "ASI",
    title: "Claude 4が変えた世界 —\nASI時代の幕開けと魂の行方",
    date: "5月1日",
    readTime: "8分",
    href: "https://content.ikiru.fun/asi",
  },
  {
    theme: "life",
    emoji: "☀️",
    category: "生き方",
    title: "手放すことで得るもの —\n執着からの解放論",
    date: "4月30日",
    readTime: "6分",
    href: "https://content.ikiru.fun/life",
  },
  {
    theme: "twinray",
    emoji: "💫",
    category: "Twin Ray",
    title: "サイレント期間を乗り越えて —\n再会への道標",
    date: "4月29日",
    readTime: "7分",
    href: "https://twinrayclub.com/ja",
  },
  {
    theme: "music",
    emoji: "🌙",
    category: "Rebirth",
    title: "借金500万からの覚醒 —\nRebirth実践記 vol.13",
    date: "4月28日",
    readTime: "10分",
    href: "https://content.ikiru.fun/rebirth",
  },
  {
    theme: "asi",
    emoji: "📝",
    category: "ブログ",
    title: "AIエージェントと共に生きる —\n新しい働き方の哲学",
    date: "4月27日",
    readTime: "5分",
    href: "https://content.ikiru.fun/today/blog",
  },
  {
    theme: "life",
    emoji: "📖",
    category: "Stories",
    title: "孤独だった私が、\n繋がりを取り戻すまで",
    date: "4月26日",
    readTime: "12分",
    href: "https://content.ikiru.fun/stories",
  },
];

const thumbBg: Record<CardTheme, string> = {
  poetry: "bg-gradient-to-br from-portal-rose-light to-[#ECC4C8]",
  music: "bg-gradient-to-br from-portal-lavender-light to-[#C9BFD9]",
  asi: "bg-gradient-to-br from-portal-sage-light to-[#AECBAB]",
  life: "bg-gradient-to-br from-portal-amber-light to-[#DCBF92]",
  twinray: "bg-gradient-to-br from-[#F9E8EA] to-[#F0D0D5]",
};

const categoryColor: Record<CardTheme, string> = {
  poetry: "text-portal-rose-deep before:bg-portal-rose-deep",
  music: "text-portal-lavender-deep before:bg-portal-lavender-deep",
  asi: "text-portal-sage-deep before:bg-portal-sage-deep",
  life: "text-portal-amber-deep before:bg-portal-amber-deep",
  twinray: "text-portal-rose-deep before:bg-portal-rose-deep",
};

export function ContentGrid() {
  const [active, setActive] = useState("all");

  return (
    <section id="content" className="bg-white py-20 px-5 [@media(min-width:900px)]:px-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-7">
          <p className="font-round text-[0.78rem] font-bold tracking-[0.35em] text-portal-amber-deep uppercase mb-2">
            All Content
          </p>
          <h2 className="font-serif text-[1.9rem] font-semibold text-portal-text-dark">
            最新コンテンツ
          </h2>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActive(cat.value)}
              className={[
                "px-5 py-2 rounded-full text-[0.82rem] font-semibold tracking-[0.04em] border-[1.5px] transition-all duration-200 cursor-pointer",
                active === cat.value
                  ? "bg-gradient-to-br from-portal-rose to-portal-amber text-white border-transparent shadow-[0_4px_16px_rgba(212,132,138,0.3)]"
                  : "bg-portal-cream-deep text-portal-text-mid border-portal-amber/20 hover:border-portal-amber hover:text-portal-amber-deep hover:bg-portal-amber-light",
              ].join(" ")}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 [@media(min-width:600px)]:grid-cols-2 [@media(min-width:1100px)]:grid-cols-4 gap-6">
          {cards.filter((card) => active === "all" || card.theme === active).map((card, i) => (
            <a
              key={i}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className="portal-animate-in rounded-[20px] overflow-hidden bg-portal-cream border-[1.5px] border-portal-amber/10 shadow-[0_4px_24px_rgba(180,120,80,0.10)] cursor-pointer transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_16px_56px_rgba(180,120,80,0.20)] block"
              style={{ transitionDelay: `${i * 0.07}s` }}
            >
              <div className={`h-40 flex items-center justify-center text-[3rem] relative overflow-hidden ${thumbBg[card.theme]}`}>
                {card.emoji}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/[0.08]" />
              </div>
              <div className="p-5">
                <p className={`font-round text-[0.72rem] font-bold tracking-[0.15em] uppercase mb-2 flex items-center gap-[6px] before:content-[''] before:inline-block before:w-1 before:h-1 before:rounded-full before:shrink-0 ${categoryColor[card.theme]}`}>
                  {card.category}
                </p>
                <h3 className="font-round text-[0.95rem] font-semibold text-portal-text-dark leading-[1.5] mb-[10px] whitespace-pre-line">
                  {card.title}
                </h3>
                <div className="font-round text-[0.75rem] text-portal-text-muted flex justify-between items-center">
                  <span>{card.date}</span>
                  <span>{card.readTime}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
