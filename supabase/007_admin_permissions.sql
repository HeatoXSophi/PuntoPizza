-- Habilitar permisos públicos para que el panel de admin funcione sin Supabase Auth
-- (La seguridad la está manejando Next.js con la contraseña de ingreso)

DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Public can update products" ON products;
CREATE POLICY "Public can update products" ON products FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Public can insert products" ON products;
CREATE POLICY "Public can insert products" ON products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Public can delete products" ON products;
CREATE POLICY "Public can delete products" ON products FOR DELETE USING (true);

-- Lo mismo para storage (el bucket de imágenes)
DROP POLICY IF EXISTS "Permitir subir imágenes a product-images" ON storage.objects;
DROP POLICY IF EXISTS "Cualquiera puede subir imagenes" ON storage.objects;
CREATE POLICY "Cualquiera puede subir imagenes" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'product-images' );

DROP POLICY IF EXISTS "Cualquiera puede actualizar imagenes" ON storage.objects;
CREATE POLICY "Cualquiera puede actualizar imagenes" ON storage.objects FOR UPDATE USING ( bucket_id = 'product-images' );
