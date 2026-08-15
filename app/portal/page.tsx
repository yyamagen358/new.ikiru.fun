import type { Metadata } from "next";
import { PortalNav } from "@/components/portal/portal-nav";
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

export const metadata: Metadata = {
  title: "AI Nation — 生きるを再定義する",
  description:
    "ASI×スピリチュアルで、誰もが豊かに生きる世界へ。詩、音楽、Twin Ray、そしてAIの最前線。",
};

export default function PortalPage() {
  return (
    <PortalScrollWrapper>
      <div className="font-round bg-portal-cream text-portal-text-dark">
        <PortalNav />
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
