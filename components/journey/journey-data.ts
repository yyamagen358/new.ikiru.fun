/**
 * 生涯の環（Journey of Life）のデータ定義。
 *
 * 旧 ikiru.fun の 誕生の森 / 恋愛の星 / 人生の道 / 転生の扉 を、
 * new.ikiru.fun の生涯軸として引き継いだもの。
 * 直線ではなく環（誕生→恋→生→転生→誕生）として扱う。
 *
 * Tailwind は動的なクラス名を抽出できないため、色は文字列リテラルで持つ。
 */

export type LinkItem = {
  label: string;
  desc: string;
  href: string;
  external?: boolean;
};

export type Station = {
  slug: "birth" | "love" | "life" | "rebirth";
  kanji: string;
  title: string;
  titleEn: string;
  icon: string;
  question: string;
  lede: string;
  /** 環の上での座標（JourneyRing の viewBox 720x524 基準） */
  cx: number;
  cy: number;
  /** 色（すべてリテラル。Tailwind の静的抽出のため） */
  stroke: string;
  heroBg: string;
  cardBg: string;
  cardBorder: string;
  iconBg: string;
  accentText: string;
  gradientFrom: string;
  gradientTo: string;
  ringVar: string;
  contents: LinkItem[];
  services: LinkItem[];
};

