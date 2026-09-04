import type { Metadata } from "next";
import data from "@/lib/yobikake-questions.json";
import AnswerClient from "./answer-client";

type Option = { n: string; name: string; reply: string };
type Q = { id: string; q: string; mode: "stance" | "free"; options?: Option[]; examples?: string[] };

const QUESTIONS = data.questions as Q[];

export const metadata: Metadata = {
  title: "答えを書き残す",
  description: "今日の呼びかけに、ひとことで答える。",
  robots: { index: false, follow: false },
};

export default async function AnswerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; d?: string; c?: string }>;
}) {
  const { q, d, c } = await searchParams;
  const question = QUESTIONS.find((x) => x.id === q) ?? null;
  const day = Number(d) > 0 ? Number(d) : 1;
  return <AnswerClient q={question} day={day} contactId={c ?? ""} />;
}
