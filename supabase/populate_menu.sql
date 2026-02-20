-- 1. Upsert Categories
INSERT INTO categories (id, name, order_index) VALUES 
('pastas', 'Pastas', 5),
('postres', 'Postres', 6)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Pastas with Variants
INSERT INTO products (category_id, name, description, price, is_available, variants) VALUES
('pastas', 'Bologna', 'Salsa bolognesa clásica con carne', 45.00, true, 
 '[{"name": "Tipo de Pasta", "options": ["Linguini", "Caracol", "Rigatoni"], "required": true}]'::jsonb),

('pastas', 'Pesto', 'Salsa pesto genovesa con albahaca y piñones', 40.00, true, 
 '[{"name": "Tipo de Pasta", "options": ["Linguini", "Caracol", "Rigatoni"], "required": true}]'::jsonb),

('pastas', 'Alfredo', 'Salsa blanca cremosa con parmesano', 42.00, true, 
 '[{"name": "Tipo de Pasta", "options": ["Linguini", "Caracol", "Rigatoni"], "required": true}]'::jsonb);

-- 3. Insert Desserts
INSERT INTO products (category_id, name, description, price, is_available) VALUES
('postres', 'Torta Tres Leches', 'Bizcocho húmedo bañado en tres tipos de leche', 25.00, true),
('postres', 'Torta Chocolate', 'Intensa torta de chocolate con ganache', 28.00, true),
('postres', 'Torta Moka', 'Suave torta con toque de café', 26.00, true),
('postres', 'Marquesa', 'Postre frío de galletas y chocolate', 20.00, true);
