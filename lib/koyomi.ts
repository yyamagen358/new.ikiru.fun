/**
 * 「今日の空」— 月齢・二十四節気・七十二候・一粒万倍日・水星逆行。
 *
 * すべて日付からの計算で出す（外部API・課金なし）。ただし水星逆行だけは
 * 軌道計算が重すぎるので公表値の表を持つ。表の範囲外は「出さない」。
 * この層は暦の誤りに敏感なので、自信の持てないものは表示しないほうがよい。
 *
 * 天赦日は十干（60干支）の基準日を検証できなかったため、あえて実装していない。
 * 間違った暦注は、無いことより信頼を損なう。
 */

export type Sky = {
  /** JST の日付 */
  dateLabel: string;
  weekday: string;
  /** 月齢（0〜29.5） */
  moonAge: number;
  moonName: string;
  moonEmoji: string;
  /** 二十四節気 */
  sekki: string;
  sekkiReading: string;
  /** 七十二候 */
  kou: string;
  kouReading: string;
  kouIndex: 0 | 1 | 2;
  kouLabel: "初候" | "次候" | "末候";
  /** 暦注 */
  ichiryu: boolean;
  eto: string;
  /** 水星。表の範囲外なら null（不明なものは出さない） */
  mercuryRetrograde: boolean | null;
};

/* ------------------------------------------------------------------ */
/* 二十四節気（立春=太陽黄経315°から15°ずつ）                          */
/* ------------------------------------------------------------------ */

const SEKKI: [string, string][] = [
  ["立春", "りっしゅん"], ["雨水", "うすい"], ["啓蟄", "けいちつ"], ["春分", "しゅんぶん"],
  ["清明", "せいめい"], ["穀雨", "こくう"], ["立夏", "りっか"], ["小満", "しょうまん"],
  ["芒種", "ぼうしゅ"], ["夏至", "げし"], ["小暑", "しょうしょ"], ["大暑", "たいしょ"],
  ["立秋", "りっしゅう"], ["処暑", "しょしょ"], ["白露", "はくろ"], ["秋分", "しゅうぶん"],
  ["寒露", "かんろ"], ["霜降", "そうこう"], ["立冬", "りっとう"], ["小雪", "しょうせつ"],
  ["大雪", "たいせつ"], ["冬至", "とうじ"], ["小寒", "しょうかん"], ["大寒", "だいかん"],
];

/** 七十二候。節気ごとに 初候・次候・末候 の3つ。 */
const KOU: [string, string][][] = [
  [["東風解凍", "はるかぜこおりをとく"], ["黄鶯睍睆", "うぐいすなく"], ["魚上氷", "うおこおりをいずる"]],
  [["土脉潤起", "つちのしょううるおいおこる"], ["霞始靆", "かすみはじめてたなびく"], ["草木萌動", "そうもくめばえいずる"]],
  [["蟄虫啓戸", "すごもりむしとをひらく"], ["桃始笑", "ももはじめてさく"], ["菜虫化蝶", "なむしちょうとなる"]],
  [["雀始巣", "すずめはじめてすくう"], ["桜始開", "さくらはじめてひらく"], ["雷乃発声", "かみなりすなわちこえをはっす"]],
  [["玄鳥至", "つばめきたる"], ["鴻雁北", "こうがんかえる"], ["虹始見", "にじはじめてあらわる"]],
  [["葭始生", "あしはじめてしょうず"], ["霜止出苗", "しもやんでなえいずる"], ["牡丹華", "ぼたんはなさく"]],
  [["蛙始鳴", "かわずはじめてなく"], ["蚯蚓出", "みみずいずる"], ["竹笋生", "たけのこしょうず"]],
  [["蚕起食桑", "かいこおきてくわをはむ"], ["紅花栄", "べにばなさかう"], ["麦秋至", "むぎのときいたる"]],
  [["螳螂生", "かまきりしょうず"], ["腐草為蛍", "くされたるくさほたるとなる"], ["梅子黄", "うめのみきばむ"]],
  [["乃東枯", "なつかれくさかるる"], ["菖蒲華", "あやめはなさく"], ["半夏生", "はんげしょうず"]],
  [["温風至", "あつかぜいたる"], ["蓮始開", "はすはじめてひらく"], ["鷹乃学習", "たかすなわちわざをならう"]],
  [["桐始結花", "きりはじめてはなをむすぶ"], ["土潤溽暑", "つちうるおうてむしあつし"], ["大雨時行", "たいうときどきふる"]],
  [["涼風至", "すずかぜいたる"], ["寒蝉鳴", "ひぐらしなく"], ["蒙霧升降", "ふかききりまとう"]],
  [["綿柎開", "わたのはなしべひらく"], ["天地始粛", "てんちはじめてさむし"], ["禾乃登", "こくものすなわちみのる"]],
  [["草露白", "くさのつゆしろし"], ["鶺鴒鳴", "せきれいなく"], ["玄鳥去", "つばめさる"]],
  [["雷乃収声", "かみなりすなわちこえをおさむ"], ["蟄虫坏戸", "むしかくれてとをふさぐ"], ["水始涸", "みずはじめてかるる"]],
  [["鴻雁来", "こうがんきたる"], ["菊花開", "きくのはなひらく"], ["蟋蟀在戸", "きりぎりすとにあり"]],
  [["霜始降", "しもはじめてふる"], ["霎時施", "こさめときどきふる"], ["楓蔦黄", "もみじつたきばむ"]],
  [["山茶始開", "つばきはじめてひらく"], ["地始凍", "ちはじめてこおる"], ["金盞香", "きんせんかさく"]],
  [["虹蔵不見", "にじかくれてみえず"], ["朔風払葉", "きたかぜこのはをはらう"], ["橘始黄", "たちばなはじめてきばむ"]],
  [["閉塞成冬", "そらさむくふゆとなる"], ["熊蟄穴", "くまあなにこもる"], ["鱖魚群", "さけのうおむらがる"]],
  [["乃東生", "なつかれくさしょうず"], ["麋角解", "さわしかのつのおつる"], ["雪下出麦", "ゆきわたりてむぎのびる"]],
  [["芹乃栄", "せりすなわちさかう"], ["水泉動", "しみずあたたかをふくむ"], ["雉始雊", "きじはじめてなく"]],
  [["款冬華", "ふきのはなさく"], ["水沢腹堅", "さわみずこおりつめる"], ["鶏始乳", "にわとりはじめてとやにつく"]],
];

