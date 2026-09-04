import { NextResponse } from "next/server";
import {
  RESEND,
  FROM,
  headers as authHeaders,
  jstDayNumber,
  pickQuestion,
  dailyMail,
} from "@/lib/yobikake-mail";

/**
 * 天空の呼びかけ — 毎朝の配信（Vercel Cron から呼ばれる）
 *
 * 時刻について:
 *   Vercel Cron は UTC 固定でタイムゾーンを指定できない。
 *   vercel.json の "0 21 * * *" は UTC 21:00 = JST 翌朝 06:00 を意味する。
 *   JST を変えるときは必ず -9時間して UTC に直すこと。
 *
 * 何日目かは Resend の contact.created_at から JST 基準で計算する。
 * 進捗を保存する DB が無くても成立させるための設計。
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Contact = { id: string; email: string; created_at: string; unsubscribed?: boolean };

export async function GET(req: Request) {
  const key = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const secret = process.env.CRON_SECRET;

  // Vercel Cron は Authorization: Bearer $CRON_SECRET を付けて呼ぶ。
  // 秘密が未設定なら誰でも配信を起動できてしまうので、その場合は動かさない。
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET が未設定です" }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!key || !audienceId) {
    return NextResponse.json({ error: "Resend の設定が足りません" }, { status: 503 });
  }

  const H = authHeaders(key);
  const res = await fetch(`${RESEND}/audiences/${audienceId}/contacts`, { headers: H });
  if (!res.ok) {
    return NextResponse.json({ error: "配信リストを取得できません" }, { status: 502 });
  }
  const contacts: Contact[] = (await res.json()).data ?? [];

  // 動作確認用の日数上書き。CRON_SECRET を持つ人しか使えない。
  // 例: /api/yobikake/daily?day=1 で「1日目」の文面を実際に送って確かめる。
  const params = new URL(req.url).searchParams;
  const forced = Number(params.get("day"));
  const forceDay = Number.isInteger(forced) && forced > 0 ? forced : null;
  // 宛先を1件に絞る。動作確認で他の登録者に重複配信しないため。
  const only = params.get("email");

  let sent = 0;
  let skipped = 0;
  const failed: string[] = [];

  for (const c of contacts) {
    if (c.unsubscribed || (only && c.email !== only)) {
      skipped++;
      continue;
    }
    // 登録当日は「書いた3つ」を既に送っているので、翌日を1日目とする
    const day = forceDay ?? jstDayNumber(c.created_at);
    if (day < 1) {
      skipped++;
      continue;
    }

    const q = pickQuestion(c.email, day);
    const mail = dailyMail(q, day, c.id);
    try {
      const r = await fetch(`${RESEND}/emails`, {
        method: "POST",
        headers: H,
        body: JSON.stringify({ from: FROM, to: [c.email], ...mail }),
      });
      if (r.ok) sent++;
      else failed.push(c.email);
    } catch {
      failed.push(c.email);
    }
    // Resend のレート制限にかからないよう間隔を空ける
    await new Promise((r) => setTimeout(r, 600));
  }

  return NextResponse.json({ ok: true, total: contacts.length, sent, skipped, failed });
}
