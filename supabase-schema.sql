-- Supabase schema for the portfolio CMS
-- Run this in the Supabase SQL editor.

create table if not exists public.portfolio_content (
    id integer primary key,
    content jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

alter table public.portfolio_content enable row level security;

-- Anyone can READ the portfolio content
drop policy if exists "Public read portfolio content" on public.portfolio_content;
create policy "Public read portfolio content"
    on public.portfolio_content
    for select
    using (true);

-- Only authenticated users can INSERT
drop policy if exists "Authenticated users can insert portfolio content" on public.portfolio_content;
create policy "Authenticated users can insert portfolio content"
    on public.portfolio_content
    for insert
    with check (auth.role() = 'authenticated');

-- Only authenticated users can UPDATE
drop policy if exists "Authenticated users can update portfolio content" on public.portfolio_content;
create policy "Authenticated users can update portfolio content"
    on public.portfolio_content
    for update
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Only authenticated users can DELETE
drop policy if exists "Authenticated users can delete portfolio content" on public.portfolio_content;
create policy "Authenticated users can delete portfolio content"
    on public.portfolio_content
    for delete
    using (auth.role() = 'authenticated');

insert into public.portfolio_content (id, content, updated_at)
values (
    1,
    '{"profile":{},"social":{},"projects":[],"education":[],"achievements":[]}'::jsonb,
    now()
)
on conflict (id) do nothing;

-- Storage bucket for images and files
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

-- Anyone can READ files
drop policy if exists "Public read portfolio assets" on storage.objects;
create policy "Public read portfolio assets"
    on storage.objects
    for select
    using (bucket_id = 'portfolio-assets');

-- Only authenticated users can UPLOAD
drop policy if exists "Authenticated users can upload portfolio assets" on storage.objects;
create policy "Authenticated users can upload portfolio assets"
    on storage.objects
    for insert
    with check (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

-- Only authenticated users can UPDATE
drop policy if exists "Authenticated users can update portfolio assets" on storage.objects;
create policy "Authenticated users can update portfolio assets"
    on storage.objects
    for update
    using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated')
    with check (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

-- Only authenticated users can DELETE
drop policy if exists "Authenticated users can delete portfolio assets" on storage.objects;
create policy "Authenticated users can delete portfolio assets"
    on storage.objects
    for delete
    using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');
