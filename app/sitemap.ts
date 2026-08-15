import type { MetadataRoute } from "next";
import { stations } from "@/components/journey/journey-data";

const baseUrl = "https://new.ikiru.fun";

/**
 * ポータルは自前のコンテンツを持たないが、生涯の環と3つの扉は
 * このホストにしか無いページなので、ここで申告する。
 * 記事本体（詩・龍鳳学舎・物語・MV）は content.ikiru.fun 側のサイトマップが持つ。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${baseUrl}/journey`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...stations.map((s) => ({
      url: `${baseUrl}/journey/${s.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...["heal", "knowledge", "connect"].map((p) => ({
      url: `${baseUrl}/portal/${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
