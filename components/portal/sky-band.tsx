"use client";

import { useEffect, useState } from "react";
import { getSky, type Sky } from "@/lib/koyomi";

/**
 * 「今日の空」— ページ最上部の帯。
 *
 * 静的サイトなので、ビルド時刻で焼くと翌日には嘘になる。
 * マウント後にクライアントの時計から計算して、誰が見ても必ず「その人の今日」を出す。
 * サーバー側では中身を出さない（ハイドレーション不一致を避けるため）。
 */
export function SkyBand() {
  const [sky, setSky] = useState<Sky | null>(null);

  useEffect(() => {
    setSky(getSky());
    // 日付が変わったら更新する
    const t = setInterval(() => setSky(getSky()), 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    // 固定ナビ(h-68px)の下に置く。ナビは半透明なので、その裏にこの帯の
    // 濃い地を敷かないよう mt で逃がす。
    <div
      className="w-full mt-[68px]"
      style={{ background: "linear-gradient(90deg,#241A3C 0%,#3A2A57 50%,#241A3C 100%)" }}
    >
      <div
        className="mx-auto max-w-[1200px] px-5 [@media(min-width:900px)]:px-12 py-[9px] flex items-center justify-center [@media(min-width:900px)]:justify-start gap-x-5 gap-y-1 flex-wrap font-round text-[0.76rem] [@media(min-width:900px)]:text-[0.8rem] min-h-[38px]"
        style={{ color: "rgba(255,243,220,0.82)" }}
        aria-live="polite"
      >
        {!sky ? (
          <span style={{ color: "rgba(255,243,220,0.35)" }}>今日の空を読んでいます…</span>
        ) : (
          <>
            <span className="inline-flex items-center gap-[6px]">
              <span aria-hidden="true">{sky.moonEmoji}</span>
              <b style={{ color: "#F3D9A4" }}>{sky.moonName}</b>
              <span style={{ opacity: 0.55 }}>月齢{sky.moonAge}</span>
            </span>

            <span aria-hidden="true" style={{ opacity: 0.28 }}>|</span>

            <span className="inline-flex items-center gap-[6px]">
              <b style={{ color: "#F3D9A4" }}>{sky.sekki}</b>
              <span style={{ opacity: 0.55 }}>{sky.kouLabel}</span>
              <span>
                {sky.kou}
                <span style={{ opacity: 0.5 }}>（{sky.kouReading}）</span>
              </span>
            </span>

            {sky.mercuryRetrograde !== null && (
              <>
                <span aria-hidden="true" style={{ opacity: 0.28 }}>|</span>
                <span className="inline-flex items-center gap-[6px]">
                  水星
                  <b style={{ color: sky.mercuryRetrograde ? "#F0A9AF" : "#9FCF9A" }}>
                    {sky.mercuryRetrograde ? "逆行" : "順行"}
                  </b>
                </span>
              </>
            )}

            {sky.ichiryu && (
              <>
                <span aria-hidden="true" style={{ opacity: 0.28 }}>|</span>
                <span
                  className="inline-flex items-center gap-1 px-[10px] py-[2px] rounded-full font-bold"
                  style={{
                    background: "linear-gradient(90deg,#D4A574,#E8B87A)",
                    color: "#241A3C",
                    fontSize: "0.72rem",
                  }}
                >
                  一粒万倍日
                </span>
              </>
            )}

            <span
              className="[@media(min-width:900px)]:ml-auto"
              style={{ opacity: 0.5 }}
            >
              {sky.dateLabel}（{sky.weekday}）・{sky.eto}の日
            </span>
          </>
        )}
      </div>
    </div>
  );
}