/** 太陽黄経（度）。低精度近似で誤差 0.01 度程度 = 時刻にして十数分。日単位の判定には十分。 */
function solarLongitude(utcMs: number): number {
  const n = (utcMs - Date.UTC(2000, 0, 1, 12)) / 86400000;
  const L = 280.46 + 0.9856474 * n;
  const g = ((357.528 + 0.9856003 * n) * Math.PI) / 180;
  const lambda = L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g);
  return ((lambda % 360) + 360) % 360;
}

/** 立春を 0 とした節気の番号（0〜23） */
function sekkiIndex(utcMs: number): number {
  const lam = solarLongitude(utcMs);
  return Math.floor((((lam - 315) % 360) + 360) % 360 / 15);
}

/* ------------------------------------------------------------------ */
/* 月齢                                                                */
/* ------------------------------------------------------------------ */

const SYNODIC = 29.530588853;
/** 基準の新月: 2000-01-06 18:14 UTC */
const NEW_MOON_EPOCH = Date.UTC(2000, 0, 6, 18, 14);

function moonAge(utcMs: number): number {
  const days = (utcMs - NEW_MOON_EPOCH) / 86400000;
  return ((days % SYNODIC) + SYNODIC) % SYNODIC;
}

function moonLabel(age: number): { name: string; emoji: string } {
  if (age < 1.0) return { name: "新月", emoji: "🌑" };
  if (age < 2.5) return { name: "繊月", emoji: "🌒" };
  if (age < 4.0) return { name: "三日月", emoji: "🌒" };
  if (age < 6.5) return { name: "上弦へ", emoji: "🌒" };
  if (age < 8.5) return { name: "上弦の月", emoji: "🌓" };
  if (age < 12.0) return { name: "十日夜", emoji: "🌔" };
  if (age < 13.5) return { name: "十三夜", emoji: "🌔" };
  if (age < 14.2) return { name: "小望月", emoji: "🌔" };
  if (age < 15.5) return { name: "満月", emoji: "🌕" };
  if (age < 16.5) return { name: "十六夜", emoji: "🌕" };
  if (age < 17.5) return { name: "立待月", emoji: "🌖" };
  if (age < 18.5) return { name: "居待月", emoji: "🌖" };
  if (age < 19.5) return { name: "寝待月", emoji: "🌖" };
  if (age < 21.0) return { name: "更待月", emoji: "🌖" };
  if (age < 23.5) return { name: "下弦の月", emoji: "🌗" };
  if (age < 27.0) return { name: "有明月", emoji: "🌘" };
  return { name: "晦の月", emoji: "🌘" };
}

/* ------------------------------------------------------------------ */
/* 干支と一粒万倍日                                                    */
/* ------------------------------------------------------------------ */

