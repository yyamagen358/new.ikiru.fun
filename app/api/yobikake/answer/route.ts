import { NextResponse } from "next/server";
import { RESEND, FROM, SITE, headers as authHeaders, esc, QUESTIONS } from "@/lib/yobikake-mail";

/**
 * 天空の呼びかけ — その日の答えを書き残す
 *
 * いまは答えをサーバーに保存せず、本人の受信箱に送り返すだけ。
 * 受信箱がその人の記録になる。こちら側からは読めない。
 *
 * before/after の証（§07）を作る段になったら Supabase に保存する。
 * それまでに書かれた言葉は後から取り出せない点に注意。
 *
 * 宛先は contactId から Resend に問い合わせて解決する。
 * リクエストのメールアドレスを信用すると、第三者に送りつけられてしまう。
 */

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audienceId) {
    return NextResponse.json({ error: "いま受け付けられません。" }, { status: 503 });
  }

  let body: { contactId?: unknown; day?: unknown; qid?: unknown; answer?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストが不正です。" }, { status: 400 });
  }

  const contactId = typeof body.contactId === "string" ? body.contactId : "";
  const qid = typeof body.qid === "string" ? body.qid : "";
  const day = Number(body.day) > 0 ? Number(body.day) : 1;
  const answer = typeof body.answer === "string" ? body.answer.trim().slice(0, 1000) : "";

  if (!contactId || !qid || !answer) {
    return NextResponse.json({ error: "入力が足りません。" }, { status: 400 });
  }
  const question = QUESTIONS.find((x) => x.id === qid);
  if (!question) {
    return NextResponse.json({ error: "問いが見つかりません。" }, { status: 400 });
  }

  const H = authHeaders(key);

  // 宛先は必ずサーバー側で解決する
  const cr = await fetch(`${RESEND}/audiences/${audienceId}/contacts/${contactId}`, { headers: H });
  if (!cr.ok) {
    return NextResponse.json({ error: "リンクが正しくありません。" }, { status: 400 });
  }
  const contact = await cr.json();
  const email: string | undefined = contact?.email;
  if (!email) {
    return NextResponse.json({ error: "リンクが正しくありません。" }, { status: 400 });
  }

  const html =
    `<div style="font-family:sans-serif;line-height:1.95;color:#1a1a1a;max-width:520px">` +
    `<p style="color:#8a8a8a;font-size:13px;letter-spacing:.1em">${day}日目のあなたの答え</p>` +
    `<p style="font-size:13px;color:#8a8a8a;margin:18px 0 4px">${esc(question.q)}</p>` +
    `<p style="font-size:19px;font-weight:bold;margin:0 0 26px">${esc(answer)}</p>` +
    `<hr style="border:0;border-top:1px solid #e5e5e5;margin:0 0 20px">` +
    `<p style="font-size:14px;color:#555">このメールは消さずに残しておいてください。` +
    `1年後、同じ問いが届いたときに読み返せます。</p>` +
    `<p style="font-size:12px;color:#9a9a9a;margin-top:26px">AI Nation — ${SITE}</p></div>`;

  const text =
    `${day}日目のあなたの答え\n\n${question.q}\n→ ${answer}\n\n---\n` +
    `このメールは消さずに残しておいてください。\n` +
    `1年後、同じ問いが届いたときに読み返せます。\n\nAI Nation — ${SITE}\n`;

  const r = await fetch(`${RESEND}/emails`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({
      from: FROM,
      to: [email],
      subject: `${day}日目のあなたの答え`,
      html,
      text,
    }),
  });
  if (!r.ok) {
    return NextResponse.json({ error: "送信できませんでした。" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
