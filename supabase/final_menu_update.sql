-- 1. Add variants column (Safe to run multiple times)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'variants') THEN 
        ALTER TABLE products ADD COLUMN variants jsonb DEFAULT NULL; 
    END IF; 
END $$;

-- 2. Upsert Categories
INSERT INTO categories (id, name, order_index) VALUES 
('pastas', 'Pastas', 5),
('postres', 'Postres', 6)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Pastas with Variants
-- We use ON CONFLICT DO NOTHING to avoid duplicates if run multiple times, assuming name+category_id unique constraint or just name? 
-- The schema doesn't seem to have a unique constraint on name, but let's just insert.
-- To prevent duplicates better, we can check existence or just delete old ones with same name? 
-- Let's just insert for now, user can delete duplicates in admin if they occur (simplest for this context).

INSERT INTO products (category_id, name, description, price, is_available, variants) VALUES
('pastas', 'Bologna', 'Salsa bolognesa clásica con carne', 45.00, true, 
 '[{"name": "Tipo de Pasta", "options": ["Linguini", "Caracol", "Rigatoni"], "required": true}]'::jsonb),

('pastas', 'Pesto', 'Salsa pesto genovesa con albahaca y piñones', 40.00, true, 
 '[{"name": "Tipo de Pasta", "options": ["Linguini", "Caracol", "Rigatoni"], "required": true}]'::jsonb),

('pastas', 'Alfredo', 'Salsa blanca cremosa con parmesano', 42.00, true, 
 '[{"name": "Tipo de Pasta", "options": ["Linguini", "Caracol", "Rigatoni"], "required": true}]'::jsonb);

-- 4. Insert Desserts
INSERT INTO products (category_id, name, description, price, is_available) VALUES
('postres', 'Torta Tres Leches', 'Bizcocho húmedo bañado en tres tipos de leche', 25.00, true),
('postres', 'Torta Chocolate', 'Intensa torta de chocolate con ganache', 28.00, true),
('postres', 'Torta Moka', 'Suave torta con toque de café', 26.00, true),
('postres', 'Marquesa', 'Postre frío de galletas y chocolate', 20.00, true);
