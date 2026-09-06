-- 天空の呼びかけ — LPの通過を記録する
--
-- 動画1本ごとに ?q=NNN を振ってあるので、
-- 「どの問いの動画から来て、どこまで進んだか」が問いごとに分かる。
--
-- 個人は持たない。誰が来たかではなく、何人が進んだかだけを数える。
--   記録する    : 段階 / 問いのID / 流入元 / リファラ / 日時
--   記録しない  : メールアドレス・回答本文・IP
--
-- Supabase の SQL Editor で1回だけ実行する。

create table if not exists public.yobikake_funnel (
  id          bigserial   primary key,
  -- visit  = LPに着いた
  -- wrote  = 3問書き終えた（メール入力の画面まで来た）
  -- signup = メールを登録した
  stage       text        not null check (stage in ('visit','wrote','signup')),
  question_id text,                                  -- 動画1本に対応する問い
  source      text        not null default 'direct', -- tiktok / youtube / x / instagram など
  referrer    text,
  created_at  timestamptz not null default now()
);

create index if not exists yobikake_funnel_created_idx
  on public.yobikake_funnel (created_at desc);

create index if not exists yobikake_funnel_stage_idx
  on public.yobikake_funnel (stage, question_id);

alter table public.yobikake_funnel enable row level security;
