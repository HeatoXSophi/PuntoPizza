-- Add free_extras column to products table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'free_extras') THEN 
        ALTER TABLE products ADD COLUMN free_extras integer DEFAULT 0; 
    END IF;
END $$;
