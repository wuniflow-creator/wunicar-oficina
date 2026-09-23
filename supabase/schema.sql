-- WuniCard Oficina - schema inicial
create extension if not exists "uuid-ossp";

create table if not exists oficinas (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  created_at timestamptz default now()
);

create table if not exists user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  oficina_id uuid references oficinas(id) on delete cascade not null,
  role text not null check (role in ('admin', 'mecanico', 'recepcao')),
  created_at timestamptz default now(),
  unique(user_id, oficina_id)
);

create table if not exists clientes (
  id uuid primary key default uuid_generate_v4(),
  oficina_id uuid references oficinas(id) on delete cascade not null,
  nome text not null,
  telefone text,
  email text,
  created_at timestamptz default now()
);

create table if not exists carros (
  id uuid primary key default uuid_generate_v4(),
  oficina_id uuid references oficinas(id) on delete cascade not null,
  cliente_id uuid references clientes(id) on delete cascade not null,
  marca text, modelo text, ano int, placa text, km_atual int, cor text,
  created_at timestamptz default now()
);

create table if not exists ordens_servico (
  id uuid primary key default uuid_generate_v4(),
  oficina_id uuid references oficinas(id) on delete cascade not null,
  carro_id uuid references carros(id) on delete cascade not null,
  servico_solicitado text,
  diagnostico text,
  status text default 'agendado' check (status in ('agendado','em_andamento','concluido','entregue')),
  previsao_entrega date,
  mao_de_obra numeric(10,2) default 0,
  pecas numeric(10,2) default 0,
  total numeric(10,2) generated always as (mao_de_obra + pecas) stored,
  created_at timestamptz default now()
);

create table if not exists checklist_itens (
  id uuid primary key default uuid_generate_v4(),
  os_id uuid references ordens_servico(id) on delete cascade not null,
  categoria text,
  item text not null,
  concluido boolean default false
);

create table if not exists agenda (
  id uuid primary key default uuid_generate_v4(),
  oficina_id uuid references oficinas(id) on delete cascade not null,
  os_id uuid references ordens_servico(id) on delete set null,
  data date not null,
  horario time not null,
  cliente_id uuid references clientes(id),
  status text default 'agendado' check (status in ('agendado','em_andamento','concluido'))
);

create table if not exists despesas (
  id uuid primary key default uuid_generate_v4(),
  oficina_id uuid references oficinas(id) on delete cascade not null,
  data date default current_date,
  descricao text,
  categoria text,
  valor numeric(10,2) not null,
  forma_pagamento text
);

create or replace function has_role(_oficina_id uuid, _role text default null)
returns boolean language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and oficina_id = _oficina_id
      and (_role is null or role = _role)
  );
$$;

alter table oficinas enable row level security;
alter table clientes enable row level security;
alter table carros enable row level security;
alter table ordens_servico enable row level security;
alter table checklist_itens enable row level security;
alter table agenda enable row level security;
alter table despesas enable row level security;
alter table user_roles enable row level security;

create policy "usuario_ve_oficinas" on oficinas
  for select using (has_role(id));

create policy "acesso_oficina_clientes" on clientes
  for all using (has_role(oficina_id)) with check (has_role(oficina_id));
create policy "acesso_oficina_carros" on carros
  for all using (has_role(oficina_id)) with check (has_role(oficina_id));
create policy "acesso_oficina_os" on ordens_servico
  for all using (has_role(oficina_id)) with check (has_role(oficina_id));

create policy "acesso_oficina_checklist_select" on checklist_itens
  for select using (
    exists (select 1 from ordens_servico os where os.id = os_id and has_role(os.oficina_id))
  );
create policy "acesso_oficina_checklist_insert" on checklist_itens
  for insert with check (
    exists (select 1 from ordens_servico os where os.id = os_id and has_role(os.oficina_id))
  );
create policy "acesso_oficina_checklist_update" on checklist_itens
  for update using (
    exists (select 1 from ordens_servico os where os.id = os_id and has_role(os.oficina_id))
  ) with check (
    exists (select 1 from ordens_servico os where os.id = os_id and has_role(os.oficina_id))
  );
create policy "acesso_oficina_checklist_delete" on checklist_itens
  for delete using (
    exists (select 1 from ordens_servico os where os.id = os_id and has_role(os.oficina_id))
  );

create policy "acesso_oficina_agenda" on agenda
  for all using (has_role(oficina_id)) with check (has_role(oficina_id));
create policy "acesso_oficina_despesas" on despesas
  for all using (has_role(oficina_id)) with check (has_role(oficina_id));
create policy "usuario_ve_proprios_papeis" on user_roles
  for select using (user_id = auth.uid());
