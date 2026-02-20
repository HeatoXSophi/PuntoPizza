-- 1. FIX RLS (Public Read Permissions)
-- This is likely why the menu is empty
BEGIN;
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Public can read products" ON products;
    DROP POLICY IF EXISTS "Public can read categories" ON categories;

    CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
    CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
COMMIT;

-- 2. FIX CATEGORY IDs (Match Frontend internal IDs)
-- Frontend expects: 'pasta', 'desserts', 'drinks'
-- We inserted: 'pastas', 'postres', 'bebidas'
-- We need to update IDs (and Foreign Keys)

DO $$ 
BEGIN 
    -- Fix Pastas -> pasta
    IF EXISTS (SELECT 1 FROM categories WHERE id = 'pastas') THEN
        INSERT INTO categories (id, name, order_index) VALUES ('pasta', 'Pastas', 5) ON CONFLICT DO NOTHING;
        UPDATE products SET category_id = 'pasta' WHERE category_id = 'pastas';
        DELETE FROM categories WHERE id = 'pastas';
    END IF;

    -- Fix Postres -> desserts
    IF EXISTS (SELECT 1 FROM categories WHERE id = 'postres') THEN
        INSERT INTO categories (id, name, order_index) VALUES ('desserts', 'Postres', 6) ON CONFLICT DO NOTHING;
        UPDATE products SET category_id = 'desserts' WHERE category_id = 'postres';
        DELETE FROM categories WHERE id = 'postres';
    END IF;

    -- Fix Bebidas -> drinks
    IF EXISTS (SELECT 1 FROM categories WHERE id = 'bebidas') THEN
        INSERT INTO categories (id, name, order_index) VALUES ('drinks', 'Bebidas', 7) ON CONFLICT DO NOTHING;
        UPDATE products SET category_id = 'drinks' WHERE category_id = 'bebidas';
        DELETE FROM categories WHERE id = 'bebidas';
    END IF;
END $$;
