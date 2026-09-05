-- 天空の呼びかけ — 自己申告されたソウルナンバー
--
-- 診断（soulmission358）で出た番号を、本人が1タップで伝えてくれたもの。
-- 診断側は個人を持たない設計なので、番号と人を結びつけられるのはここだけ。
--
-- Supabase の SQL Editor で1回だけ実行する。

create table if not exists public.yobikake_numbers (
  contact_id   text        primary key,      -- Resend の contact id。1人1行、言い直せる
  email        text        not null,
  soul_number  integer     not null,
  is_master    boolean     not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists yobikake_numbers_soul_idx
  on public.yobikake_numbers (soul_number);

-- 内観の記録と同じ扱い。匿名キーからは一切触れさせない。
alter table public.yobikake_numbers enable row level security;
