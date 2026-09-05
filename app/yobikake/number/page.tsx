import type { Metadata } from "next";
import NumberClient from "./number-client";

export const metadata: Metadata = {
  title: "番号を受け取りました",
  description: "診断で出たソウルナンバーを、毎朝の呼びかけに伝える。",
  robots: { index: false, follow: false },
};

export default async function NumberPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string; c?: string }>;
}) {
  const { n, c } = await searchParams;
  return <NumberClient soulNumber={Number(n) || 0} contactId={c ?? ""} />;
}
