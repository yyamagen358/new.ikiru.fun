import type { Metadata } from "next";
import YobikakeClient from "./yobikake-client";

const title = "今日の呼びかけ";
const description =
  "問いに3つ答えるだけ。あなたの内側にある答えを、あなた自身が見つけるための場所です。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/yobikake" },
  openGraph: {
    type: "website",
    url: "https://new.ikiru.fun/yobikake",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default async function YobikakePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  // 天空の呼びかけの動画1本ごとに ?q=NNN を振ってあり、同じ問いで着地させる
  return <YobikakeClient qid={q ?? "001"} />;
}
