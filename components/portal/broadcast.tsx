"use client";

import { useEffect, useState } from "react";

/**
 * 番組表 — 1日12枠、2時間おきに1本ずつ公開される。
 *
 * content.ikiru.fun が schedule.json を焼き、ここはそれを読むだけ。
 * 公開判定はブラウザの時計で行うので、静的サイトのままで2時間ごとに画面が変わる。
 *
 * Yahoo に無くてこれにできるのが「予告」。次に何が出るかを約束できる。
 * ただし約束するからには、枠が埋まらないのに時刻だけ進む状態を作ってはいけない。
 * 在庫が尽きた枠は schedule.json 側で再放送に落として、必ず埋まるようにしている。
 *
 * この節はトップのファーストビューに置いてある。つまり
 *   ・fetch を待つ間に「読み込み中」の一行だけが看板になってはいけない
 *   ・時刻が分かる前に全枠が予告色に沈んではいけない
 * この2つが下にあった頃と決定的に違う。FRAME と now の扱いはそのための措置。
 */

const SCHEDULE_URL = "https://content.ikiru.fun/schedule.json";
const CONTENT_ORIGIN = "https://content.ikiru.fun";
const LAST_VISIT_KEY = "aination:lastVisit";

type Slot = {
  time: string;
  key: string;
  label: string;
  sub: string;
  title?: string;
  href?: string;
  kind?: "video" | "image" | "text";
  thumb?: string | null;
  date?: string;
  isNew?: boolean;
  silence?: boolean;
  empty?: boolean;
  from?: string;
};
type Day = { date: string; slots: Slot[] };
type Schedule = { generatedAt: string; days: Day[] };

/**
 * 枠だけの雛形。schedule.json が届く前 —— および読めなかったとき —— でも
 * 「今日はこの形で1日が流れる」を出すために持つ。
 *
 * 番組の実体（タイトル・リンク）は必ず JSON 側から来る。ここは器でしかない。
 * 枠の定義そのものは content.ikiru.fun の scripts/schedule.mjs が正で、
 * 向こうを増減させたときはここも揃えること（揃え忘れても番組は変わらず、
 * 一瞬だけ古い枠名が見えるだけで済むようにしてある）。
 */
const FRAME: Slot[] = [
  { time: "06:00", key: "poetry",  label: "朝の一篇",             sub: "起き抜けに、声で受け取る" },
  { time: "08:00", key: "ryuho",   label: "龍鳳学舎",             sub: "龍先生と鳳凰ちゃんの対話を、動画で" },
  { time: "10:00", key: "english", label: "English Poem",         sub: "画像1枚。海外の時間帯にも届く" },
  { time: "12:00", key: "manga",   label: "昼の4コマ",            sub: "昼休みに、軽く笑って軽く効く" },
  { time: "14:00", key: "stories", label: "物語",                 sub: "午後の読み物" },
  { time: "16:00", key: "kids",    label: "子どもたちへ",         sub: "子どもが帰ってくる時間" },
  { time: "18:00", key: "slide",   label: "親子のスライドショー", sub: "夕食前に、親子で1本" },
  { time: "20:00", key: "mondou",  label: "内観問答",             sub: "1日を振り返る時間" },
  { time: "22:00", key: "music",   label: "夜の楽曲",             sub: "今日を閉じる音" },
  { time: "00:00", key: "healing", label: "Healing",              sub: "眠りにつく前に" },
  { time: "02:00", key: "rerun",   label: "眠れない人へ",         sub: "在庫から、もう一度" },
  { time: "04:00", key: "silence", label: "静寂",                 sub: "何も出しません。今日の空だけが変わります", silence: true },
];

const KIND_MARK: Record<string, string> = { video: "▶", image: "◼", text: "✎" };

function jstNow() {
  const d = new Date();
  return new Date(d.getTime() + (d.getTimezoneOffset() + 540) * 60000);
}

function slotMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  // 00:00 と 02:00、04:00 は「その日の深夜」なので、当日の早い時刻として扱う
  return h * 60 + m;
}

