import { NextResponse } from "next/server";
import { logFunnel, type FunnelStage } from "@/lib/yobikake-db";

/**
 * 天空の呼びかけ — LPの通過を記録する
 *
 * 個人は受け取らない。段階・問い・流入元だけ。
 * 記録できなくても 200 を返す。計測の失敗で画面を止めない。
 */

export const dynamic = "force-dynamic";

const STAGES: FunnelStage[] = ["visit", "wrote"];

export async function POST(req: Request) {
  let body: { stage?: unknown; q?: unknown; source?: unknown; referrer?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const stage = String(body.stage ?? "");
  // signup は subscribe 側がサーバーで記録する。ここから偽装させない。
  if (!STAGES.includes(stage as FunnelStage)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await logFunnel({
    stage: stage as FunnelStage,
    question_id: typeof body.q === "string" ? body.q : null,
    source: typeof body.source === "string" ? body.source : null,
    referrer: typeof body.referrer === "string" ? body.referrer : null,
  });

  return NextResponse.json({ ok: true });
}
