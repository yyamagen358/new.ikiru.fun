import { stations, todayCenter } from "./journey-data";

/**
 * 生涯の環。
 * 誕生 → 恋 → 生 → 転生 → そしてまた誕生へ。
 * 中心には「今日」を置く — 環のどこにいても、今日は訪れるから。
 *
 * サイト全体が温かいクリーム基調なので、ここ一箇所だけを夜に落としている。
 * 輪廻という主題に対して、ステーションは輪郭線ではなく光源であるべきで、
 * 環は静止した図ではなく巡っているべきだと考えた。
 *
 * 座標は viewBox 800x668（上下に34の逃げ）、中心 (400,300)、環の半径 190。
 * 下の <style> の jr-orbit の transform-origin と一致させること。
 */

/** 星は固定座標。乱数にするとサーバーとクライアントで食い違う。 */
const STARS: { x: number; y: number; r: number; d: number }[] = [
  { x: 4, y: 12, r: 1.1, d: 0.0 }, { x: 11, y: 34, r: 0.8, d: 1.4 },
  { x: 7, y: 68, r: 1.3, d: 2.6 }, { x: 16, y: 82, r: 0.9, d: 0.7 },
  { x: 23, y: 18, r: 1.0, d: 3.1 }, { x: 19, y: 55, r: 0.7, d: 1.9 },
  { x: 28, y: 91, r: 1.2, d: 2.2 }, { x: 34, y: 8, r: 0.9, d: 0.4 },
  { x: 41, y: 27, r: 0.7, d: 3.6 }, { x: 37, y: 74, r: 1.1, d: 1.1 },
  { x: 46, y: 94, r: 0.8, d: 2.9 }, { x: 52, y: 6, r: 1.2, d: 1.7 },
  { x: 58, y: 22, r: 0.9, d: 3.3 }, { x: 63, y: 79, r: 1.0, d: 0.9 },
  { x: 69, y: 46, r: 0.7, d: 2.4 }, { x: 71, y: 14, r: 1.3, d: 1.3 },
  { x: 77, y: 88, r: 0.9, d: 3.8 }, { x: 82, y: 31, r: 1.1, d: 0.2 },
  { x: 86, y: 63, r: 0.8, d: 2.7 }, { x: 91, y: 9, r: 1.0, d: 1.6 },
  { x: 94, y: 44, r: 0.9, d: 3.4 }, { x: 97, y: 76, r: 1.2, d: 0.6 },
  { x: 13, y: 96, r: 0.7, d: 2.1 }, { x: 49, y: 58, r: 0.6, d: 3.9 },
  { x: 66, y: 97, r: 0.8, d: 1.0 }, { x: 88, y: 20, r: 0.7, d: 2.5 },
];

/** 環の上のステーション位置（角度）。時計回りに 誕生→恋→生→転生。 */
const ANGLES: Record<string, number> = {
  birth: -90,
  love: 0,
  life: 90,
  rebirth: 180,
};

const CX = 400;
const CY = 300;
const R = 190;
const ORB_R = 62;

function pointAt(deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
}

