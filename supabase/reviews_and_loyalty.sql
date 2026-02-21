-- Reviews & Ratings Schema
-- Run this in Supabase SQL Editor

BEGIN;

-- 1. Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name text NOT NULL DEFAULT 'Anónimo',
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. RLS Policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can read reviews
DROP POLICY IF EXISTS "Public can read reviews" ON reviews;
CREATE POLICY "Public can read reviews" ON reviews FOR SELECT USING (true);

-- Authenticated users can insert their own reviews
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
CREATE POLICY "Users can create reviews" ON reviews 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
CREATE POLICY "Users can update own reviews" ON reviews 
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reviews
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;
CREATE POLICY "Users can delete own reviews" ON reviews 
    FOR DELETE USING (auth.uid() = user_id);

-- 3. Coupons table (for loyalty program)
CREATE TABLE IF NOT EXISTS coupons (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    code text UNIQUE NOT NULL,
    discount_percent integer NOT NULL CHECK (discount_percent >= 1 AND discount_percent <= 100),
    min_order_amount numeric(10,2) DEFAULT 0,
    max_uses integer DEFAULT 1,
    current_uses integer DEFAULT 0,
    is_active boolean DEFAULT true,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read active coupons" ON coupons;
CREATE POLICY "Public can read active coupons" ON coupons 
    FOR SELECT USING (is_active = true);

-- 4. Add loyalty_points to profiles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'loyalty_points') THEN
        ALTER TABLE profiles ADD COLUMN loyalty_points integer DEFAULT 0;
    END IF;
END $$;

COMMIT;
