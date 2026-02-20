-- Add variants column to products
ALTER TABLE products ADD COLUMN variants jsonb DEFAULT NULL;

-- Example of what variants will look like: 
-- [
--   {
--     "name": "Tipo de Pasta",
--     "options": ["Linguini", "Caracol", "Rigatoni"],
--     "required": true
--   }
-- ]
