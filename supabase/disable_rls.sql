-- TEMPORARY FIX: Disable RLS to allow the Admin Panel to work without full Auth
-- Run this in Supabase SQL Editor

-- 1. Disable RLS on categories and products
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- 2. (Optional) If you prefer to keep RLS enabled but allow ALL access (insert/update/delete) to everyone (for development):
-- open policies...
-- but disabling is faster for now.

-- NOTE: In the future, for a secure PRODUCTION app, we should:
-- 1. Re-enable RLS: ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- 2. Implement a real Login Page that uses supabase.auth.signInWithPassword()
