-- Mensagens do formulário de contato.
-- Rode no SQL Editor do Supabase (ou com `supabase db push`).

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 20 and 2000),
  answered boolean not null default false,
  created_at timestamptz not null default now()
);

create index messages_created_at_idx on public.messages (created_at desc);

-- Row Level Security: sem política, ninguém lê nem escreve.
alter table public.messages enable row level security;

-- Visitante (chave pública) só pode inserir. Os limites de tamanho acima
-- valem também para quem tentar inserir direto pela API.
create policy "visitante envia mensagem"
  on public.messages for insert
  to anon
  with check (answered = false);

-- Só o dono, logado, lê as mensagens e marca como respondida.
create policy "dono lê mensagens"
  on public.messages for select
  to authenticated
  using (true);

create policy "dono marca como respondida"
  on public.messages for update
  to authenticated
  using (true)
  with check (true);
