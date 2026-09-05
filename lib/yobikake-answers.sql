-- 天空の呼びかけ — 回答の保存
--
-- cc-ally と同じ Supabase プロジェクトに同居させる。
-- 他プロダクトのテーブルと混ざらないよう yobikake_ 接頭辞をつける。
--
-- Supabase の SQL Editor で1回だけ実行する。

create table if not exists public.yobikake_answers (
  id          bigserial primary key,
  contact_id  text        not null,          -- Resend の contact id
  email       text        not null,
  day         integer     not null,          -- 0 = LPで答えた3問 / 1〜 = 毎朝の問い
  question_id text        not null,
  question    text        not null,          -- 後で問い側を差し替えても証が壊れないよう本文ごと残す
  answer      text        not null,
  source      text        not null default 'daily',   -- 'lp' | 'daily'
  created_at  timestamptz not null default now()
);

-- before/after を取り出すときは (contact_id, day) で引く
create index if not exists yobikake_answers_contact_day_idx
  on public.yobikake_answers (contact_id, day);

create index if not exists yobikake_answers_question_idx
  on public.yobikake_answers (question_id);

-- 内観の記録なので、匿名キーからは一切触れさせない。
-- RLS を有効にしてポリシーを作らなければ、service_role 以外は読み書きできない。
alter table public.yobikake_answers enable row level security;
