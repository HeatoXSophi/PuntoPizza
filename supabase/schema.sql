-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Categories Table
create table if not exists categories (
  id text primary key,
  name text not null,
  sort_order int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Products Table
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric not null,
  category_id text references categories(id),
  image_url text,
  available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Orders Table
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  user_data jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb,
  total numeric not null,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- 5. Create Policies (Public Read Access for Menu)
create policy "Public Categories are viewable by everyone" 
  on categories for select using (true);

create policy "Public Products are viewable by everyone" 
  on products for select using (true);

-- 6. Create Policies (Orders: Insert for everyone, Select for individual not implemented yet)
create policy "Anyone can create an order" 
  on orders for insert with check (true);

-- 7. Storage Bucket (Optional but recommended for images)
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public Images are viewable by everyone"
  on storage.objects for select using ( bucket_id = 'product-images' );
