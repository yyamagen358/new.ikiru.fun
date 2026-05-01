import type { Metadata } from "next";
import { PortalNav } from "@/components/portal/portal-nav";

export const metadata: Metadata = {
  title: "仲間と繋がる — Connect | AI Nation",
  description: "StoriesとAI朝市、そしてコミュニティで同じ旅をする仲間と出会いましょう。",
};

const items = [
  {
    icon: "📖",
    title: "Stories",
    desc: "アマリエの物語。3つの小説",
    href: "https://content.ikiru.fun/stories",
  },
  {
    icon: "🛖",
    title: "朝市",
    desc: "あなたの才能を世界に。制作代行・スキルシェア",
    href: "https://yyamagen358.github.io/asaichi-skills/",
  },
  {
    icon: "✨",
    title: "コミュニティ",
    desc: "同じ旅をする仲間と出会う場",
    href: "https://twinrayclub.com/ja",
  },
];

export default function ConnectPage() {
  return (
    <div className="font-round bg-portal-cream text-portal-text-dark min-h-screen">
      <PortalNav />

      <section className="relative pt-[68px] overflow-hidden bg-gradient-to-br from-[#F5F3F8] via-[#EBE6F2] to-[#DDD6EA]">
        <div className="pointer-events-none absolute -top-24 -right-48 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(184,169,201,0.22)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-16 -left-20 w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(142,123,168,0.12)_0%,transparent_70%)]" />

        <div className="relative z-10 max-w-[860px] mx-auto px-6 py-24 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="inline-block w-8 h-[1.5px] bg-gradient-to-r from-portal-lavender to-portal-amber" />
            <span className="font-round text-[0.78rem] font-bold tracking-[0.35em] uppercase text-portal-lavender-deep">
              Connect
            </span>
            <span className="inline-block w-8 h-[1.5px] bg-gradient-to-r from-portal-amber to-portal-lavender" />
          </div>
          <h1 className="font-serif font-bold text-portal-text-dark leading-[1.2] mb-6 text-[clamp(2.4rem,5vw,3.6rem)]">
            仲間と{" "}
            <span className="bg-gradient-to-br from-portal-lavender to-portal-lavender-deep bg-clip-text text-transparent">
              繋がる
            </span>
          </h1>
          <p className="font-round text-[1.05rem] text-portal-text-mid leading-[1.9] max-w-[560px] mx-auto">
            StoriesとAI朝市、そしてコミュニティで同じ旅をする仲間と出会いましょう。
          </p>
        </div>
      </section>

      <section className="relative bg-white py-20 px-5 md:px-20">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-portal-lavender via-portal-amber to-portal-lavender opacity-30" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[860px] mx-auto">
          {items.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-[20px] p-8 bg-gradient-to-br from-[#F5F3F8] via-[#EBE6F2] to-[#DDD6EA] border-[1.5px] border-portal-lavender/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(184,169,201,0.25)] cursor-pointer"
            >
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-[1.7rem] mb-5 bg-portal-lavender/35">
                {item.icon}
              </div>
              <h3 className="font-serif text-[1.3rem] font-bold text-portal-text-dark mb-2 group-hover:text-portal-lavender-deep transition-colors duration-200">
                {item.title}
              </h3>
              <p className="font-round text-[0.9rem] text-portal-text-mid leading-[1.8] mb-5">
                {item.desc}
              </p>
              <span className="font-round text-[0.82rem] font-bold text-portal-lavender-deep tracking-[0.05em] flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                探索する
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </span>
            </a>
          ))}
        </div>
        <div className="flex flex-col items-center mt-16 gap-8">
          <div className="w-full max-w-[480px]">
            <iframe
              src="https://soulmission358.substack.com/embed"
              width="480"
              height="320"
              style={{ border: "1px solid #EEE", background: "white", maxWidth: "100%" }}
              frameBorder="0"
              scrolling="no"
            />
          </div>
          <a
            href="/portal"
            className="inline-flex items-center gap-2 font-round text-[0.88rem] font-medium text-portal-text-soft tracking-[0.04em] px-6 py-3 rounded-full border-[1.5px] border-portal-lavender/30 bg-transparent transition-all duration-200 hover:bg-portal-lavender-light hover:border-portal-lavender hover:text-portal-lavender-deep"
          >
            <span>←</span> ポータルに戻る
          </a>
        </div>
      </section>
    </div>
  );
}
