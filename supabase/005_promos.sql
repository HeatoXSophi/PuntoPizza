-- Limpiar promos anteriores si existen
DELETE FROM products WHERE category_id = 'promos';

INSERT INTO products (category_id, name, description, price, is_available, image_url, base_ingredients) VALUES
('promos', 'Triple Margarita', '3 Margaritas Pequeñas, Salsa y Queso Mozarella', 10.00, true, '/images/pizzas/margarita_personal.png', ARRAY['Salsa de tomate', 'Mozzarella']),
('promos', 'Doble Jamón', '2 Jamón y Queso Pequeñas, Salsa, Queso Mozarella y Jamón + Refresco de Litro 1/2', 10.00, true, '/images/pizzas/jamon_y_queso_personal.png', ARRAY['Salsa de tomate', 'Mozzarella', 'Jamón']),
('promos', 'Dúo Sabor', '2 Pizzas Medianas (1 de Tocineta y 1 de Pepperoni) + Refresco de Litro 1/2', 20.00, true, '/images/pizzas/pepperoni_medium.png', ARRAY['Salsa de tomate', 'Mozzarella', 'Tocineta', 'Pepperoni']),
('promos', 'Margarita Doble Sabor', 'Familiar Rectangular: Salsa, Queso Mozarella + 2 INGREDIENTES DE SU PREFERENCIA + 1 Refresco de Litro 1/2', 24.00, true, '/images/pizzas/margarita_family.png', ARRAY['Salsa de tomate', 'Mozzarella']),
('promos', 'Margarita 4 Sabores', 'Familiar Rectangular: Salsa, Queso Mozarella + 4 INGREDIENTES DE SU PREFERENCIA + 1 Refresco de Litro 1/2', 26.00, true, '/images/pizzas/margarita_family.png', ARRAY['Salsa de tomate', 'Mozzarella']);
