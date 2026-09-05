import { NextResponse } from "next/server";
import { RESEND, headers as authHeaders } from "@/lib/yobikake-mail";
import { saveNumber, VALID_SOUL_NUMBERS } from "@/lib/yobikake-db";

/**
 * 天空の呼びかけ — 診断で出た番号の自己申告
 *
 * soulmission358 の結果画面から「N を伝える」で来る。
 * 診断側は個人を持たない設計なので、番号と人が結びつくのはここだけ。
 *
 * 宛先（メール）はリクエストを信用せず contactId から Resend に問い合わせる。
 * 送られてきた値を信じると、他人の番号を書き換えられてしまう。
 */

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audienceId) {
    return NextResponse.json({ error: "いま受け付けられません。" }, { status: 503 });
  }

  let body: { contactId?: unknown; soulNumber?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストが不正です。" }, { status: 400 });
  }

  const contactId = typeof body.contactId === "string" ? body.contactId : "";
  const soulNumber = Number(body.soulNumber);
  if (!contactId || !VALID_SOUL_NUMBERS.includes(soulNumber)) {
    return NextResponse.json({ error: "リンクが正しくありません。" }, { status: 400 });
  }

  const H = authHeaders(key);
  const cr = await fetch(`${RESEND}/audiences/${audienceId}/contacts/${contactId}`, {
    headers: H,
  });
  if (!cr.ok) {
    return NextResponse.json({ error: "リンクが正しくありません。" }, { status: 400 });
  }
  const contact = await cr.json();
  const email: string | undefined = contact?.email;
  if (!email) {
    return NextResponse.json({ error: "リンクが正しくありません。" }, { status: 400 });
  }

  const saved = await saveNumber({ contact_id: contactId, email, soul_number: soulNumber });
  if (!saved.saved) {
    console.error("yobikake/number save failed", saved.reason);
    return NextResponse.json({ error: "うまく記録できませんでした。" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, soulNumber });
}
