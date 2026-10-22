-- Repositórios do GitHub escolhidos no painel para aparecer em destaque na home.
-- O slug é o nome do repositório em minúsculas (o mesmo da URL /projetos/<slug>).

create table public.featured_repos (
  slug text primary key check (slug ~ '^[a-z0-9._-]{1,100}$'),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.featured_repos enable row level security;

-- A home lê os destaques como visitante
create policy "todos leem os destaques"
  on public.featured_repos for select
  to anon, authenticated
  using (true);

-- Só o dono, logado, escolhe os destaques
create policy "dono escolhe os destaques"
  on public.featured_repos for all
  to authenticated
  using (true)
  with check (true);
