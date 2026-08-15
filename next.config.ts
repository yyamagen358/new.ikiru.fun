import type { NextConfig } from "next";

/**
 * 旧 ikiru.fun（apex）は 2026-08 末で廃止し、このプロジェクトへ寄せる。
 *
 * 単純に new.ikiru.fun のルートへ丸投げすると、外部に残っている
 * /asi や /membership のリンクが全部 404 になる。旧パスは実際の
 * 移転先へ個別に 301 する。
 *
 * ドメイン登録そのものは手放せない点に注意 —— new / content / rooms は
 * すべて ikiru.fun ゾーンの子で、登録を失うと3つとも死ぬ。
 */
const OLD_APEX_HOSTS = ["ikiru.fun", "www.ikiru.fun"] as const;

/** 旧 ikiru.fun のパス → 移転先。上から順に評価されるので、個別ルールを先に置く。 */
const MOVED: { source: string; destination: string }[] = [
  // ASI 特設ページ群は content.ikiru.fun へ移植済み
  { source: "/asi", destination: "https://content.ikiru.fun/asi" },
  {
    source: "/asi/humanoid-spiritual",
    destination: "https://content.ikiru.fun/asi/humanoid-spiritual",
  },
  {
    source: "/asi/reasoning-information",
    destination: "https://content.ikiru.fun/asi/reasoning-information",
  },
  { source: "/membership", destination: "https://content.ikiru.fun/membership" },

  // 会員限定だった4ページは「生涯の環」のステーションへ
  { source: "/birth", destination: "https://new.ikiru.fun/journey/birth" },
  { source: "/love", destination: "https://new.ikiru.fun/journey/love" },
  { source: "/life", destination: "https://new.ikiru.fun/journey/life" },
  { source: "/rebirth", destination: "https://new.ikiru.fun/journey/rebirth" },

  // 「今日」は毎日の詩へ
  { source: "/today", destination: "https://content.ikiru.fun/today/poetry" },
];

const nextConfig: NextConfig = {
  async redirects() {
    // ポータル本体は / に置いた。旧 /portal は恒久リダイレクトで受ける。
    // 配下の /portal/heal などはそのまま残すので、source は完全一致にする。
    const oldApex = OLD_APEX_HOSTS.flatMap((host) => {
      const hasOldHost = [{ type: "host" as const, value: host }];

      return [
        ...MOVED.map((r) => ({
          source: r.source,
          has: hasOldHost,
          destination: r.destination,
          permanent: true,
        })),
        // それ以外はポータルのトップへ
        {
          source: "/:path*",
          has: hasOldHost,
          destination: "https://new.ikiru.fun/",
          permanent: true,
        },
      ];
    });

    return [
      { source: "/portal", destination: "/", permanent: true },
      ...oldApex,
    ];
  },
};

export default nextConfig;
