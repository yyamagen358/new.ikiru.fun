import type { Metadata } from "next";
import { PortalNav } from "@/components/portal/portal-nav";
import { PortalFooter } from "@/components/portal/portal-footer";
import { JourneyRing } from "@/components/journey/journey-ring";
import { stations } from "@/components/journey/journey-data";

export const metadata: Metadata = {
  title: "生涯の環 — ゆりかごから来世へ",
  description:
    "誕生の森・恋愛の星・人生の道・転生の扉。ゆりかごから墓場まで、そしてまた次の誕生へ。あなたはいま、環のどこにいますか。",
};

export default function JourneyIndex() {
  return (
    <div className="font-round bg-portal-cream text-portal-text-dark min-h-screen">
      <PortalNav />

      <section className="relative pt-[68px] overflow-hidden bg-gradient-to-br from-portal-cream via-[#FDF0E8] to-[#FBE8DA]">
        <div className="pointer-events-none absolute -top-24 -right-40 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(232,180,184,0.20)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-20 -left-24 w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,rgba(184,169,201,0.18)_0%,transparent_70%)]" />

        <div className="relative z-10 max-w-[820px] mx-auto px-6 py-24 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="inline-block w-8 h-[1.5px] bg-gradient-to-r from-portal-rose to-portal-amber" />
            <span className="font-round text-[0.78rem] font-bold tracking-[0.35em] uppercase text-portal-amber-deep">
              The Circle of Life
            </span>
            <span className="inline-block w-8 h-[1.5px] bg-gradient-to-r from-portal-amber to-portal-rose" />
          </div>

          <h1 className="font-serif font-bold text-portal-text-dark leading-[1.25] mb-7 text-[clamp(2.2rem,5vw,3.4rem)]">
            ゆりかごから
            <span className="bg-gradient-to-br from-portal-rose to-portal-amber bg-clip-text text-transparent">
              来世
            </span>
            へ
          </h1>

          <p className="font-round text-[1.02rem] text-portal-text-mid leading-[2.05] max-w-[36rem] mx-auto">
            生まれ、誰かと出会い、日々を生き、そして還っていく。
            <br className="hidden md:block" />
            けれどこの世界観では、還ることは終わりではありません。生涯は直線ではなく<b>環</b>です。
            <br className="hidden md:block" />
            転生の扉をくぐった魂は、また誕生の森に立ちます。
          </p>
        </div>
      </section>

      <JourneyRing compact />

      {/* ステーション一覧 */}
      <section className="relative bg-white py-24 px-5 [@media(min-width:900px)]:px-20">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-portal-rose via-portal-amber to-portal-lavender opacity-40" />
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-[clamp(1.7rem,3vw,2.3rem)] font-semibold text-portal-text-dark mb-4">
              四つのステーション
            </h2>
            <p className="font-round text-[0.95rem] text-portal-text-soft max-w-[32rem] mx-auto leading-relaxed">
              どこから入ってもかまいません。環に順路はあっても、始点はないからです。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {stations.map((s) => (
              <a
                key={s.slug}
                href={`/journey/${s.slug}`}
                className={`group rounded-[20px] p-10 ${s.cardBg} border-[1.5px] ${s.cardBorder} transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_56px_rgba(180,120,80,0.20)]`}
              >
                <div className={`w-[68px] h-[68px] rounded-full flex items-center justify-center text-[1.9rem] mb-6 ${s.iconBg}`}>
                  <span aria-hidden="true">{s.icon}</span>
                </div>
                <h3 className="font-serif text-[1.4rem] font-bold text-portal-text-dark mb-1">
                  {s.title}
                </h3>
                <p className="font-round text-[0.72rem] tracking-[0.2em] uppercase text-portal-text-soft mb-4">
                  {s.titleEn}
                </p>
                <p className={`font-serif text-[1.02rem] font-bold mb-4 ${s.accentText}`}>
                  {s.question}
                </p>
                <p className="font-round text-[0.9rem] text-portal-text-mid leading-[1.9] mb-6">
                  {s.lede}
                </p>
                <span className={`font-round text-[0.82rem] font-bold tracking-[0.05em] flex items-center gap-1 group-hover:gap-2 transition-all duration-200 ${s.accentText}`}>
                  このステーションへ
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <PortalFooter />
    </div>
  );
}
