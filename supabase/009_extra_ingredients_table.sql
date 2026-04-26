-- Tabla de ingredientes extras configurables desde el admin
CREATE TABLE IF NOT EXISTS extra_ingredients (
    id          text PRIMARY KEY,               -- slug único: "queso", "pepperoni"
    name        text NOT NULL,                  -- nombre visible
    price_personal  numeric(10,2) DEFAULT 1.00, -- Pequeña
    price_mediana   numeric(10,2) DEFAULT 1.50, -- Mediana
    price_grande    numeric(10,2) DEFAULT 2.00, -- Grande
    price_family    numeric(10,2) DEFAULT 3.00, -- Familiar (XL)
    is_active   boolean DEFAULT true,
    order_index integer DEFAULT 0,
    created_at  timestamptz DEFAULT now()
);

-- Permisos públicos (igual que products)
ALTER TABLE extra_ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read extra_ingredients" ON extra_ingredients FOR SELECT USING (true);
CREATE POLICY "Public insert extra_ingredients" ON extra_ingredients FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update extra_ingredients" ON extra_ingredients FOR UPDATE USING (true);
CREATE POLICY "Public delete extra_ingredients" ON extra_ingredients FOR DELETE USING (true);

-- Insertar los ingredientes del catálogo actual
INSERT INTO extra_ingredients (id, name, price_personal, price_mediana, price_grande, price_family, order_index) VALUES
('queso',       'Queso',           2.00, 3.00, 4.00, 5.00, 1),
('pimenton',    'Pimentón',        0.75, 1.00, 1.50, 2.00, 2),
('cebolla',     'Cebolla',         0.70, 1.00, 1.50, 2.00, 3),
('anchoas',     'Anchoas',         1.00, 1.50, 2.00, 3.00, 4),
('aceitunas',   'Aceitunas',       1.00, 1.50, 2.00, 3.00, 5),
('champinones', 'Champiñones',     1.00, 1.50, 2.00, 3.00, 6),
('maiz',        'Maíz',            1.00, 1.50, 2.00, 3.00, 7),
('chorizo',     'Chorizo Criollo', 1.00, 1.50, 2.00, 3.00, 8),
('tocineta',    'Tocineta',        1.00, 1.50, 2.00, 3.00, 9),
('pepperoni',   'Pepperoni',       1.00, 1.50, 2.00, 3.00, 10),
('carne',       'Carne',           1.00, 1.50, 2.00, 3.00, 11)
ON CONFLICT (id) DO NOTHING;
