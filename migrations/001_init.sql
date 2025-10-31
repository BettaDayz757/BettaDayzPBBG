-- Supabase initial schema for BettaDayz
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

create table wallets (
  user_id uuid primary key references profiles(id),
  bettabuck_balance integer default 0,
  updated_at timestamp with time zone default now()
);

create table items (
  id serial primary key,
  name text not null,
  price_bettabuck integer not null,
  type text,
  rarity text,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

create table purchases (
  id serial primary key,
  user_id uuid references profiles(id),
  item_id int references items(id),
  cost_bettabuck integer,
  fee_usd numeric(8,2),
  payment_provider text,
  provider_tx_id text,
  status text default 'pending',
  created_at timestamp with time zone default now()
);
