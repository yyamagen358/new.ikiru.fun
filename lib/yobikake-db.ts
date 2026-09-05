/**
 * 天空の呼びかけ — 回答の保存（Supabase REST）
 *
 * cc-ally と同じ Supabase プロジェクトに同居する。
 * 新しい依存を足さないよう PostgREST を fetch で直接叩く。
 *
 * テーブル定義は lib/yobikake-answers.sql。RLS を有効にしてあるので
 * service_role キー以外からは読み書きできない。匿名キーは使わないこと。
 */

const TABLE = "yobikake_answers";

export type AnswerRow = {
  contact_id: string;
  email: string;
  day: number;
  question_id: string;
  question: string;
  answer: string;
  source: "lp" | "daily";
};

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

/** 保存が未設定でも本人へのメールは止めない。設定漏れは戻り値で判別する。 */
export async function saveAnswers(
  rows: AnswerRow[],
): Promise<{ saved: boolean; reason?: string }> {
  if (!rows.length) return { saved: false, reason: "empty" };
  const c = config();
  if (!c) return { saved: false, reason: "not-configured" };

  try {
    const res = await fetch(`${c.url}/rest/v1/${TABLE}`, {
      method: "POST",
      headers: {
        apikey: c.key,
        Authorization: `Bearer ${c.key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(rows),
    });
    if (!res.ok) {
      return { saved: false, reason: `http-${res.status}` };
    }
    return { saved: true };
  } catch {
    return { saved: false, reason: "network" };
  }
}

/** 証（before/after）を作るときに使う。ある人の全回答を日付順で取り出す。 */
export async function listAnswers(contactId: string) {
  const c = config();
  if (!c) return [];
  const q =
    `${c.url}/rest/v1/${TABLE}` +
    `?contact_id=eq.${encodeURIComponent(contactId)}&order=day.asc,created_at.asc`;
  const res = await fetch(q, {
    headers: { apikey: c.key, Authorization: `Bearer ${c.key}` },
  });
  if (!res.ok) return [];
  return (await res.json()) as (AnswerRow & { id: number; created_at: string })[];
}
