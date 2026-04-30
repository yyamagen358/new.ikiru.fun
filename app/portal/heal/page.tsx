import type { Metadata } from "next";
import { PortalNav } from "@/components/portal/portal-nav";

export const metadata: Metadata = {
  title: "心を癒す — Heal Your Heart | AI Nation",
  description: "詩と音楽、Twin Rayの愛、そしてRebirthの物語があなたの心に寄り添います。",
};

const items = [
  {
    icon: "🌸",
    title: "詩",
    desc: "魂の声を言葉に乗せた、毎日更新の詩シリーズ",
    href: "https://content.ikiru.fun/today/poetry",
  },
  {
    icon: "🎵",
    title: "音楽",
    desc: "432Hz・528Hz・639Hz 厳選ヒーリングサウンド",
    href: "https://content.ikiru.fun/today/music",
  },
  {
    icon: "💫",
    title: "Twin Ray",
    desc: "感情と出来事の翻訳機関。より深い探求の場",
    href: "https://twinrayclub.com/ja",
  },
  {
    icon: "🌙",
    title: "Rebirth",
    desc: "実際の覚醒体験と内側からの変革プロセス",
    href: "https://content.ikiru.fun/rebirth",
  },
];

export default function HealPage() {
  return (
    <div className="font-round bg-portal-cream text-portal-text-dark min-h-screen">
      <PortalNav />

      <section className="relative pt-[68px] overflow-hidden bg-gradient-to-br from-[#FDF5F5] via-[#F9E8EA] to-[#F5D8DA]">
        <div className="pointer-events-none absolute -top-24 -right-48 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(232,180,184,0.25)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-16 -left-20 w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(212,132,138,0.12)_0%,transparent_70%)]" />

        <div className="relative z-10 max-w-[860px] mx-auto px-6 py-24 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="inline-block w-8 h-[1.5px] bg-gradient-to-r from-portal-rose to-portal-amber" />
            <span className="font-round text-[0.78rem] font-bold tracking-[0.35em] uppercase text-portal-amber-deep">
              Heal Your Heart
            </span>
            <span className="inline-block w-8 h-[1.5px] bg-gradient-to-r from-portal-amber to-portal-rose" />
          </div>
          <h1 className="font-serif font-bold text-portal-text-dark leading-[1.2] mb-6 text-[clamp(2.4rem,5vw,3.6rem)]">
            心を{" "}
            <span className="bg-gradient-to-br from-portal-rose to-portal-amber bg-clip-text text-transparent">
              癒す
            </span>
          </h1>
          <p className="font-round text-[1.05rem] text-portal-text-mid leading-[1.9] max-w-[560px] mx-auto">
            詩と音楽、Twin Rayの愛、そしてRebirthの物語があなたの心に寄り添います。
          </p>
        </div>
      </section>

      <section className="relative bg-white py-20 px-5 md:px-20">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-portal-rose via-portal-amber to-portal-rose opacity-30" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[860px] mx-auto">
          {items.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-[20px] p-8 bg-gradient-to-br from-[#FDF5F5] via-[#F9E8EA] to-[#F5D8DA] border-[1.5px] border-portal-rose/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(212,132,138,0.22)] cursor-pointer"
            >
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-[1.7rem] mb-5 bg-portal-rose/35">
                {item.icon}
              </div>
              <h3 className="font-serif text-[1.3rem] font-bold text-portal-text-dark mb-2 group-hover:text-portal-rose-deep transition-colors duration-200">
                {item.title}
              </h3>
              <p className="font-round text-[0.9rem] text-portal-text-mid leading-[1.8] mb-5">
                {item.desc}
              </p>
              <span className="font-round text-[0.82rem] font-bold text-portal-rose-deep tracking-[0.05em] flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                探索する
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </span>
            </a>
          ))}
        </div>
        <div className="text-center mt-16">
          <a
            href="/portal"
            className="inline-flex items-center gap-2 font-round text-[0.88rem] font-medium text-portal-text-soft tracking-[0.04em] px-6 py-3 rounded-full border-[1.5px] border-portal-rose/30 bg-transparent transition-all duration-200 hover:bg-portal-rose-light hover:border-portal-rose hover:text-portal-rose-deep"
          >
            <span>←</span> ポータルに戻る
          </a>
        </div>
      </section>
    </div>
  );
}