const ETO12 = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

/**
 * 日の十二支。
 * 基準: 2026-08-13 は「未」。公表されている2026年8月の一粒万倍日
 * （3・13・18・25・30日）が節月×十二支の規則と完全に一致することから確定した。
 */
const ETO_ANCHOR_DAYNUM = Math.floor(Date.UTC(2026, 7, 13) / 86400000);
const ETO_ANCHOR_INDEX = 7; // 未

function etoIndex(jstDayNum: number): number {
  return (((jstDayNum - ETO_ANCHOR_DAYNUM + ETO_ANCHOR_INDEX) % 12) + 12) % 12;
}

/**
 * 節月ごとの一粒万倍日にあたる十二支。
 * 節月は「節」（立春・啓蟄・清明…）で区切る。SEKKI の偶数番号が節にあたる。
 */
const ICHIRYU_BY_SETSUGETSU: number[][] = [
  [1, 6],   // 立春〜: 丑・午
  [9, 2],   // 啓蟄〜: 酉・寅
  [0, 3],   // 清明〜: 子・卯
  [3, 4],   // 立夏〜: 卯・辰
  [5, 6],   // 芒種〜: 巳・午
  [9, 6],   // 小暑〜: 酉・午
  [0, 7],   // 立秋〜: 子・未
  [3, 8],   // 白露〜: 卯・申
  [6, 9],   // 寒露〜: 午・酉
  [9, 10],  // 立冬〜: 酉・戌
  [11, 0],  // 大雪〜: 亥・子
  [3, 0],   // 小寒〜: 卯・子
];

/* ------------------------------------------------------------------ */
/* 水星逆行（公表値の表。範囲外は null を返して何も出さない）           */
/* ------------------------------------------------------------------ */

const MERCURY_RETROGRADE: [string, string][] = [
  ["2026-02-26", "2026-03-21"],
  ["2026-06-30", "2026-07-24"],
  ["2026-10-24", "2026-11-14"],
];
const MERCURY_TABLE_FROM = "2026-01-01";
const MERCURY_TABLE_TO = "2026-12-31";

/* ------------------------------------------------------------------ */

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

/** JST の「今日」を求める。引数を省略すると現在時刻。 */
export function getSky(now: Date = new Date()): Sky {
  // JST に寄せてから日付を取り出す
  const jst = new Date(now.getTime() + 9 * 3600000);
  const y = jst.getUTCFullYear();
  const m = jst.getUTCMonth();
  const d = jst.getUTCDate();
  const weekday = WEEKDAYS[jst.getUTCDay()];

  // その日の正午（JST）を代表時刻にする
  const noonUtcMs = Date.UTC(y, m, d, 3); // 12:00 JST = 03:00 UTC
  const jstDayNum = Math.floor(Date.UTC(y, m, d) / 86400000);

  // 節気
  const si = sekkiIndex(noonUtcMs);
  const [sekki, sekkiReading] = SEKKI[si];

  // 節気に入って何日目か（さかのぼって番号が変わる日を探す）
  let daysIn = 0;
  for (let back = 1; back <= 17; back++) {
    if (sekkiIndex(noonUtcMs - back * 86400000) !== si) {
      daysIn = back - 1;
      break;
    }
    daysIn = back;
  }
  const kouIndex = (daysIn >= 10 ? 2 : daysIn >= 5 ? 1 : 0) as 0 | 1 | 2;
  const [kou, kouReading] = KOU[si][kouIndex];

  // 月齢
  const age = moonAge(noonUtcMs);
  const { name: moonName, emoji: moonEmoji } = moonLabel(age);

  // 一粒万倍日: 節月（節気番号を2で割った商）と十二支
  const setsugetsu = Math.floor(si / 2);
  const eIdx = etoIndex(jstDayNum);
  const ichiryu = ICHIRYU_BY_SETSUGETSU[setsugetsu].includes(eIdx);

  // 水星
  const iso = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const inTable = iso >= MERCURY_TABLE_FROM && iso <= MERCURY_TABLE_TO;
  const mercuryRetrograde = inTable
    ? MERCURY_RETROGRADE.some(([a, b]) => iso >= a && iso <= b)
    : null;

  return {
    dateLabel: `${m + 1}月${d}日`,
    weekday,
    moonAge: Math.round(age * 10) / 10,
    moonName,
    moonEmoji,
    sekki,
    sekkiReading,
    kou,
    kouReading,
    kouIndex,
    kouLabel: (["初候", "次候", "末候"] as const)[kouIndex],
    ichiryu,
    eto: ETO12[eIdx],
    mercuryRetrograde,
  };
}
