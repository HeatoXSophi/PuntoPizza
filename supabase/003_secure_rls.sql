-- ============================================
-- Santa Cruz Pizzería — SECURE RLS POLICIES
-- Fixes critical vulnerability where anyone could read all orders
-- ============================================

BEGIN;

-- 1. Remove the dangerous policy
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;

-- 2. Ensure users can only view their own orders (if they are authenticated)
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders 
    FOR SELECT USING (auth.uid() = user_id);

-- Note: Anonymous users cannot view any orders via the public API anymore.
-- The admin dashboard will now use the SERVICE_ROLE_KEY backend to fetch all orders safely.

COMMIT;
