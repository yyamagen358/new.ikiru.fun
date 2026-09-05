/**
 * 天空の呼びかけ — メール共通処理
 *
 * 送信元は Resend で認証済みのドメインに合わせる。
 * ikiru.fun は未登録なので既定は yyamagen358.com。認証したら RESEND_FROM で差し替える。
 */
import data from "@/lib/yobikake-questions.json";

export type Option = { n: string; name: string; reply: string };
export type Q = {
  id: string;
  q: string;
  mode: "stance" | "free";
  options?: Option[];
  examples?: string[];
};

export const QUESTIONS = data.questions as Q[];
export const RESEND = "https://api.resend.com";
export const FROM = process.env.RESEND_FROM ?? "AI Nation <noreply@yyamagen358.com>";
/**
 * メール内リンクの宛先。既定は本番。
 * 動作確認のときだけ .env.local で YOBIKAKE_SITE=http://localhost:3000 を指定する。
 * 本番側では絶対に設定しないこと（顧客のメールが localhost を指してしまう）。
 */
export const SITE = process.env.YOBIKAKE_SITE ?? "https://new.ikiru.fun";

/** 使命トリセツ（診断）。7日目にだけ渡す */
export const SOULMISSION = "https://soulmission358.com";

/**
 * 診断を案内する日。
 *
 * 3日目までは習慣が立っておらず、売り込みに見える。
 * 7日目なら「7日続いた」ことへの贈り物として渡せるうえ、
 * 本人の中に7つの答えが溜まっていて「反復」を語る材料がある。
 */
export const GIFT_DAY = 7;

export function headers(key: string) {
  return { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

export function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

/** JST（UTC+9）での「日付」に丸める。Vercel の実行環境は UTC なので必ずこれを通す。 */
export function jstDayNumber(from: string | Date, now: Date = new Date()): number {
  const MS_DAY = 86_400_000;
  const JST = 9 * 3600_000;
  const day = (d: Date) => Math.floor((d.getTime() + JST) / MS_DAY);
  return day(now) - day(new Date(from));
}

/** 同じ人には同じ順路を、違う人には違う順路を。保存なしで決定的に選ぶ。 */
export function pickQuestion(seed: string, day: number): Q {
  let h = 5381;
  for (const c of `${seed}#${day}`) h = ((h * 33) ^ c.charCodeAt(0)) >>> 0;
  return QUESTIONS[h % QUESTIONS.length];
}

export function unsubUrl(contactId: string) {
  return `${SITE}/api/yobikake/unsubscribe?c=${encodeURIComponent(contactId)}`;
}

/** その日の1問だけを開く画面。メールの「答えを書き残す」から飛ぶ。 */
export function answerUrl(qid: string, day: number, contactId: string) {
  return `${SITE}/yobikake/answer?q=${qid}&d=${day}&c=${encodeURIComponent(contactId)}`;
}

/** 7日目に渡す診断への入口。#{contactId} を載せて、番号を1タップで返せるようにする。 */
export function giftUrl(contactId: string) {
  return `${SOULMISSION}/?from=yobikake&d=${GIFT_DAY}&c=${encodeURIComponent(contactId)}`;
}

/**
 * 7日目だけ足すブロック。
 *
 * 売り込みにしない。7つ答えたという事実を返して、
 * 「今日はいつもと違う角度の問い」として渡す。
 */
function giftHtml(contactId: string) {
  return (
    `<div style="background:#f7f7f7;border-radius:12px;padding:20px;margin:28px 0 0">` +
    `<p style="margin:0 0 12px;font-size:15px;font-weight:bold">7日続きました。</p>` +
    `<p style="margin:0 0 12px;font-size:15px;line-height:1.9">` +
    `あなたはこれまで7つの問いに答えました。<br>` +
    `答えたのは、ぜんぶ同じ一人です。</p>` +
    `<p style="margin:0 0 18px;font-size:15px;line-height:1.9">` +
    `その一人がどんな人なのかを、生年月日の数字から見てみます。<br>` +
    `今日は、いつもと違う角度からの問いです。</p>` +
    `<p style="margin:0 0 8px"><a href="${giftUrl(contactId)}" ` +
    `style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;` +
    `padding:13px 30px;border-radius:999px;font-size:15px;font-weight:bold">使命トリセツを見る</a></p>` +
    `<p style="margin:0;font-size:13px;color:#8a8a8a">無料・登録不要・約1分</p>` +
    `</div>`
  );
}

function giftText(contactId: string) {
  return [
    "",
    "7日続きました。",
    "",
    "あなたはこれまで7つの問いに答えました。",
    "答えたのは、ぜんぶ同じ一人です。",
    "",
    "その一人がどんな人なのかを、生年月日の数字から見てみます。",
    "今日は、いつもと違う角度からの問いです。",
    giftUrl(contactId),
    "無料・登録不要・約1分",
    "",
  ].join("\n");
}

/** 毎朝の1通。答えを強制せず、休んでも続くことを毎回書く。 */
export function dailyMail(q: Q, day: number, contactId: string) {
  const unsub = unsubUrl(contactId);
  const body =
    q.mode === "stance" && q.options
      ? q.options.map((o) => `${o.n} ${o.name} — ${o.reply}`)
      : (q.examples ?? []).map((e) => `・${e}`);

  const html =
    `<div style="font-family:sans-serif;line-height:1.95;color:#1a1a1a;max-width:520px">` +
    `<p style="color:#8a8a8a;font-size:13px;letter-spacing:.1em">今日の呼びかけ　${day}日目</p>` +
    `<h1 style="font-size:21px;line-height:1.6;margin:14px 0 26px">${esc(q.q)}</h1>` +
    (body.length
      ? `<div style="background:#f7f7f7;border-radius:12px;padding:18px 20px;margin:0 0 26px">` +
        (q.mode === "free"
          ? `<p style="margin:0 0 10px;font-size:13px;color:#8a8a8a">たとえば</p>`
          : "") +
        body
          .map((l) => `<p style="margin:0 0 10px;font-size:15px">${esc(l)}</p>`)
          .join("") +
        `</div>`
      : "") +
    `<p style="font-size:15px;color:#555">心の中で一度だけ答えてみてください。` +
    `書き残しておくこともできます。</p>` +
    `<p style="margin:22px 0 6px"><a href="${answerUrl(q.id, day, contactId)}" ` +
    `style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;` +
    `padding:13px 30px;border-radius:999px;font-size:15px;font-weight:bold">答えを書き残す</a></p>` +
    `<p style="font-size:14px;color:#777">書かなかった日があっても、問いは止まりません。</p>` +
    (day === GIFT_DAY ? giftHtml(contactId) : "") +
    `<hr style="border:0;border-top:1px solid #e5e5e5;margin:28px 0">` +
    `<p style="font-size:12px;color:#9a9a9a">AI Nation — ${SITE}<br>` +
    `<a href="${unsub}" style="color:#9a9a9a">配信を止める</a></p>` +
    `</div>`;

  const text =
    `今日の呼びかけ　${day}日目\n\n${q.q}\n\n` +
    (body.length ? body.join("\n") + "\n\n" : "") +
    `心の中で一度だけ答えてみてください。書き残しておくこともできます。\n` +
    `${answerUrl(q.id, day, contactId)}\n\n` +
    `書かなかった日があっても、問いは止まりません。\n` +
    (day === GIFT_DAY ? giftText(contactId) : "") +
    `\nAI Nation — ${SITE}\n配信を止める: ${unsub}\n`;

  return {
    subject: `今日の呼びかけ　${day}日目`,
    html,
    text,
    headers: {
      "List-Unsubscribe": `<${unsub}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}
