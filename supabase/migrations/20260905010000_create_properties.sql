-- 物件テーブルの作成
-- 物件名・家賃・エリア・間取りと、登録したユーザーのIDを保持する
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  name text not null,
  rent integer not null check (rent >= 0),
  area text not null,
  layout text not null,
  created_at timestamptz not null default now()
);

-- user_idでの検索を高速化するためのインデックス
create index if not exists properties_user_id_idx on public.properties (user_id);

-- Row Level Security（行単位のアクセス制御）を有効化
alter table public.properties enable row level security;

-- 自分が登録した物件のみ閲覧できる
create policy "Users can select their own properties"
  on public.properties
  for select
  using (auth.uid() = user_id);

-- 自分のユーザーIDでのみ新規登録できる
create policy "Users can insert their own properties"
  on public.properties
  for insert
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ更新できる
create policy "Users can update their own properties"
  on public.properties
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ削除できる
create policy "Users can delete their own properties"
  on public.properties
  for delete
  using (auth.uid() = user_id);
