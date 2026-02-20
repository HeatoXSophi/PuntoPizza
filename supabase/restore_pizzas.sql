-- 1. Insert Missing Categories
INSERT INTO categories (id, name, order_index) VALUES 
('personal', 'Pequeña', 1),
('medium', 'Mediana', 2),
('large', 'Grande', 3),
('family', 'Familiar', 4),
('combos', 'Combos', 8),
('promos', 'Promociones', 9)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Pizzas (Personal)
INSERT INTO products (category_id, name, description, price, is_available, is_popular, image_url, base_ingredients) VALUES
('personal', 'Margarita', 'Salsa de tomate, mozzarella fresca y albahaca.', 7.99, true, false, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella fresca', 'Albahaca']),
('personal', 'Jamón y Queso', 'Clásica combinación de jamón y mozzarella.', 8.50, true, false, 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella', 'Jamón']),
('personal', 'Pepperoni', 'Doble pepperoni y mozzarella.', 8.99, true, true, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella', 'Pepperoni']),
('personal', 'Chorizo', 'Chorizo español y pimientos.', 8.99, true, false, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella', 'Chorizo Español', 'Pimientos']),
('personal', 'Vegetariana', 'Pimientos, cebolla, champiñones, maíz y aceitunas.', 8.50, true, false, 'https://images.unsplash.com/photo-1571407970349-bc16f63433cd?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella', 'Pimientos', 'Cebolla', 'Champiñones', 'Maíz', 'Aceitunas']),
('personal', 'Anchoas', 'Anchoas, alcaparras y aceitunas negras.', 9.50, true, false, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella', 'Anchoas', 'Alcaparras', 'Aceitunas Negras']),
('personal', 'Primavera', 'Jamón, maíz y tocineta.', 9.50, true, false, 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella', 'Jamón', 'Maíz', 'Tocineta']),
('personal', 'Tocineta', 'Tocineta crujiente y extra queso.', 9.50, true, false, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella', 'Tocineta', 'Extra Queso']),
('personal', 'Especial', 'Jamón, pepperoni, cebolla, pimentón y aceitunas.', 10.50, true, false, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella', 'Jamón', 'Pepperoni', 'Cebolla', 'Pimentón', 'Aceitunas']),
('personal', 'Santa Cruz', 'La especialidad de la casa con ingredientes secretos.', 11.00, true, false, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella', 'Ingredientes Secretos']),
('personal', '2 Sabores', 'Mitad y mitad de tus sabores favoritos.', 9.99, true, false, 'https://images.unsplash.com/photo-1571407970349-bc16f63433cd?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella']),
('personal', '4 Sabores', 'Cuatro estaciones de sabor en una pizza.', 10.99, true, false, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400', ARRAY['Salsa de tomate', 'Mozzarella']);

-- 3. Insert Pizzas (Medium)
INSERT INTO products (category_id, name, description, price, is_available, is_popular, is_spicy, image_url) VALUES
('medium', 'Margarita', 'Salsa de tomate, mozzarella fresca y albahaca.', 11.99, true, false, false, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400'),
('medium', 'Jamón y Queso', 'Clásica combinación de jamón y mozzarella.', 12.50, true, false, false, 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=400'),
('medium', 'Pepperoni', 'Doble pepperoni y mozzarella.', 12.99, true, true, false, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400'),
('medium', 'Chorizo', 'Chorizo español y pimientos.', 12.99, true, false, false, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400'),
('medium', 'Vegetariana', 'Pimientos, cebolla, champiñones, maíz y aceitunas.', 12.50, true, false, false, 'https://images.unsplash.com/photo-1571407970349-bc16f63433cd?auto=format&fit=crop&q=80&w=400'),
('medium', 'Anchoas', 'Anchoas, alcaparras y aceitunas negras.', 13.50, true, false, true, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400'),
('medium', 'Primavera', 'Jamón, maíz y tocineta.', 13.50, true, false, false, 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=400'),
('medium', 'Tocineta', 'Tocineta crujiente y extra queso.', 13.50, true, false, false, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400'),
('medium', 'Especial', 'Jamón, pepperoni, cebolla, pimentón y aceitunas.', 14.50, true, false, false, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400'),
('medium', 'Santa Cruz', 'La especialidad de la casa con ingredientes secretos.', 15.00, true, false, false, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400'),
('medium', '2 Sabores', 'Mitad y mitad de tus sabores favoritos.', 13.99, true, false, false, 'https://images.unsplash.com/photo-1571407970349-bc16f63433cd?auto=format&fit=crop&q=80&w=400'),
('medium', '4 Sabores', 'Cuatro estaciones de sabor en una pizza.', 14.99, true, false, false, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400');

-- 4. Insert Pizzas (Large)
INSERT INTO products (category_id, name, description, price, is_available, is_popular, is_spicy, image_url) VALUES
('large', 'Margarita', 'Salsa de tomate, mozzarella fresca y albahaca.', 15.99, true, false, false, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400'),
('large', 'Jamón y Queso', 'Clásica combinación de jamón y mozzarella.', 16.50, true, false, false, 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=400'),
('large', 'Pepperoni', 'Doble pepperoni y mozzarella.', 16.99, true, true, false, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400'),
('large', 'Chorizo', 'Chorizo español y pimientos.', 16.99, true, false, false, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400'),
('large', 'Vegetariana', 'Pimientos, cebolla, champiñones, maíz y aceitunas.', 16.50, true, false, false, 'https://images.unsplash.com/photo-1571407970349-bc16f63433cd?auto=format&fit=crop&q=80&w=400'),
('large', 'Anchoas', 'Anchoas, alcaparras y aceitunas negras.', 17.50, true, false, true, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400'),
('large', 'Primavera', 'Jamón, maíz y tocineta.', 17.50, true, false, false, 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=400'),
('large', 'Tocineta', 'Tocineta crujiente y extra queso.', 17.50, true, false, false, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400'),
('large', 'Especial', 'Jamón, pepperoni, cebolla, pimentón y aceitunas.', 18.50, true, false, false, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400'),
('large', 'Santa Cruz', 'La especialidad de la casa con ingredientes secretos.', 19.00, true, false, false, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400'),
('large', '2 Sabores', 'Mitad y mitad de tus sabores favoritos.', 17.99, true, false, false, 'https://images.unsplash.com/photo-1571407970349-bc16f63433cd?auto=format&fit=crop&q=80&w=400'),
('large', '4 Sabores', 'Cuatro estaciones de sabor en una pizza.', 18.99, true, false, false, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400');

-- 5. Insert Pizzas (Family)
INSERT INTO products (category_id, name, description, price, is_available, is_popular, is_spicy, image_url) VALUES
('family', 'Margarita', 'Salsa de tomate, mozzarella fresca y albahaca.', 19.99, true, false, false, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400'),
('family', 'Jamón y Queso', 'Clásica combinación de jamón y mozzarella.', 20.50, true, false, false, 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=400'),
('family', 'Pepperoni', 'Doble pepperoni y mozzarella.', 20.99, true, true, false, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400'),
('family', 'Chorizo', 'Chorizo español y pimientos.', 20.99, true, false, false, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400'),
('family', 'Vegetariana', 'Pimientos, cebolla, champiñones, maíz y aceitunas.', 20.50, true, false, false, 'https://images.unsplash.com/photo-1571407970349-bc16f63433cd?auto=format&fit=crop&q=80&w=400'),
('family', 'Anchoas', 'Anchoas, alcaparras y aceitunas negras.', 21.50, true, false, true, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400'),
('family', 'Primavera', 'Jamón, maíz y tocineta.', 21.50, true, false, false, 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=400'),
('family', 'Tocineta', 'Tocineta crujiente y extra queso.', 21.50, true, false, false, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400'),
('family', 'Especial', 'Jamón, pepperoni, cebolla, pimentón y aceitunas.', 22.50, true, false, false, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400'),
('family', 'Santa Cruz', 'La especialidad de la casa con ingredientes secretos.', 23.00, true, false, false, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400'),
('family', '2 Sabores', 'Mitad y mitad de tus sabores favoritos.', 21.99, true, false, false, 'https://images.unsplash.com/photo-1571407970349-bc16f63433cd?auto=format&fit=crop&q=80&w=400'),
('family', '4 Sabores', 'Cuatro estaciones de sabor en una pizza.', 22.99, true, false, false, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400');

-- 6. Insert Combos (Combo Familiar)
INSERT INTO products (category_id, name, description, price, is_available, is_popular, image_url) VALUES
('combos', 'Combo Familiar', '2 Pizzas Grandes + Coca Cola 2L + Palitos de Ajo.', 25.99, true, true, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400');