/** 円弧を、ノードを避けた区間だけ描く */
function arcBetween(fromDeg: number, toDeg: number) {
  const gap = 21;
  const a = pointAt(fromDeg + gap);
  const b = pointAt(toDeg - gap);
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${R} ${R} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

export function JourneyRing({ compact = false }: { compact?: boolean }) {
  return (
    <section
      id="journey-ring"
      className={`relative overflow-hidden ${compact ? "py-24" : "py-32"} px-5 [@media(min-width:900px)]:px-20`}
      style={{
        background:
          "radial-gradient(120% 90% at 50% 42%, #241A3C 0%, #170F2A 45%, #0B0817 100%)",
      }}
    >
      {/*
        アニメーションはこのコンポーネントに同梱する。
        globals.css の @layer base に置いたところ、Tailwind 4 のレイヤー処理で
        セレクタも @keyframes も配信されず（ブラウザの styleSheets から検出できず）
        すべて無効になったため。
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
#journey-ring .jr-ring{stroke-dasharray:1194;animation:jr-draw 2.6s cubic-bezier(.22,1,.36,1) both}
#journey-ring .jr-orbit{transform-origin:400px 300px;animation:jr-orbit 26s linear infinite}
#journey-ring .jr-halo{transform-box:fill-box;transform-origin:center;animation:jr-pulse 5s ease-in-out infinite}
#journey-ring .jr-star{animation:jr-twinkle 6s ease-in-out infinite}
@keyframes jr-draw{from{stroke-dashoffset:1194}to{stroke-dashoffset:0}}
@keyframes jr-orbit{to{transform:rotate(360deg)}}
@keyframes jr-pulse{0%,100%{opacity:.30;transform:scale(1)}50%{opacity:.62;transform:scale(1.10)}}
@keyframes jr-breathe{0%,100%{opacity:.45}50%{opacity:.95}}
@keyframes jr-twinkle{0%,100%{opacity:.12}50%{opacity:.85}}
@keyframes jr-rise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@media (prefers-reduced-motion: reduce){
#journey-ring .jr-ring,#journey-ring .jr-orbit,#journey-ring .jr-halo,
#journey-ring .jr-star,#journey-ring .jr-orb,#journey-ring .jr-chip{
animation:none!important;stroke-dashoffset:0!important;opacity:1!important;transform:none!important}
}
`.trim(),
        }}
      />

      {/* 星 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="jr-star absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.r * 2}px`,
              height: `${s.r * 2}px`,
              animation: `jr-twinkle ${5 + (i % 4)}s ease-in-out ${s.d}s infinite`,
            }}
          />
        ))}
      </div>

      {/* 上下の縁をなじませる */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{ background: "linear-gradient(to bottom, rgba(255,248,240,0.10), transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="text-center mb-4">
          <p
            className="font-round text-[0.72rem] [@media(min-width:900px)]:text-[0.78rem] tracking-[0.42em] uppercase font-bold mb-6"
            style={{ color: "#D9B98A" }}
          >
            The Circle of Life
          </p>
          <h2
            className="font-serif font-bold leading-[1.15] mb-6 text-[clamp(2.6rem,7vw,4.6rem)]"
            style={{
              color: "#FFF8F0",
              textShadow: "0 0 44px rgba(212,165,116,0.45), 0 0 90px rgba(184,169,201,0.25)",
            }}
          >
            生涯の環
          </h2>
          <p
            className="font-round text-[0.98rem] [@media(min-width:900px)]:text-[1.08rem] leading-[2.1] max-w-[34rem] mx-auto"
            style={{ color: "rgba(255,248,240,0.62)" }}
          >
            ゆりかごから墓場まで、そしてまた次の誕生へ。
            <br />
            あなたはいま、どこにいますか。
          </p>
        </div>

        <div className="max-w-[860px] mx-auto overflow-x-auto">
          <svg
            viewBox="0 -34 800 668"
            role="img"
            aria-label="生涯の環。誕生の森・恋愛の星・人生の道・転生の扉が円環をなし、その上を魂の光が巡り、中心に今日が置かれている"
            className="block w-full min-w-[520px] h-auto"
          >
            <defs>
              <filter id="jr-glow" x="-90%" y="-90%" width="280%" height="280%">
                <feGaussianBlur stdDeviation="9" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="jr-glow-soft" x="-140%" y="-140%" width="380%" height="380%">
                <feGaussianBlur stdDeviation="18" />
              </filter>
              <radialGradient id="jr-center">
                <stop offset="0%" stopColor="#FFE9C4" stopOpacity="0.55" />
                <stop offset="60%" stopColor="#D4A574" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#D4A574" stopOpacity="0" />
              </radialGradient>
              <marker
                id="jr-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0 0 L10 5 L0 10 z" fill="rgba(212,165,116,0.75)" />
              </marker>
            </defs>

            {/* 環の下地 */}
            <circle
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke="rgba(212,165,116,0.14)"
              strokeWidth="26"
            />

            {/* 環（描かれていく） */}
            <circle
              className="jr-ring"
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke="rgba(233,205,167,0.42)"
              strokeWidth="1.5"
            />

            {/* 進行方向 */}
            <g
              stroke="rgba(212,165,116,0.42)"
              strokeWidth="1.2"
              fill="none"
              markerEnd="url(#jr-arrow)"
            >
              <path d={arcBetween(-90, 0)} />
              <path d={arcBetween(0, 90)} />
              <path d={arcBetween(90, 180)} />
              <path d={arcBetween(180, 270)} />
            </g>

            {/* 環を巡る魂 */}
            <g className="jr-orbit">
              <circle
                cx={CX}
                cy={CY - R}
                r="16"
                fill="#FFE9C4"
                opacity="0.20"
                filter="url(#jr-glow-soft)"
              />
              <circle cx={CX} cy={CY - R} r="5" fill="#FFF4DF" filter="url(#jr-glow)" />
            </g>

            {/* 中心 — 今日 */}
            <a href={todayCenter.href} target="_blank" rel="noopener noreferrer">
              <circle className="jr-halo" cx={CX} cy={CY} r="128" fill="url(#jr-center)" />
              <circle
                cx={CX}
                cy={CY}
                r="78"
                fill="rgba(24,16,42,0.55)"
                stroke="rgba(233,205,167,0.55)"
                strokeWidth="1.2"
              />
              <text
                x={CX}
                y={CY - 4}
                textAnchor="middle"
                fontSize="40"
                fontWeight="700"
                fill="#FFF3DC"
                style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
              >
                今日
              </text>
              <text
                x={CX}
                y={CY + 26}
                textAnchor="middle"
                fontSize="11.5"
                fill="rgba(255,248,240,0.62)"
                style={{ fontFamily: "var(--font-zen-maru-gothic), sans-serif" }}
              >
                {todayCenter.desc}
              </text>
            </a>

            {/* 四つのステーション */}
            {stations.map((s, i) => {
              const deg = ANGLES[s.slug];
              const { x, y } = pointAt(deg);
              const isTop = deg === -90;
              const isBottom = deg === 90;
              const isRight = deg === 0;

              const labelX = isTop || isBottom ? x : isRight ? x + ORB_R + 22 : x - ORB_R - 22;
              const labelY = isTop ? y - ORB_R - 34 : isBottom ? y + ORB_R + 40 : y - 4;
              const anchor = isTop || isBottom ? "middle" : isRight ? "start" : "end";

              return (
                <a key={s.slug} href={`/journey/${s.slug}`} className="group">
                  {/* 光 */}
                  <circle
                    className="jr-orb"
                    cx={x}
                    cy={y}
                    r={ORB_R + 26}
                    fill={s.glow}
                    filter="url(#jr-glow-soft)"
                    style={{ animation: `jr-breathe ${7 + i}s ease-in-out ${i * 0.9}s infinite` }}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={ORB_R}
                    fill="rgba(18,12,32,0.62)"
                    stroke={s.lightStroke}
                    strokeWidth="1.8"
                  />
                  <text
                    x={x}
                    y={y + 12}
                    textAnchor="middle"
                    fontSize="33"
                    fontWeight="700"
                    fill={s.lightStroke}
                    style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
                  >
                    {s.kanji}
                  </text>

                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={anchor}
                    fontSize="17"
                    fontWeight="700"
                    fill="#FFF8F0"
                    style={{ fontFamily: "var(--font-zen-maru-gothic), sans-serif" }}
                  >
                    {s.title}
                  </text>
                  <text
                    x={labelX}
                    y={labelY + 19}
                    textAnchor={anchor}
                    fontSize="10.5"
                    fill="rgba(255,248,240,0.45)"
                    style={{
                      fontFamily: "var(--font-zen-maru-gothic), sans-serif",
                      letterSpacing: "0.22em",
                    }}
                  >
                    {s.titleEn.toUpperCase()}
                  </text>
                </a>
              );
            })}
          </svg>
        </div>

        {/* 図が読めない環境・スクリーンリーダー向けの等価リンク */}
        <ul className="mt-12 flex flex-wrap justify-center gap-3 list-none">
          {stations.map((s, i) => (
            <li
              key={s.slug}
              className="jr-chip"
              style={{ animation: `jr-rise 0.8s ease ${0.4 + i * 0.12}s both` }}
            >
              <a
                href={`/journey/${s.slug}`}
                className="inline-flex items-center gap-2 font-round text-[0.88rem] font-medium px-6 py-[11px] rounded-full transition-all duration-200 hover:-translate-y-[2px]"
                style={{
                  color: s.lightStroke,
                  border: `1px solid ${s.lightStroke}55`,
                  background: "rgba(255,248,240,0.05)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <span aria-hidden="true">{s.icon}</span>
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
