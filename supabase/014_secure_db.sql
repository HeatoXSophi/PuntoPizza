-- 014_secure_db.sql
-- Este archivo cierra la vulnerabilidad crítica de seguridad.
-- Reemplaza los permisos públicos de modificación (INSERT, UPDATE, DELETE) 
-- por permisos que requieren que el usuario esté autenticado.

-- =========================================
-- 1. PROTEGER TABLA DE PRODUCTOS
-- =========================================
DROP POLICY IF EXISTS "Public can update products" ON products;
DROP POLICY IF EXISTS "Public can insert products" ON products;
DROP POLICY IF EXISTS "Public can delete products" ON products;

CREATE POLICY "Admin can update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- =========================================
-- 2. PROTEGER TABLA DE CATEGORÍAS
-- =========================================
DROP POLICY IF EXISTS "Permitir actualizaciones públicas" ON categories;
DROP POLICY IF EXISTS "Permitir inserciones públicas" ON categories;
DROP POLICY IF EXISTS "Permitir eliminaciones públicas" ON categories;

CREATE POLICY "Admin update categories" ON categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin insert categories" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin delete categories" ON categories FOR DELETE USING (auth.role() = 'authenticated');

-- =========================================
-- 3. PROTEGER TABLA DE INGREDIENTES EXTRA
-- =========================================
DROP POLICY IF EXISTS "Public can insert ingredients" ON extra_ingredients;
DROP POLICY IF EXISTS "Public can update ingredients" ON extra_ingredients;
DROP POLICY IF EXISTS "Public can delete ingredients" ON extra_ingredients;

CREATE POLICY "Admin insert ingredients" ON extra_ingredients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update ingredients" ON extra_ingredients FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete ingredients" ON extra_ingredients FOR DELETE USING (auth.role() = 'authenticated');

-- =========================================
-- 4. PROTEGER EL BUCKET DE IMÁGENES (STORAGE)
-- =========================================
DROP POLICY IF EXISTS "Cualquiera puede subir imagenes" ON storage.objects;
DROP POLICY IF EXISTS "Cualquiera puede actualizar imagenes" ON storage.objects;

CREATE POLICY "Admin puede subir imagenes" ON storage.objects 
    FOR INSERT WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
CREATE POLICY "Admin puede actualizar imagenes" ON storage.objects 
    FOR UPDATE USING ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

-- =========================================
-- NOTA: Las políticas de SELECT (lectura) siguen siendo públicas para que los clientes puedan ver el menú.
-- =========================================
