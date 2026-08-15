import { PortalNav } from "@/components/portal/portal-nav";
import { PortalFooter } from "@/components/portal/portal-footer";
import { stations, todayCenter, type Station } from "./journey-data";

function LinkCard({
  item,
  station,
}: {
  item: { label: string; desc: string; href: string; external?: boolean };
  station: Station;
}) {
  return (
    <a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      className={`group block rounded-[20px] p-8 ${station.cardBg} border-[1.5px] ${station.cardBorder} transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(180,120,80,0.20)]`}
    >
      <h3 className="font-serif text-[1.25rem] font-bold text-portal-text-dark mb-2">
        {item.label}
      </h3>
      <p className="font-round text-[0.9rem] text-portal-text-mid leading-[1.8] mb-5">
        {item.desc}
      </p>
      <span
        className={`font-round text-[0.82rem] font-bold ${station.accentText} tracking-[0.05em] flex items-center gap-1 group-hover:gap-2 transition-all duration-200`}
      >
        {item.external ? "開く" : "探索する"}
        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </span>
    </a>
  );
}

export function StationPage({ station }: { station: Station }) {
  const order = stations.findIndex((s) => s.slug === station.slug);
  const next = stations[(order + 1) % stations.length];
  const prev = stations[(order - 1 + stations.length) % stations.length];

  return (
    <div className="font-round bg-portal-cream text-portal-text-dark min-h-screen">
      <PortalNav />

      {/* ヒーロー */}
      <section className={`relative pt-[68px] overflow-hidden ${station.heroBg}`}>
        <div className="pointer-events-none absolute -top-24 -right-48 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.5)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-[860px] mx-auto px-6 py-24 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className={`inline-block w-8 h-[1.5px] bg-gradient-to-r ${station.gradientFrom} ${station.gradientTo}`} />
            <span className={`font-round text-[0.78rem] font-bold tracking-[0.35em] uppercase ${station.accentText}`}>
              {station.titleEn}
            </span>
            <span className={`inline-block w-8 h-[1.5px] bg-gradient-to-r ${station.gradientTo} ${station.gradientFrom}`} />
          </div>

          <div className={`w-[84px] h-[84px] rounded-full flex items-center justify-center text-[2.2rem] mx-auto mb-7 ${station.iconBg}`}>
            <span aria-hidden="true">{station.icon}</span>
          </div>

          <h1 className="font-serif font-bold text-portal-text-dark leading-[1.2] mb-6 text-[clamp(2.3rem,5vw,3.4rem)]">
            {station.title}
          </h1>

          <p className={`font-serif text-[clamp(1.05rem,2vw,1.35rem)] font-bold mb-6 ${station.accentText}`}>
            {station.question}
          </p>

          <p className="font-round text-[1rem] text-portal-text-mid leading-[2] max-w-[560px] mx-auto">
            {station.lede}
          </p>
        </div>
      </section>

      {/* 読む・聴く */}
      {station.contents.length > 0 && (
        <section className="relative bg-white py-20 px-5 [@media(min-width:900px)]:px-20">
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${station.gradientFrom} ${station.gradientTo} opacity-40`} />
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-serif text-[1.6rem] font-bold text-portal-text-dark mb-3">
              このステーションで読む
            </h2>
            <p className="font-round text-[0.92rem] text-portal-text-soft mb-10">
              毎日更新されているコンテンツから、いまのあなたに近いものを。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {station.contents.map((item) => (
                <LinkCard key={item.href} item={item} station={station} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 診断・サービス */}
      {station.services.length > 0 && (
        <section className="bg-portal-cream py-20 px-5 [@media(min-width:900px)]:px-20">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-serif text-[1.6rem] font-bold text-portal-text-dark mb-3">
              一歩、踏み出すなら
            </h2>
            <p className="font-round text-[0.92rem] text-portal-text-soft mb-10">
              読むだけで終わらせない。この段階にいる人のための入口です。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {station.services.map((item) => (
                <LinkCard key={item.href} item={item} station={station} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 今日 — 環の中心 */}
      <section className="bg-white py-20 px-5 [@media(min-width:900px)]:px-20">
        <div className="max-w-[860px] mx-auto rounded-[28px] border-[1.5px] border-portal-amber/25 bg-gradient-to-br from-[#FFF2E8] via-[#FDEAEA] to-[#F5EEF8] px-8 py-12 md:px-14 text-center">
          <p className="font-round text-[0.75rem] font-bold tracking-[0.3em] uppercase text-portal-amber-deep mb-4">
            The Center
          </p>
          <h2 className="font-serif text-[1.7rem] font-bold text-portal-text-dark mb-4">
            環のどこにいても、今日は訪れる
          </h2>
          <p className="font-round text-[0.95rem] text-portal-text-mid leading-[1.95] max-w-[30rem] mx-auto mb-9">
            {todayCenter.desc}。読むのに1分もかかりません。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={todayCenter.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-round text-[0.95rem] font-bold tracking-[0.05em] text-white px-8 py-[15px] rounded-full bg-gradient-to-br from-portal-rose to-portal-amber shadow-[0_8px_28px_rgba(212,132,138,0.35)] transition-all duration-200 hover:-translate-y-[3px]"
            >
              {todayCenter.label}を読む
              <span>→</span>
            </a>
            <a
              href={todayCenter.youtube.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-round text-[0.9rem] font-medium text-portal-text-mid px-7 py-[14px] rounded-full border-[1.5px] border-portal-rose bg-transparent transition-all duration-200 hover:bg-portal-rose-light hover:text-portal-rose-deep"
            >
              <span aria-hidden="true">▶</span> {todayCenter.youtube.label}
            </a>
          </div>
        </div>
      </section>

      {/* 環を進む */}
      <section className="bg-portal-cream pt-4 pb-20 px-5 [@media(min-width:900px)]:px-20">
        <div className="max-w-[860px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={`/journey/${prev.slug}`}
              className={`group rounded-[18px] px-7 py-6 bg-white border-[1.5px] ${prev.cardBorder} transition-all duration-200 hover:-translate-y-1`}
            >
              <p className="font-round text-[0.72rem] tracking-[0.2em] uppercase text-portal-text-soft mb-2">
                ← ひとつ前
              </p>
              <p className={`font-serif text-[1.15rem] font-bold ${prev.accentText}`}>
                {prev.icon} {prev.title}
              </p>
            </a>
            <a
              href={`/journey/${next.slug}`}
              className={`group rounded-[18px] px-7 py-6 bg-white border-[1.5px] ${next.cardBorder} transition-all duration-200 hover:-translate-y-1 sm:text-right`}
            >
              <p className="font-round text-[0.72rem] tracking-[0.2em] uppercase text-portal-text-soft mb-2">
                環は続く →
              </p>
              <p className={`font-serif text-[1.15rem] font-bold ${next.accentText}`}>
                {next.icon} {next.title}
              </p>
            </a>
          </div>

          <div className="flex justify-center mt-10">
            <a
              href="/journey"
              className="inline-flex items-center gap-2 font-round text-[0.88rem] font-medium text-portal-text-soft tracking-[0.04em] px-6 py-3 rounded-full border-[1.5px] border-portal-amber/30 transition-all duration-200 hover:bg-portal-amber-light hover:text-portal-amber-deep"
            >
              生涯の環をすべて見る
            </a>
          </div>
        </div>
      </section>

      <PortalFooter />
    </div>
  );
}
