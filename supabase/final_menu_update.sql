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
('postres', 'Postres', 6),
('bebidas', 'Bebidas', 7)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Pastas with Variants
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

-- 5. Insert Drinks
INSERT INTO products (category_id, name, description, price, is_available, variants) VALUES
('bebidas', 'Refrescos', 'Gaseosas variadas bien frías', 2.50, true, 
 '[{"name": "Sabor", "options": ["Coca Cola", "Sprite", "Fanta"], "required": true}]'::jsonb),

('bebidas', 'Agua Mineral', 'Botella de agua natural o con gas', 1.50, true, 
 '[{"name": "Tipo", "options": ["Natural", "Con Gas"], "required": true}]'::jsonb),

('bebidas', 'Cerveza', 'Cerveza nacional o importada', 3.50, true, 
 '[{"name": "Marca", "options": ["Pilsen", "Corona", "Stella"], "required": true}]'::jsonb);
