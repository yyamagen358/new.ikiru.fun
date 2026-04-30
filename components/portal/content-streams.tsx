interface StreamItem {
  iconBg: string;
  emoji: string;
  title: string;
  isNew?: boolean;
  description: string;
  href: string;
}

interface StreamColumn {
  iconBg: string;
  headerEmoji: string;
  title: string;
  titleEn: string;
  items: StreamItem[];
}

const columns: StreamColumn[] = [
  {
    iconBg: "bg-portal-rose/30",
    headerEmoji: "🌸",
    title: "スピリチュアル",
    titleEn: "Spiritual Path",
    items: [
      {
        iconBg: "bg-portal-rose/25",
        emoji: "✍️",
        title: "詩 — 春霞の中で",
        isNew: true,
        description: "魂の声を言葉に乗せた、毎日更新の詩シリーズ",
        href: "https://content.ikiru.fun/today/poetry",
      },
      {
        iconBg: "bg-portal-lavender/25",
        emoji: "🎵",
        title: "音楽 — 癒しの周波数コレクション",
        description: "432Hz・528Hz・639Hz 厳選ヒーリングサウンド",
        href: "https://content.ikiru.fun/today/music",
      },
      {
        iconBg: "bg-[rgba(249,220,210,0.5)]",
        emoji: "💫",
        title: "Twin Ray Club — 魂の絆を深める",
        description: "出会い・サイレント・統合まで、完全ガイド",
        href: "https://twinrayclub.com/ja",
      },
      {
        iconBg: "bg-portal-amber/20",
        emoji: "🌙",
        title: "Rebirth — 魂の再誕ストーリー",
        description: "実際の覚醒体験と内側からの変革プロセス",
        href: "https://content.ikiru.fun/rebirth",
      },
    ],
  },
  {
    iconBg: "bg-portal-sage/30",
    headerEmoji: "🤖",
    title: "ASIへの道",
    titleEn: "Path to ASI",
    items: [
      {
        iconBg: "bg-portal-sage/25",
        emoji: "🧠",
        title: "ASI — 超知性との共存哲学",
        isNew: true,
        description: "AIが人間を超えた先に待つ世界を考察する",
        href: "https://content.ikiru.fun/asi",
      },
      {
        iconBg: "bg-portal-amber/25",
        emoji: "📚",
        title: "図書館 — 知識の泉",
        description: "厳選した学び・気づき・洞察のアーカイブ",
        href: "https://yyamagen358.github.io/asaichi-skills/toshokan.html",
      },
      {
        iconBg: "bg-portal-lavender/25",
        emoji: "🌿",
        title: "生き方 — 豊かさを再定義する",
        description: "お金・時間・人間関係の新しいパラダイム",
        href: "https://content.ikiru.fun/life",
      },
      {
        iconBg: "bg-portal-sage/25",
        emoji: "🛖",
        title: "スキル朝市 — 才能の交換所",
        description: "あなたの才能を世界に。制作代行・スキルシェア",
        href: "https://yyamagen358.github.io/asaichi-skills/",
      },
    ],
  },
];

export function ContentStreams() {
  return (
    <section id="streams" className="bg-portal-cream py-20 px-5 [@media(min-width:900px)]:px-20">
      <div className="text-center mb-16">
        <p className="font-round text-[0.78rem] font-bold tracking-[0.35em] text-portal-amber-deep uppercase mb-4">
          Content Streams
        </p>
        <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] font-semibold text-portal-text-dark">
          カテゴリ別に探す
        </h2>
      </div>

      <div className="grid grid-cols-1 [@media(min-width:900px)]:grid-cols-2 gap-8 max-w-[1100px] mx-auto">
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-5">
            <div className="flex items-center gap-3 mb-1">
              <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-[1.2rem] ${col.iconBg}`}>
                {col.headerEmoji}
              </div>
              <div>
                <p className="font-serif text-[1.2rem] font-bold text-portal-text-dark leading-tight">
                  {col.title}
                </p>
                <p className="font-round text-[0.72rem] text-portal-text-soft tracking-[0.15em] uppercase">
                  {col.titleEn}
                </p>
              </div>
            </div>

            {col.items.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-[16px] px-6 py-5 flex gap-4 items-start border-[1.5px] border-portal-amber/10 transition-all duration-200 hover:translate-x-[6px] hover:shadow-[0_4px_24px_rgba(180,120,80,0.10)] hover:border-portal-amber/30 cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center text-[1.1rem] shrink-0 ${item.iconBg}`}>
                  {item.emoji}
                </div>
                <div>
                  <h4 className="font-round text-[0.9rem] font-semibold text-portal-text-dark leading-[1.4] mb-1">
                    {item.title}
                    {item.isNew && (
                      <span className="ml-[6px] align-middle inline-block text-[0.65rem] bg-portal-rose text-white font-bold tracking-[0.05em] px-2 py-[2px] rounded-[10px]">
                        NEW
                      </span>
                    )}
                  </h4>
                  <p className="font-round text-[0.78rem] text-portal-text-soft leading-[1.6]">
                    {item.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
