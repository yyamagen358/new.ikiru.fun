import { stations, todayCenter } from "./journey-data";

/**
 * 生涯の環。
 * 誕生 → 恋 → 生 → 転生 → そしてまた誕生へ。
 * 中心には「今日」を置く — 環のどこにいても、今日は訪れるから。
 */
export function JourneyRing({ compact = false }: { compact?: boolean }) {
  return (
    <section
      id="journey-ring"
      className={`portal-animate-in relative overflow-hidden bg-portal-cream ${
        compact ? "py-16" : "py-24"
      } px-5 [@media(min-width:900px)]:px-20`}
    >
      <div className="text-center mb-12">
        <p className="font-round text-xs tracking-[0.35em] uppercase font-bold text-portal-amber-deep mb-4">
          The Circle of Life
        </p>
        <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] font-semibold text-portal-text-dark mb-4">
          生涯の環
        </h2>
        <p className="font-round text-base text-portal-text-soft max-w-[34rem] mx-auto leading-relaxed">
          ゆりかごから墓場まで、そしてまた次の誕生へ。
          <br className="hidden md:block" />
          あなたはいま、どこにいますか。
        </p>
      </div>

      <div className="max-w-[760px] mx-auto overflow-x-auto">
        <svg
          viewBox="0 0 720 524"
          role="img"
          aria-label="生涯の環。誕生の森・恋愛の星・人生の道・転生の扉が円環をなし、中心に今日が置かれている"
          className="block w-full min-w-[460px] h-auto"
        >
          <defs>
            <marker
              id="journey-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 z" fill="var(--portal-text-muted)" />
            </marker>
          </defs>

          <circle
            cx="360"
            cy="250"
            r="175"
            fill="none"
            stroke="var(--portal-amber)"
            strokeWidth="1"
            strokeDasharray="3 7"
            opacity="0.5"
          />

          <g
            stroke="var(--portal-text-muted)"
            strokeWidth="1.4"
            fill="none"
            markerEnd="url(#journey-arrow)"
          >
            <path d="M419.9 85.6 A175 175 0 0 1 524.4 190.1" />
            <path d="M524.4 309.9 A175 175 0 0 1 419.9 414.4" />
            <path d="M300.1 414.4 A175 175 0 0 1 195.6 309.9" />
            <path d="M195.6 190.1 A175 175 0 0 1 300.1 85.6" />
          </g>

          {/* 中心 — 今日 */}
          <a href={todayCenter.href} target="_blank" rel="noopener noreferrer">
            <circle
              cx="360"
              cy="250"
              r="66"
              fill="var(--portal-cream-deep)"
              stroke="var(--portal-amber-deep)"
              strokeWidth="1.5"
            />
            <text
              x="360"
              y="243"
              textAnchor="middle"
              fontSize="25"
              fontWeight="700"
              fill="var(--portal-amber-deep)"
              style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
            >
              今日
            </text>
            <text
              x="360"
              y="270"
              textAnchor="middle"
              fontSize="10.5"
              fill="var(--portal-text-mid)"
              style={{ fontFamily: "var(--font-zen-maru-gothic), sans-serif" }}
            >
              {todayCenter.desc}
            </text>
          </a>

          {/* 4つのステーション */}
          {stations.map((s) => {
            const isTop = s.cy < 150;
            const isBottom = s.cy > 350;
            const isRight = s.cx > 450;
            const labelX = isTop || isBottom ? s.cx : isRight ? s.cx + 66 : s.cx - 66;
            const labelY = isTop ? 22 : isBottom ? 496 : s.cy - 4;
            const anchor = isTop || isBottom ? "middle" : isRight ? "start" : "end";

            return (
              <a key={s.slug} href={`/journey/${s.slug}`} className="group">
                <circle
                  cx={s.cx}
                  cy={s.cy}
                  r="48"
                  fill="var(--portal-cream)"
                  stroke={s.stroke}
                  strokeWidth="2"
                  className="transition-opacity duration-200 group-hover:opacity-80"
                />
                <text
                  x={s.cx}
                  y={s.cy + 9}
                  textAnchor="middle"
                  fontSize="24"
                  fontWeight="700"
                  fill={s.stroke}
                  style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
                >
                  {s.kanji}
                </text>
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={anchor}
                  fontSize="14.5"
                  fontWeight="700"
                  fill="var(--portal-text-dark)"
                  style={{ fontFamily: "var(--font-zen-maru-gothic), sans-serif" }}
                >
                  {s.title}
                </text>
                <text
                  x={labelX}
                  y={labelY + 17}
                  textAnchor={anchor}
                  fontSize="10"
                  fill="var(--portal-text-soft)"
                  style={{ fontFamily: "var(--font-zen-maru-gothic), sans-serif", letterSpacing: "0.12em" }}
                >
                  {s.titleEn.toUpperCase()}
                </text>
              </a>
            );
          })}
        </svg>
      </div>

      {/* 図が読めない環境・スクリーンリーダー向けの等価リンク */}
      <ul className="mt-10 flex flex-wrap justify-center gap-3 list-none">
        {stations.map((s) => (
          <li key={s.slug}>
            <a
              href={`/journey/${s.slug}`}
              className={`inline-flex items-center gap-2 font-round text-[0.85rem] font-medium px-5 py-[10px] rounded-full border-[1.5px] ${s.cardBorder} ${s.accentText} bg-white/60 transition-all duration-200 hover:-translate-y-[2px] hover:bg-white`}
            >
              <span aria-hidden="true">{s.icon}</span>
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
