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

export const metadata: Metadata = {
  title: {
    default: "AI Nation — 生きるを再定義する",
    template: "%s | AI Nation",
  },
  description: "ASI×スピリチュアルで、誰もが豊かに生きる世界へ。詩、音楽、Twin Ray、そしてAIの最前線。",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} ${notoSerifJP.variable} ${zenMaruGothic.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
