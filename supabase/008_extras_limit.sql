-- Agregar columna extras_limit a la tabla products
-- -1 = sin límite (default), 0 = desactivado, 1..N = máximo N extras
ALTER TABLE products
ADD COLUMN IF NOT EXISTS extras_limit integer DEFAULT -1;

-- Actualizar las promociones para que NO tengan extras (son combos fijos)
UPDATE products SET extras_limit = 0 WHERE category_id = 'promos';
