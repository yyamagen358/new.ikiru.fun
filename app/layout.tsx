import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-zen-maru-gothic",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const siteUrl = "https://new.ikiru.fun";
const description =
  "ASI×スピリチュアルで、誰もが豊かに生きる世界へ。詩、音楽、Twin Ray、そしてAIの最前線。";

export const metadata: Metadata = {
  title: {
    default: "AI Nation — 生きるを再定義する",
    template: "%s | AI Nation",
  },
  description,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    siteName: "AI Nation",
    title: "AI Nation — 生きるを再定義する",
    description,
    images: [{ url: `${siteUrl}/opengraph-image`, width: 1200, height: 630, alt: "AI Nation — 生きるを再定義する" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Nation — 生きるを再定義する",
    description,
    images: [`${siteUrl}/opengraph-image`],
  },
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        {/*
          訪問者数の計測（自前の Umami / umami.yyamagen358.com）。
          cookie を置かず個人を特定する情報も持たないので、同意バナーは要らない。
          defer なので表示を待たせない。落ちてもページには影響しない。
          結果は毎朝 07:35 に yyamagen@gmail.com へ届く。
        */}
        <script
          defer
          src="https://umami.yyamagen358.com/script.js"
          data-website-id="a8146337-d8fe-487e-842d-9bb5da10ea7e"
        />
      </head>
      <body
        className={`${notoSansJP.variable} ${notoSerifJP.variable} ${zenMaruGothic.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
