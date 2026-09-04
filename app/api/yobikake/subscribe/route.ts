import { NextResponse } from "next/server";

/**
 * 天空の呼びかけ — メール登録
 *
 * v1 でやること（実装済みの範囲だけ約束する）:
 *   1. Resend の Audience に連絡先を追加する（配信リストの実体）
 *   2. その場で「いま書いた3つ」を本人にメールで返す
 *      → 回答がブラウザから消えても、本人の受信箱に残る
 *
 * 日次配信そのものは未実装。ここでは「毎朝届く」と約束しない。
 *
 * 送信元について:
 *   この Resend アカウントで認証済みなのは yyamagen358.com のみ（2026-09-04 時点）。
 *   ikiru.fun は未登録なので noreply@ikiru.fun では送れない。
 *   ブランドを揃えるなら Resend に ikiru.fun を追加して DNS 認証を通し、
 *   RESEND_FROM を noreply@ikiru.fun に差し替える。
 */

type Answer = { q: string; a: string };

const FROM = process.env.RESEND_FROM ?? "AI Nation <noreply@yyamagen358.com>";
const REPLY_TO = process.env.RESEND_REPLY_TO ?? "noreply@yyamagen358.com";
const RESEND = "https://api.resend.com";

function esc(s: string) {
    return s.replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
    );
}

function isEmail(s: unknown): s is string {
    return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= 254;
}

export async function POST(req: Request) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
        // 設定が無いまま登録を受け付けると「登録したのに何も来ない」が起きる
        return NextResponse.json(
            { error: "メール配信がまだ設定されていません。時間をおいて試してください。" },
            { status: 503 },
        );
    }

    let body: { email?: unknown; answers?: unknown };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "リクエストが不正です。" }, { status: 400 });
    }

    const { email, answers } = body;
    if (!isEmail(email)) {
        return NextResponse.json({ error: "メールアドレスの形式を確認してください。" }, { status: 400 });
    }
    const list: Answer[] = Array.isArray(answers)
        ? (answers as Answer[])
              .filter((x) => x && typeof x.q === "string" && typeof x.a === "string")
              .slice(0, 5)
        : [];

    const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

    // 1) 配信リストに追加（Audience 未設定なら送信だけ行う）
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
        try {
            await fetch(`${RESEND}/audiences/${audienceId}/contacts`, {
                method: "POST",
                headers,
                body: JSON.stringify({ email, unsubscribed: false }),
            });
        } catch {
            // リスト追加の失敗で本人への返信まで止めない
        }
    }

    // 2) 本人に「いま書いた3つ」を返す
    const rows = list
        .map(
            (x) =>
                `<p style="margin:0 0 18px"><span style="color:#8a8a8a;font-size:13px">${esc(x.q)}</span><br>` +
                `<strong style="font-size:17px">${esc(x.a)}</strong></p>`,
        )
        .join("");

    const html =
        `<div style="font-family:sans-serif;line-height:1.9;color:#1a1a1a;max-width:520px">` +
        `<p style="color:#8a8a8a;font-size:13px;letter-spacing:.1em">天空の呼びかけ</p>` +
        `<h1 style="font-size:20px;margin:8px 0 24px">あなたが書いた3つ</h1>` +
        rows +
        `<hr style="border:0;border-top:1px solid #e5e5e5;margin:28px 0">` +
        `<p style="font-size:14px;color:#555">この3つが、あなたの出発点です。` +
        `毎朝の問いをお届けする準備が整いましたら、あらためてご連絡します。</p>` +
        `<p style="font-size:12px;color:#9a9a9a;margin-top:24px">AI Nation — new.ikiru.fun</p>` +
        `</div>`;

    // 迷惑メール対策: text 版を併記する（HTMLのみは強くスパム判定される）。
    // List-Unsubscribe は配信停止ページを作ってから付ける。
    // 404 を指すヘッダは無いより悪い（Gmail が実際に参照する）。
    const text =
        `天空の呼びかけ\n\nあなたが書いた3つ\n\n` +
        list.map((x) => `${x.q}\n→ ${x.a}\n`).join("\n") +
        `\n---\nこの3つが、あなたの出発点です。\n` +
        `毎朝の問いをお届けする準備が整いましたら、あらためてご連絡します。\n\n` +
        `AI Nation — https://new.ikiru.fun\n`;

    const res = await fetch(`${RESEND}/emails`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            from: FROM,
            to: [email],
            reply_to: REPLY_TO,
            subject: "あなたが書いた3つ — 天空の呼びかけ",
            html,
            text,
        }),
    });

    if (!res.ok) {
        return NextResponse.json(
            { error: "送信に失敗しました。しばらくして試してください。" },
            { status: 502 },
        );
    }

    return NextResponse.json({ ok: true });
}
