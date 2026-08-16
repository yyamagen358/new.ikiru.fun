import type { Metadata } from "next";
import { PortalNav } from "@/components/portal/portal-nav";
import { SkyBand } from "@/components/portal/sky-band";
import { Broadcast } from "@/components/portal/broadcast";
import { PortalHero } from "@/components/portal/portal-hero";
import { JourneyCards } from "@/components/portal/journey-cards";
import { JourneyRing } from "@/components/journey/journey-ring";
import { TodaySpotlight } from "@/components/portal/today-spotlight";
import { ContentGrid } from "@/components/portal/content-grid";
import { QuoteSection } from "@/components/portal/quote-section";
import { ContentStreams } from "@/components/portal/content-streams";
import { SkillMarketStrip } from "@/components/portal/skill-market-strip";
import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalScrollWrapper } from "@/components/portal/portal-scroll-wrapper";

/**
 * ポータル本体。
 * 以前は / が /portal へ 307 リダイレクトしており、いちばん強いURLが空だった。
 * title は absolute にしないと layout の template が効いて
 * 「AI Nation — 生きるを再定義する | AI Nation」と重複する。
 *
 * 並びは 今日の空 → 番組表 → 名乗り。毎日ひらく理由を先に出し、
 * 「で、ここは何なのか」は後ろで説明する。ヒーローが min-h-screen なので、
 * 番組表を後ろに置くと丸1画面ぶん下がって初回訪問では存在しないに等しかった。
 */
export const metadata: Metadata = {
  title: { absolute: "AI Nation — 生きるを再定義する" },
  description:
    "ASI×スピリチュアルで、誰もが豊かに生きる世界へ。詩、音楽、Twin Ray、そしてAIの最前線。",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <PortalScrollWrapper>
      <div className="font-round bg-portal-cream text-portal-text-dark">
        <PortalNav />
        <SkyBand />
        <Broadcast />
        <PortalHero />
        <JourneyCards />
        <JourneyRing />
        <TodaySpotlight />
        <ContentGrid />
        <QuoteSection />
        <ContentStreams />
        <SkillMarketStrip />
        <PortalFooter />
      </div>
    </PortalScrollWrapper>
  );
}
