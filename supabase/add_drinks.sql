-- 1. Upsert Bebidas Category
INSERT INTO categories (id, name, order_index) VALUES 
('bebidas', 'Bebidas', 7)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Drinks
INSERT INTO products (category_id, name, description, price, is_available, variants) VALUES
('bebidas', 'Refrescos', 'Gaseosas variadas bien frías', 2.50, true, 
 '[{"name": "Sabor", "options": ["Coca Cola", "Sprite", "Fanta"], "required": true}]'::jsonb),

('bebidas', 'Agua Mineral', 'Botella de agua natural o con gas', 1.50, true, 
 '[{"name": "Tipo", "options": ["Natural", "Con Gas"], "required": true}]'::jsonb),

('bebidas', 'Cerveza', 'Cerveza nacional o importada', 3.50, true, 
 '[{"name": "Marca", "options": ["Pilsen", "Corona", "Stella"], "required": true}]'::jsonb);