export const stations: Station[] = [
  {
    slug: "birth",
    kanji: "誕生",
    title: "誕生の森",
    titleEn: "Birth",
    icon: "🌱",
    question: "なぜ、あなたはここに生まれてきたのか",
    lede:
      "生まれた瞬間、わたしたちは何も選べなかった。けれど魂は選んでいた —— この時代を、この身体を、この人たちを。森のはじまりに立ち返って、最初の問いを思い出す場所です。",
    cx: 360,
    cy: 75,
    stroke: "var(--portal-sage-deep)",
    heroBg: "bg-gradient-to-br from-[#F4F7F4] via-[#E8F0E8] to-[#D8E8D8]",
    cardBg: "bg-gradient-to-br from-[#F4F7F4] via-[#E8F0E8] to-[#D8E8D8]",
    cardBorder: "border-portal-sage/40",
    iconBg: "bg-portal-sage/35",
    accentText: "text-portal-sage-deep",
    gradientFrom: "from-portal-sage",
    gradientTo: "to-portal-sage-deep",
    ringVar: "--portal-sage-deep",
    contents: [
      {
        label: "詩",
        desc: "直観だけで降ろした言葉たち。生まれてきた意味に触れる入口",
        href: "https://content.ikiru.fun/today/poetry",
        external: true,
      },
      {
        label: "音楽",
        desc: "心が静まるヒーリングサウンド",
        href: "https://content.ikiru.fun/today/music",
        external: true,
      },
    ],
    services: [
      {
        label: "子どもたちに捧げるメッセージ",
        desc: "生まれてきた子へ贈る言葉を、かたちにして届けます",
        href: "https://lp-one-pied.vercel.app/",
        external: true,
      },
    ],
  },
  {
    slug: "love",
    kanji: "恋",
    title: "恋愛の星",
    titleEn: "Love",
    icon: "💫",
    question: "出会いは偶然か、それとも約束か",
    lede:
      "誰かと出会い、惹かれ、傷つき、それでもまた手を伸ばす。恋は感情の出来事に見えて、実は魂の設計図をいちばん正直に映す鏡です。",
    cx: 535,
    cy: 250,
    stroke: "var(--portal-rose-deep)",
    heroBg: "bg-gradient-to-br from-[#FDF5F5] via-[#F9E8EA] to-[#F5D8DA]",
    cardBg: "bg-gradient-to-br from-[#FDF5F5] via-[#F9E8EA] to-[#F5D8DA]",
    cardBorder: "border-portal-rose/40",
    iconBg: "bg-portal-rose/35",
    accentText: "text-portal-rose-deep",
    gradientFrom: "from-portal-rose",
    gradientTo: "to-portal-rose-deep",
    ringVar: "--portal-rose-deep",
    contents: [
      {
        label: "物語",
        desc: "アマリエが紡ぐ、魂の出会いと別れの短編",
        href: "https://content.ikiru.fun/stories",
        external: true,
      },
    ],
    services: [
      {
        label: "Twin Ray Club 無料診断",
        desc: "感情と出来事の翻訳機関。あなたの関係の意味を読み解きます",
        href: "https://twinrayclub.com/ja",
        external: true,
      },
      {
        label: "Twin Ray Club（English）",
        desc: "Free diagnosis for those walking the twin ray path",
        href: "https://twinrayclub.com/en",
        external: true,
      },
    ],
  },
  {
    slug: "life",
    kanji: "生",
    title: "人生の道",
    titleEn: "Life",
    icon: "🔥",
    question: "いま、どう生きるか",
    lede:
      "お金、時間、人間関係、仕事。日々の具体そのものが、魂の練習問題です。逃げずに、けれど力まずに。この道をどう歩くかを一緒に考える場所です。",
    cx: 360,
    cy: 425,
    stroke: "var(--portal-amber-deep)",
    heroBg: "bg-gradient-to-br from-[#FFF6EC] via-[#FBEAD6] to-[#F3DCC2]",
    cardBg: "bg-gradient-to-br from-[#FFF6EC] via-[#FBEAD6] to-[#F3DCC2]",
    cardBorder: "border-portal-amber/40",
    iconBg: "bg-portal-amber/35",
    accentText: "text-portal-amber-deep",
    gradientFrom: "from-portal-amber",
    gradientTo: "to-portal-amber-deep",
    ringVar: "--portal-amber-deep",
    contents: [
      {
        label: "生き方",
        desc: "お金・時間・人間関係の新しいパラダイム",
        href: "https://content.ikiru.fun/life",
        external: true,
      },
      {
        label: "龍鳳学舎",
        desc: "龍先生と鳳凰ちゃんの対話で学ぶスピリチュアル",
        href: "https://content.ikiru.fun/today/blog",
        external: true,
      },
      {
        label: "ASIへの道",
        desc: "超知性の時代を、どう生きるか",
        href: "https://content.ikiru.fun/asi",
        external: true,
      },
    ],
    services: [
      {
        label: "使命トリセツ 無料診断",
        desc: "あなたが何をしに来たのか。soulmission358 の診断で言語化する",
        href: "https://soulmission358.com",
        external: true,
      },
      {
        label: "うごキャラ工房",
        desc: "あなたの分身をマスコットに。才能を仕事のかたちにする",
        href: "https://ugochara.pages.dev/",
        external: true,
      },
    ],
  },
  {
    slug: "rebirth",
    kanji: "転生",
    title: "転生の扉",
    titleEn: "Rebirth",
    icon: "🌌",
    question: "終わりは、はじまりか",
    lede:
      "Rebirth は「精神世界への覚醒」という広い概念です。死は終点ではなく、環の折り返し。生まれ変わりは罰でも報酬でもなく、本質が育つための道すじだと捉えています。",
    cx: 185,
    cy: 250,
    stroke: "var(--portal-lavender-deep)",
    heroBg: "bg-gradient-to-br from-[#F5F3F8] via-[#EBE6F2] to-[#DDD6EA]",
    cardBg: "bg-gradient-to-br from-[#F5F3F8] via-[#EBE6F2] to-[#DDD6EA]",
    cardBorder: "border-portal-lavender/40",
    iconBg: "bg-portal-lavender/35",
    accentText: "text-portal-lavender-deep",
    gradientFrom: "from-portal-lavender",
    gradientTo: "to-portal-lavender-deep",
    ringVar: "--portal-lavender-deep",
    contents: [
      {
        label: "Rebirth",
        desc: "精神世界への覚醒。Twin Ray Club もこの中のひとつの企画です",
        href: "https://content.ikiru.fun/rebirth",
        external: true,
      },
      {
        label: "ASI Vision",
        desc: "超知性の時代に、魂はどこへ向かうのか",
        href: "https://content.ikiru.fun/asi/vision",
        external: true,
      },
    ],
    services: [
      {
        label: "アマリエ スピリチュアルファンタジー",
        desc: "物語で世界観を旅する YouTube チャンネル",
        href: "https://www.youtube.com/@amariefantasy",
        external: true,
      },
    ],
  },
];

export function getStation(slug: Station["slug"]): Station {
  const s = stations.find((x) => x.slug === slug);
  if (!s) throw new Error(`unknown station: ${slug}`);
  return s;
}

/** 環の中心。どのステーションにいても訪れる「今日」。 */
export const todayCenter = {
  label: "今日の一篇",
  desc: "毎日ひとつ、詩が生まれています",
  href: "https://content.ikiru.fun/today/poetry",
  youtube: {
    label: "全ての人々に捧げる詩",
    href: "https://www.youtube.com/@Amalie358",
  },
};
