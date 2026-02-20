-- Ensure Public Read Access
BEGIN;

-- 1. Enable RLS on tables (if not already enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts (safe to run if policies don't exist)
DROP POLICY IF EXISTS "Public can read products" ON products;
DROP POLICY IF EXISTS "Public can read categories" ON categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;

-- 3. Create permissive policies for public SELECT
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);

COMMIT;
