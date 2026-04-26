-- ============================================
-- SCRIPT COMPLETO DE RESTAURACIÓN (Esquema + Seguridad + Menú)
-- ============================================

-- 1. Crear Tablas (Schema)
CREATE TABLE IF NOT EXISTS categories (
    id text PRIMARY KEY,
    name text NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id text REFERENCES categories(id) ON DELETE SET NULL,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    image_url text,
    is_available boolean DEFAULT true,
    is_popular boolean DEFAULT false,
    is_spicy boolean DEFAULT false,
    base_ingredients text[],
    variants jsonb DEFAULT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    items jsonb NOT NULL,
    total numeric(10,2) NOT NULL,
    total_bs numeric(10,2),
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'delivering', 'delivered', 'cancelled')),
    delivery_type text DEFAULT 'pickup',
    address text,
    phone text,
    user_name text,
    payment_method text,
    payment_reference text,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    phone text,
    address text,
    loyalty_points integer DEFAULT 0,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. Configurar Seguridad (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read categories" ON categories;
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read products" ON products;
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- 3. Poblar Menú (Categorías)
INSERT INTO categories (id, name, order_index) VALUES 
('personal', 'Pequeña', 1),
('medium', 'Mediana', 2),
('large', 'Grande', 3),
('family', 'Familiar', 4),
('pasta', 'Pastas', 5),
('desserts', 'Postres', 6),
('drinks', 'Bebidas', 7),
('combos', 'Combos', 8),
('promos', 'Promociones', 9)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 4. Poblar Menú (Pizzas, Pastas, Bebidas y Postres)
DELETE FROM products; -- Limpiar en caso de que ya haya algo mal cargado

INSERT INTO products (category_id, name, description, price, is_available, is_popular, image_url, base_ingredients) VALUES
('personal', 'Margarita', 'Salsa de tomate, mozzarella fresca y albahaca.', 7.99, true, false, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella fresca', 'Albahaca']),
('personal', 'Jamón y Queso', 'Clásica combinación de jamón y mozzarella.', 8.50, true, false, 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella', 'Jamón']),
('personal', 'Pepperoni', 'Doble pepperoni y mozzarella.', 8.99, true, true, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella', 'Pepperoni']),
('medium', 'Margarita', 'Salsa de tomate, mozzarella fresca y albahaca.', 11.99, true, false, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella fresca', 'Albahaca']),
('medium', 'Jamón y Queso', 'Clásica combinación de jamón y mozzarella.', 12.50, true, false, 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella', 'Jamón']),
('medium', 'Pepperoni', 'Doble pepperoni y mozzarella.', 12.99, true, true, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella', 'Pepperoni']);

INSERT INTO products (category_id, name, description, price, is_available, variants) VALUES
('pasta', 'Bologna', 'Salsa bolognesa clásica con carne', 45.00, true, '[{"name": "Tipo de Pasta", "options": ["Linguini", "Caracol", "Rigatoni"], "required": true}]'::jsonb),
('pasta', 'Pesto', 'Salsa pesto genovesa con albahaca y piñones', 40.00, true, '[{"name": "Tipo de Pasta", "options": ["Linguini", "Caracol", "Rigatoni"], "required": true}]'::jsonb),
('drinks', 'Refrescos', 'Gaseosas variadas bien frías', 2.50, true, '[{"name": "Sabor", "options": ["Coca Cola", "Sprite", "Fanta"], "required": true}]'::jsonb),
('drinks', 'Cerveza', 'Cerveza nacional o importada', 3.50, true, '[{"name": "Marca", "options": ["Pilsen", "Corona", "Stella"], "required": true}]'::jsonb);

INSERT INTO products (category_id, name, description, price, is_available) VALUES
('desserts', 'Torta Tres Leches', 'Bizcocho húmedo bañado en tres tipos de leche', 25.00, true),
('desserts', 'Torta Chocolate', 'Intensa torta de chocolate con ganache', 28.00, true);
