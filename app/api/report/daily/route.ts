import { NextResponse } from "next/server";
import { RESEND, FROM, headers as authHeaders, esc } from "@/lib/yobikake-mail";

/**
 * 毎朝の計測レポート
 *
 * これまで「無料診断を何人が受けたか」がまったく見えていなかった。
 * 毎朝それを1通にまとめて届ける。
 *
 * 時刻について:
 *   Vercel Cron は UTC 固定。vercel.json の "30 21 * * *" は
 *   UTC 21:30 = JST 翌朝 06:30。JST を変えるときは必ず -9時間する。
 *
 * 集計の区切りも JST。UTC で切ると日本時間の朝9時までが前日扱いになってしまう。
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const JST = 9 * 3600_000;
const REPORT_TO = process.env.REPORT_TO ?? "yyamagen@gmail.com";

/** JST の「その日の 00:00」を UTC の ISO 文字列で返す */
function jstMidnight(daysAgo: number): string {
  const nowJst = Date.now() + JST;
  const dayStartJst = Math.floor(nowJst / 86_400_000) * 86_400_000 - daysAgo * 86_400_000;
  return new Date(dayStartJst - JST).toISOString();
}

async function sb(path: string) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) return null;
  return res.json();
}

function tally<T>(rows: T[], pick: (r: T) => string | number) {
  const m = new Map<string, number>();
  for (const r of rows) {
    const k = String(pick(r));
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET が未設定です" }, { status: 503 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "Resend が未設定です" }, { status: 503 });

  const from = jstMidnight(1); // 昨日 00:00 JST
  const to = jstMidnight(0); // 今日 00:00 JST
  const range = `created_at=gte.${from}&created_at=lt.${to}`;

  type Diag = { soul_number: number; source: string };
  type Ans = { day: number; source: string; email: string };

  const [diagY, diagAll, ansY, ansAll] = await Promise.all([
    sb(`soulmission_diagnoses?select=soul_number,source&${range}`) as Promise<Diag[] | null>,
    sb(`soulmission_diagnoses?select=soul_number`) as Promise<Diag[] | null>,
    sb(`yobikake_answers?select=day,source,email&${range}`) as Promise<Ans[] | null>,
    sb(`yobikake_answers?select=email`) as Promise<Ans[] | null>,
  ]);

  if (!diagY || !diagAll) {
    return NextResponse.json({ error: "Supabase から取得できません" }, { status: 502 });
  }

  const dateLabel = new Date(new Date(from).getTime() + JST).toISOString().slice(0, 10);
  const byNumber = tally(diagY, (r) => r.soul_number);
  const bySource = tally(diagY, (r) => r.source);

  const line = (label: string, value: string | number) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#8a8a8a;font-size:13px">${esc(label)}</td>` +
    `<td style="padding:6px 0;font-size:17px;font-weight:bold">${esc(String(value))}</td></tr>`;

  const rows = (pairs: [string, number][], unit = "件") =>
    pairs.length
      ? pairs
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#8a8a8a;font-size:13px">${esc(k)}</td>` +
              `<td style="padding:4px 0;font-size:15px">${v}${unit}</td></tr>`,
          )
          .join("")
      : `<tr><td colspan="2" style="padding:4px 0;color:#9a9a9a;font-size:13px">なし</td></tr>`;

  const html =
    `<div style="font-family:sans-serif;line-height:1.8;color:#1a1a1a;max-width:520px">` +
    `<p style="color:#8a8a8a;font-size:13px;letter-spacing:.1em">${dateLabel} の記録</p>` +
    `<h1 style="font-size:20px;margin:10px 0 22px">使命トリセツ 無料診断</h1>` +
    `<table style="border-collapse:collapse">` +
    line("昨日の診断数", `${diagY.length} 件`) +
    line("累計", `${diagAll.length} 件`) +
    `</table>` +
    `<p style="font-size:13px;color:#8a8a8a;margin:22px 0 6px">ソウルナンバー別（昨日）</p>` +
    `<table style="border-collapse:collapse">${rows(byNumber, "人")}</table>` +
    `<p style="font-size:13px;color:#8a8a8a;margin:22px 0 6px">流入元（昨日）</p>` +
    `<table style="border-collapse:collapse">${rows(bySource)}</table>` +
    `<hr style="border:0;border-top:1px solid #e5e5e5;margin:28px 0">` +
    `<h2 style="font-size:17px;margin:0 0 12px">天空の呼びかけ</h2>` +
    `<table style="border-collapse:collapse">` +
    line("昨日の回答数", `${ansY?.length ?? 0} 件`) +
    line("回答した人数", `${new Set((ansY ?? []).map((a) => a.email)).size} 人`) +
    line("累計の回答者", `${new Set((ansAll ?? []).map((a) => a.email)).size} 人`) +
    `</table>` +
    `<p style="font-size:12px;color:#9a9a9a;margin-top:28px">AI Nation — 毎朝 6:30 JST</p></div>`;

  const text =
    `${dateLabel} の記録\n\n【使命トリセツ 無料診断】\n` +
    `昨日: ${diagY.length}件 / 累計: ${diagAll.length}件\n` +
    `ソウルナンバー別: ${byNumber.map(([k, v]) => `${k}=${v}`).join(" ") || "なし"}\n` +
    `流入元: ${bySource.map(([k, v]) => `${k}=${v}`).join(" ") || "なし"}\n\n` +
    `【天空の呼びかけ】\n` +
    `昨日の回答: ${ansY?.length ?? 0}件 / ` +
    `回答者: ${new Set((ansY ?? []).map((a) => a.email)).size}人 / ` +
    `累計回答者: ${new Set((ansAll ?? []).map((a) => a.email)).size}人\n`;

  const r = await fetch(`${RESEND}/emails`, {
    method: "POST",
    headers: authHeaders(key),
    body: JSON.stringify({
      from: FROM,
      to: [REPORT_TO],
      subject: `${dateLabel} 診断 ${diagY.length}件 / 回答 ${ansY?.length ?? 0}件`,
      html,
      text,
    }),
  });
  if (!r.ok) return NextResponse.json({ error: "送信できませんでした" }, { status: 502 });

  return NextResponse.json({ ok: true, date: dateLabel, diagnoses: diagY.length });
}