export function Broadcast() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [error, setError] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [lastVisit, setLastVisit] = useState<number>(0);

  useEffect(() => {
    setNow(jstNow());
    const t = setInterval(() => setNow(jstNow()), 60_000);

    try {
      const prev = Number(localStorage.getItem(LAST_VISIT_KEY) || 0);
      setLastVisit(prev);
      localStorage.setItem(LAST_VISIT_KEY, String(Date.now()));
    } catch {
      /* プライベートモード等。NEW バッジが出ないだけ */
    }

    fetch(SCHEDULE_URL, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setSchedule)
      .catch(() => setError(true));

    return () => clearInterval(t);
  }, []);

  const todayStr = now ? now.toISOString().slice(0, 10) : null;
  const day =
    schedule && todayStr
      ? schedule.days.find((d) => d.date === todayStr) ?? schedule.days[0]
      : null;
  const stale = Boolean(day && todayStr && day.date !== todayStr);

  // 番組が届くまでは枠だけで表を組む。空白の画面を先頭に置かないため。
  const rows = day ? day.slots : FRAME;
  const pending = !day;

  const minutesNow = now ? now.getHours() * 60 + now.getMinutes() : 0;

  // いま放送中の枠 = 現在時刻を過ぎた枠のうち、いちばん遅いもの。
  // 00:00 の枠が必ずあるので、時刻さえ分かれば必ずどれかが該当する。
  const passed = now
    ? rows.map((r) => slotMinutes(r.time)).filter((m) => m <= minutesNow)
    : [];
  const currentMinutes = passed.length ? Math.max(...passed) : null;

  return (
    <section
      id="broadcast"
      className="relative pt-10 pb-20 px-5 [@media(min-width:900px)]:px-20 bg-white"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-portal-rose via-portal-amber to-portal-lavender opacity-40" />

      <div className="max-w-[1000px] mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-2">
          <div>
            <p className="font-round text-[0.72rem] tracking-[0.32em] uppercase font-bold text-portal-amber-deep mb-2">
              Today&apos;s Programme
            </p>
            <h2 className="font-serif text-[clamp(1.7rem,3vw,2.3rem)] font-semibold text-portal-text-dark">
              今日の番組表
            </h2>
          </div>
          {now && (
            <p className="font-round text-[0.78rem] text-portal-text-soft tabular-nums">
              {day?.date ?? todayStr}（{"日月火水木金土"[now.getDay()]}）
              {" "}
              {String(now.getHours()).padStart(2, "0")}:
              {String(now.getMinutes()).padStart(2, "0")} 現在
            </p>
          )}
        </div>

        <p className="font-round text-[0.92rem] text-portal-text-soft mb-6 leading-relaxed">
          2時間おきに、ひとつずつ公開されます。まだ時間が来ていないものは予告です。
        </p>

        {error && (
          <p className="font-round text-[0.85rem] text-portal-text-soft mb-4">
            ※ 番組表をいま読み込めませんでした。枠だけ表示しています。
          </p>
        )}

        {stale && (
          <p className="font-round text-[0.8rem] text-portal-text-soft mb-4">
            ※ 本日分がまだ届いていないため、{day?.date} の内容を表示しています。
          </p>
        )}

        <ul className="list-none flex flex-col divide-y divide-portal-amber/15 border-y border-portal-amber/20">
          {rows.map((s) => {
            // 時刻が分かるまでは沈めない。SSR の一瞬だけ全枠が予告色になるのを避ける。
            const open = now ? minutesNow >= slotMinutes(s.time) : true;
            const fresh =
              open && s.isNew && lastVisit > 0 && Date.now() - lastVisit > 3 * 3600_000;

            return (
              <li key={s.time}>
                <SlotRow
                  slot={s}
                  open={open}
                  known={Boolean(now)}
                  current={currentMinutes !== null && slotMinutes(s.time) === currentMinutes}
                  pending={pending}
                  fresh={Boolean(fresh)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function SlotRow({
  slot,
  open,
  known,
  current,
  pending,
  fresh,
}: {
  slot: Slot;
  open: boolean;
  known: boolean;
  current: boolean;
  pending: boolean;
  fresh: boolean;
}) {
  const inner = (
    <div
      className={`grid grid-cols-[64px_1fr] [@media(min-width:700px)]:grid-cols-[74px_1fr_auto] gap-x-4 gap-y-1 items-center py-4 transition-colors duration-200 ${
        open ? "" : "opacity-45"
      }`}
    >
      <span className="font-round text-[0.95rem] font-bold tabular-nums text-portal-text-dark">
        {slot.time}
      </span>

      <div className="min-w-0">
        <p className="font-round text-[0.72rem] tracking-[0.14em] text-portal-text-soft mb-[2px]">
          {slot.label}
          {current && (
            <span className="ml-2 font-bold tracking-[0.08em] text-portal-rose-deep">
              いま
            </span>
          )}
        </p>
        {slot.silence ? (
          <p className="font-serif text-[0.98rem] text-portal-text-soft">{slot.sub}</p>
        ) : known && !open ? (
          <p className="font-round text-[0.92rem] text-portal-text-soft">
            {slot.time} 公開予定 — {slot.sub}
          </p>
        ) : pending ? (
          // 番組名が届くまでは枠の趣旨を出しておく。ここが「読み込み中」の代わり。
          <p className="font-round text-[0.92rem] text-portal-text-muted">{slot.sub}</p>
        ) : slot.empty ? (
          <p className="font-round text-[0.92rem] text-portal-text-soft">準備中</p>
        ) : (
          <p className="font-serif text-[1.02rem] font-bold text-portal-text-dark leading-snug truncate">
            <span className="text-portal-amber-deep mr-2" aria-hidden="true">
              {KIND_MARK[slot.kind ?? "text"]}
            </span>
            {slot.title}
          </p>
        )}
      </div>

      <div className="hidden [@media(min-width:700px)]:flex items-center gap-2 justify-self-end">
        {fresh && (
          <span className="font-round text-[0.6rem] font-bold tracking-[0.08em] bg-portal-rose-deep text-white px-2 py-[2px] rounded">
            NEW
          </span>
        )}
        {open && !slot.silence && !slot.empty && !pending && (
          <span className="font-round text-[0.78rem] font-bold text-portal-amber-deep">→</span>
        )}
      </div>
    </div>
  );

  // いま放送中の枠だけ、左に細い印を置いて視線の着地点を作る
  const body = (
    <div
      className={
        current
          ? "px-1 border-l-[3px] border-portal-rose-deep -ml-[3px] pl-[7px] bg-portal-cream/40"
          : "px-1"
      }
    >
      {inner}
    </div>
  );

  if (!open || slot.silence || slot.empty || !slot.href) {
    return body;
  }
  return (
    <a
      href={`${CONTENT_ORIGIN}${slot.href}`}
      className="block rounded-lg transition-colors duration-200 hover:bg-portal-cream-deep/60"
    >
      {body}
    </a>
  );
}
