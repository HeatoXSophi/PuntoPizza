-- Add boxes_required column to products table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'boxes_required') THEN 
        ALTER TABLE products ADD COLUMN boxes_required integer DEFAULT 1; 
    END IF;
END $$;

-- Update defaults for known non-pizza categories
UPDATE products SET boxes_required = 0 WHERE category_id IN ('bebidas', 'postres', 'pastas');
