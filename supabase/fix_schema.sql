-- Run this in Supabase SQL Editor to fix the migration error

-- 1. Add order_index column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'order_index') THEN 
        ALTER TABLE categories ADD COLUMN order_index integer DEFAULT 0; 
    END IF; 
END $$;

-- 2. Add base_ingredients column to products if you want to store ingredients
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'base_ingredients') THEN 
        ALTER TABLE products ADD COLUMN base_ingredients text[]; -- Array of strings
    END IF; 
END $$;

-- 3. Verify policies exist (just in case)
-- (This part is usually fine, but good to double check)
