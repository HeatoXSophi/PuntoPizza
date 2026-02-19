-- Drop policies if they exist to avoid conflicts
drop policy if exists "Public Categories are viewable by everyone" on categories;
drop policy if exists "Public Products are viewable by everyone" on products;
drop policy if exists "Public Read Categories" on categories;
drop policy if exists "Public Read Products" on products;

-- Re-create Policies
create policy "Public Read Categories" 
  on categories for select using (true);

create policy "Public Read Products" 
  on products for select using (true);

-- Ensure RLS is enabled
alter table categories enable row level security;
alter table products enable row level security;
