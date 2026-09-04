import { RESEND, headers as authHeaders } from "@/lib/yobikake-mail";

/**
 * 天空の呼びかけ — 配信停止
 *
 * メールの List-Unsubscribe と本文リンクの両方から呼ばれる。
 * 定期配信を出す以上これは必須で、無いまま送るとスパム判定に直結する。
 * 認証は求めない。止めたい人を止められないほうが害が大きい。
 */

export const dynamic = "force-dynamic";

function page(title: string, body: string, status = 200) {
  const html =
    `<!doctype html><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<title>${title}</title>` +
    `<div style="font-family:sans-serif;max-width:420px;margin:22vh auto;padding:0 24px;` +
    `line-height:1.95;color:#1a1a1a">` +
    `<h1 style="font-size:20px;margin:0 0 16px">${title}</h1>` +
    `<p style="font-size:15px;color:#555;margin:0">${body}</p>` +
    `<p style="font-size:12px;color:#9a9a9a;margin-top:32px">AI Nation</p></div>`;
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

async function unsubscribe(contactId: string | null) {
  const key = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!contactId) return page("リンクが正しくありません", "メール本文のリンクからもう一度お試しください。", 400);
  if (!key || !audienceId) return page("いま手続きできません", "時間をおいてお試しください。", 503);

  const r = await fetch(`${RESEND}/audiences/${audienceId}/contacts/${contactId}`, {
    method: "PATCH",
    headers: authHeaders(key),
    body: JSON.stringify({ unsubscribed: true }),
  });
  if (!r.ok) return page("いま手続きできません", "時間をおいてお試しください。", 502);

  return page("配信を止めました", "明日からの問いは届きません。ここまでお付き合いいただき、ありがとうございました。");
}

export async function GET(req: Request) {
  return unsubscribe(new URL(req.url).searchParams.get("c"));
}

// Gmail の One-Click 配信停止は POST で来る
export async function POST(req: Request) {
  return unsubscribe(new URL(req.url).searchParams.get("c"));
}
