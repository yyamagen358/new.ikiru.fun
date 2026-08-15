const footerLinks = [
  {
    heading: "生涯の環",
    links: [
      { label: "環をすべて見る", href: "/journey" },
      { label: "誕生の森", href: "/journey/birth" },
      { label: "恋愛の星", href: "/journey/love" },
      { label: "人生の道", href: "/journey/life" },
      { label: "転生の扉", href: "/journey/rebirth" },
    ],
  },
  {
    heading: "読む・聴く",
    links: [
      { label: "詩", href: "https://content.ikiru.fun/today/poetry" },
      { label: "音楽", href: "https://content.ikiru.fun/today/music" },
      { label: "龍鳳学舎", href: "https://content.ikiru.fun/today/blog" },
      { label: "物語", href: "https://content.ikiru.fun/stories" },
      { label: "生き方", href: "https://content.ikiru.fun/life" },
    ],
  },
  {
    heading: "無料診断・サービス",
    links: [
      { label: "Twin Ray Club（日本語）", href: "https://twinrayclub.com/ja" },
      { label: "Twin Ray Club（English）", href: "https://twinrayclub.com/en" },
      { label: "使命トリセツ 無料診断", href: "https://soulmission358.com" },
      { label: "子どもたちに捧げるメッセージ", href: "https://lp-one-pied.vercel.app/" },
      { label: "うごキャラ工房", href: "https://ugochara.pages.dev/" },
      { label: "市町村の英文記事 無料作成", href: "https://shimin-plum.vercel.app" },
    ],
  },
  {
    heading: "AI Nation",
    links: [
      { label: "ASIへの道", href: "https://content.ikiru.fun/asi" },
      { label: "ビジョン", href: "https://content.ikiru.fun/asi/vision" },
      { label: "Rebirth", href: "https://content.ikiru.fun/rebirth" },
      { label: "スキル朝市", href: "https://yyamagen358.github.io/asaichi-skills/" },
      { label: "図書館", href: "https://yyamagen358.github.io/asaichi-skills/toshokan.html" },
    ],
  },
];

const socialIcons = [
  {
    icon: "▶",
    label: "YouTube — 全ての人々に捧げる詩",
    href: "https://www.youtube.com/@Amalie358",
  },
  {
    icon: "🎬",
    label: "YouTube — アマリエ スピリチュアルファンタジー",
    href: "https://www.youtube.com/@amariefantasy",
  },
  {
    icon: "✉️",
    label: "Substack で受け取る",
    href: "https://soulmission358.substack.com",
  },
];

export function PortalFooter() {
  return (
    <>
      {/* CTA Banner */}
      <section className="relative overflow-hidden bg-white py-24 px-5 [@media(min-width:900px)]:px-20 text-center">
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(232,180,184,0.12) 0%, transparent 60%)" }}
        />
        <div
          className="pointer-events-none absolute -top-16 -left-16 w-[300px] h-[300px] animate-blob-morph"
          style={{
            background: "linear-gradient(135deg, rgba(232,180,184,0.15), rgba(212,165,116,0.10))",
            animationDuration: "18s",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-20 w-[300px] h-[300px] animate-blob-morph"
          style={{
            background: "linear-gradient(135deg, rgba(184,169,201,0.15), rgba(143,174,139,0.10))",
            animationDuration: "18s",
            animationDelay: "4s",
          }}
        />

        <div className="portal-animate-in relative z-10 max-w-[640px] mx-auto">
          <h2 className="font-serif font-bold text-portal-text-dark leading-[1.3] mb-5 text-[clamp(2rem,4vw,3rem)]">
            今日から、あなたの旅を始めよう
          </h2>
          <p className="font-round text-[1.05rem] text-portal-text-soft leading-[1.9] mb-10">
            AI Nationはあなたを待っています。<br />
            無料で登録して、1,200以上のコンテンツに<br />
            今すぐアクセスしてください。
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a
              href="https://twinrayclub.com/ja"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-round text-[1rem] font-bold tracking-[0.05em] text-white px-9 py-4 rounded-full bg-gradient-to-br from-portal-rose to-portal-amber shadow-[0_8px_32px_rgba(212,132,138,0.40)] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_14px_44px_rgba(212,132,138,0.52)] group"
            >
              Twin Ray 無料診断
              <span className="text-[1.1rem] transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
            <a
              href="https://soulmission358.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-round text-[1rem] font-bold tracking-[0.05em] text-white px-9 py-4 rounded-full bg-gradient-to-br from-portal-amber to-portal-amber-deep shadow-[0_8px_32px_rgba(184,131,78,0.35)] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_14px_44px_rgba(184,131,78,0.48)] group"
            >
              使命トリセツ 無料診断
              <span className="text-[1.1rem] transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
            <a
              href="/journey"
              className="inline-flex items-center font-round text-[0.95rem] font-medium text-portal-text-mid px-7 py-[15px] rounded-full border-[1.5px] border-portal-rose bg-transparent transition-all duration-200 hover:bg-portal-rose-light hover:border-portal-rose-deep hover:text-portal-rose-deep"
            >
              まず環を見てみる
            </a>
          </div>

          <p className="font-round text-[0.8rem] text-portal-text-muted">
            登録無料 · クレジットカード不要 · いつでも退会可能
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-portal-cream-deep border-t border-portal-amber/15 pt-16 pb-10 px-5 [@media(min-width:900px)]:px-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 [@media(min-width:600px)]:grid-cols-2 [@media(min-width:1100px)]:grid-cols-[1.5fr_repeat(4,1fr)] gap-12 mb-12">
            <div className="max-w-[280px]">
              <p className="font-serif text-[1.5rem] font-bold text-portal-text-dark mb-3">
                AI{" "}
                <span className="bg-gradient-to-br from-portal-rose to-portal-amber bg-clip-text text-transparent">
                  Nation
                </span>
              </p>
              <p className="font-round text-[0.82rem] text-portal-text-soft leading-[1.8] mb-5">
                生きるを再定義する —<br />
                ASI×スピリチュアルで、<br />
                誰もが豊かに生きる世界へ
              </p>
              <div className="flex gap-3">
                {socialIcons.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="w-9 h-9 rounded-[10px] bg-portal-amber/15 flex items-center justify-center text-[1rem] transition-all duration-200 hover:bg-portal-amber/30 hover:-translate-y-[2px]"
                  >
                    <span aria-hidden="true">{s.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {footerLinks.map((col) => (
              <div key={col.heading}>
                <h4 className="font-round text-[0.82rem] font-bold text-portal-text-dark tracking-[0.12em] uppercase mb-4">
                  {col.heading}
                </h4>
                <ul className="flex flex-col gap-[10px]">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="font-round text-[0.85rem] text-portal-text-soft transition-colors duration-200 hover:text-portal-amber-deep"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-portal-amber/15 pt-7 flex flex-wrap justify-between items-center gap-4 font-round text-[0.78rem] text-portal-text-muted">
            <span>© 2026 AI Nation. All rights reserved.</span>
            <div className="flex gap-6">
              {["プライバシーポリシー", "利用規約", "特定商取引法"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="transition-colors duration-200 hover:text-portal-amber-deep"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
