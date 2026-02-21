-- ============================================
-- Santa Cruz Pizzería — DATABASE SCHEMA
-- Run this FIRST on a fresh Supabase project
-- ============================================

BEGIN;

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id text PRIMARY KEY,
    name text NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. Products Table
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

-- 3. Orders Table
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

-- 4. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    phone text,
    address text,
    loyalty_points integer DEFAULT 0,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 5. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name text NOT NULL DEFAULT 'Anónimo',
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 6. Coupons Table
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

COMMIT;
