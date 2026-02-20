-- Add is_admin column to profiles
alter table profiles add column if not exists is_admin boolean default false;

-- Update RLS for orders to allow admins to view all
create policy "Admins can view all orders"
  on orders for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Update RLS for orders to allow admins to update status
create policy "Admins can update orders"
  on orders for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Function to make the first user an admin (Helper for setup)
-- Usage: select make_admin('email@example.com');
create or replace function make_admin(user_email text)
returns void as $$
begin
  update profiles
  set is_admin = true
  where id = (select id from auth.users where email = user_email);
end;
$$ language plpgsql security definer;
