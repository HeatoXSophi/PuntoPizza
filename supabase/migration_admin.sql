-- 1. Add Image to Categories
alter table categories 
add column if not exists image_url text;

-- 2. Add Extras/Ingredients configuration to Products
-- Structure example: [{"name": "Extra Queso", "price": 1.50}, {"name": "Borde Relleno", "price": 2.00}]
alter table products 
add column if not exists extras jsonb default '[]'::jsonb;

-- 3. Storage Policy Update (Allow Uploads for authenticated users)
-- For now, we allow public uploads to simplify the Admin demo. 
-- In production, restrict INSERT to authenticated users.
create policy "Anyone can upload images"
  on storage.objects for insert with check ( bucket_id = 'product-images' );
