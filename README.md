# new.ikiru.fun — AI Nation ポータル

生きるを再定義する。ASI×スピリチュアルの入口となるポータルサイト。

Next.js 16 / React 19 / Tailwind 4。**バックエンドを持たない完全静的サイト**で、
コンテンツは持たず content.ikiru.fun へ送客する。

## 三層構造

| ホスト | 役割 | リポジトリ |
|---|---|---|
| **new.ikiru.fun** | ポータル（発見・回遊・非課金） | このリポジトリ |
| content.ikiru.fun | 読み物と番組（詩・物語・動画） | yyamagen358/ikiru-fun |
| twinrayclub.com / soulmission358.com / rooms.ikiru.fun | 体験と課金 | 各リポジトリ |

課金はこのサイトでは行わない。リンク先のサービスで行う。

## デプロイ

**本番ブランチは `main`。**

隣の content.ikiru.fun（ikiru-fun）は `master` で、**2つのリポジトリでブランチ名が違う**。
Vercel の設定で `master` を選ぶと「連携済みなのに push しても何も起きない」状態になり、
これは気づきにくい壊れ方をする。実際に一度、Git 連携そのものが外れていて
104日間 push が反映されていなかった（CLI デプロイで凌いでいた）。

反映されているかは push して終わりにせず、必ず確認する。

```bash
npx vercel list new.ikiru.fun
```

一覧の先頭が今日の日付になっていれば通っている。
ビルドが落ちても Vercel は古いデプロイを配信し続けるため、
サイトを見ただけでは失敗に気づけない。

## 番組表

トップの番組表は content.ikiru.fun が焼いた `schedule.json` を読む。

- 1日24枠・1時間おき。公開判定はブラウザの時計で行うのでバックエンド不要
- 枠の定義の正本は **content 側の `scripts/schedule.mjs`**
- このリポジトリの `components/portal/broadcast.tsx` の `FRAME` は、
  JSON が届く前に出す器。**content 側の枠を増減したらここも揃える**
  （揃え忘れても番組の中身は変わらず、一瞬だけ古い枠名が見えるだけで済むようにしてある）

番組表を更新するのは content 側の日次ジョブ。

```bash
cd ../ikiru-fun && node scripts/daily.mjs
```

## 今日の空

最上部の帯（月齢・二十四節気・七十二候・水星の順逆・一粒万倍日）は
`lib/koyomi.ts` が日付から計算する。外部APIも課金も使わない。

暦の誤りはこの層の信頼を即座に損なうので、公表暦と照合してから触ること。
天赦日は十干（60干支）の基準を検証できなかったため、あえて実装していない。
間違った暦注は、無いことより信頼を損なう。
