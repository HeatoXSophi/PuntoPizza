-- Create a table for orders
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  total numeric not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'delivered', 'cancelled')),
  delivery_type text not null,
  address text,
  phone text,
  payment_method text,
  items jsonb not null -- Stores the array of items (product, variations, quantity)
);

-- Set up Row Level Security (RLS)
alter table orders enable row level security;

-- Policy: Users can insert their own orders
create policy "Users can insert their own orders"
  on orders for insert
  with check (auth.uid() = user_id);

-- Policy: Users can view their own orders
create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

-- Policy: Admins can view all orders (Optional, if you have an admin role)
-- create policy "Admins can view all orders"
--   on orders for select
--   using (auth.jwt() ->> 'role' = 'admin');
