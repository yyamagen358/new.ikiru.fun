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

const KIND_MARK: Record<string, string> = { video: "▶", image: "◼", text: "✎" };

function jstNow() {
  const d = new Date();
  return new Date(d.getTime() + (d.getTimezoneOffset() + 540) * 60000);
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
  const minutesNow = now ? now.getHours() * 60 + now.getMinutes() : 0;

  const slotMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    // 00:00 と 02:00、04:00 は「その日の深夜」なので、当日の早い時刻として扱う
    return h * 60 + m;
  };

  return (
    <section
      id="broadcast"
      className="relative py-20 px-5 [@media(min-width:900px)]:px-20 bg-white"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-portal-rose via-portal-amber to-portal-lavender opacity-40" />

      <div className="max-w-[1000px] mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-3">
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
              {day?.date}（{"日月火水木金土"[now.getDay()]}）
              {" "}
              {String(now.getHours()).padStart(2, "0")}:
              {String(now.getMinutes()).padStart(2, "0")} 現在
            </p>
          )}
        </div>

        <p className="font-round text-[0.92rem] text-portal-text-soft mb-8 leading-relaxed">
          2時間おきに、ひとつずつ公開されます。まだ時間が来ていないものは予告です。
        </p>

        {error && (
          <p className="font-round text-[0.9rem] text-portal-text-soft py-10 text-center">
            番組表をいま読み込めませんでした。時間をおいて開いてみてください。
          </p>
        )}
        {!error && !schedule && (
          <p className="font-round text-[0.9rem] text-portal-text-muted py-10 text-center">
            番組表を読み込んでいます…
          </p>
        )}

        {stale && (
          <p className="font-round text-[0.8rem] text-portal-text-soft mb-4">
            ※ 本日分がまだ届いていないため、{day?.date} の内容を表示しています。
          </p>
        )}

        {day && (
          <ul className="list-none flex flex-col divide-y divide-portal-amber/15 border-y border-portal-amber/20">
            {day.slots.map((s) => {
              const open = minutesNow >= slotMinutes(s.time);
              const fresh =
                open && s.isNew && lastVisit > 0 && Date.now() - lastVisit > 3 * 3600_000;

              return (
                <li key={s.time}>
                  <SlotRow slot={s} open={open} fresh={Boolean(fresh)} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function SlotRow({ slot, open, fresh }: { slot: Slot; open: boolean; fresh: boolean }) {
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
        </p>
        {slot.silence ? (
          <p className="font-serif text-[0.98rem] text-portal-text-soft">{slot.sub}</p>
        ) : !open ? (
          <p className="font-round text-[0.92rem] text-portal-text-soft">
            {slot.time} 公開予定 — {slot.sub}
          </p>
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
        {open && !slot.silence && !slot.empty && (
          <span className="font-round text-[0.78rem] font-bold text-portal-amber-deep">→</span>
        )}
      </div>
    </div>
  );

  if (!open || slot.silence || slot.empty || !slot.href) {
    return <div className="px-1">{inner}</div>;
  }
  return (
    <a
      href={`${CONTENT_ORIGIN}${slot.href}`}
      className="block px-1 rounded-lg transition-colors duration-200 hover:bg-portal-cream-deep/60"
    >
      {inner}
    </a>
  );
}
