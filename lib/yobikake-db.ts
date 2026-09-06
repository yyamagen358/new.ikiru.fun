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
const NUMBERS_TABLE = "yobikake_numbers";
const FUNNEL_TABLE = "yobikake_funnel";

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

/** 数秘で使う番号。マスターナンバーを含む。ここに無い値は受け取らない。 */
export const VALID_SOUL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33, 44];

/**
 * 自己申告された番号を記録する。
 *
 * 1人1行。あとから診断をやり直して言い直せるように upsert する
 * （生年月日は変わらないので普通は起きないが、家族の番号を入れてしまった等の
 *  取り消しができないと、間違いがそのまま残ってしまう）。
 */
export async function saveNumber(row: {
  contact_id: string;
  email: string;
  soul_number: number;
}): Promise<{ saved: boolean; reason?: string }> {
  const c = config();
  if (!c) return { saved: false, reason: "not-configured" };
  if (!VALID_SOUL_NUMBERS.includes(row.soul_number)) {
    return { saved: false, reason: "invalid-number" };
  }

  try {
    const res = await fetch(`${c.url}/rest/v1/${NUMBERS_TABLE}`, {
      method: "POST",
      headers: {
        apikey: c.key,
        Authorization: `Bearer ${c.key}`,
        "Content-Type": "application/json",
        // 同じ人が言い直したら上書きする
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify([
        {
          ...row,
          is_master: row.soul_number > 9,
          updated_at: new Date().toISOString(),
        },
      ]),
    });
    if (!res.ok) return { saved: false, reason: `http-${res.status}` };
    return { saved: true };
  } catch {
    return { saved: false, reason: "network" };
  }
}

export type FunnelStage = "visit" | "wrote" | "signup";

/**
 * LPの通過を記録する。
 *
 * 動画→LP→登録のどこで人が消えているかは、これが無いと一切分からない。
 * 記録に失敗しても本人の体験は止めないので、呼び出し側で待たなくてよい。
 */
export async function logFunnel(row: {
  stage: FunnelStage;
  question_id?: string | null;
  source?: string | null;
  referrer?: string | null;
}): Promise<{ saved: boolean; reason?: string }> {
  const c = config();
  if (!c) return { saved: false, reason: "not-configured" };
  try {
    const res = await fetch(`${c.url}/rest/v1/${FUNNEL_TABLE}`, {
      method: "POST",
      headers: {
        apikey: c.key,
        Authorization: `Bearer ${c.key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify([
        {
          stage: row.stage,
          question_id: (row.question_id ?? "").slice(0, 40) || null,
          source: (row.source ?? "direct").slice(0, 40) || "direct",
          referrer: (row.referrer ?? "").slice(0, 300) || null,
        },
      ]),
    });
    if (!res.ok) return { saved: false, reason: `http-${res.status}` };
    return { saved: true };
  } catch {
    return { saved: false, reason: "network" };
  }
}
