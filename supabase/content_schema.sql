-- Create categories table
create table categories (
  id text primary key, -- slug (e.g. 'pizzas', 'bebidas')
  name text not null,
  order_index integer default 0
);

-- Create products table
create table products (
  id uuid default gen_random_uuid() primary key,
  category_id text references categories(id) on delete set null,
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  is_available boolean default true,
  is_popular boolean default false,
  is_spicy boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table categories enable row level security;
alter table products enable row level security;

-- Public read access
create policy "Public can read categories" on categories for select using (true);
create policy "Public can read products" on products for select using (true);

-- Admin write access
create policy "Admins can insert categories" on categories for insert with check (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admins can update categories" on categories for update using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admins can delete categories" on categories for delete using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Admins can insert products" on products for insert with check (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admins can update products" on products for update using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admins can delete products" on products for delete using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- Storage bucket for product images (You need to create this in Supabase Storage UI as 'products')
-- Policy for Storage will be needed too.
