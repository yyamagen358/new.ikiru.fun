import type { Metadata } from "next";
import { StationPage } from "@/components/journey/station-page";
import { getStation } from "@/components/journey/journey-data";

const station = getStation("birth");

export const metadata: Metadata = {
  title: `${station.title} — ${station.question}`,
  description: station.lede,
};

export default function BirthStation() {
  return <StationPage station={station} />;
}
