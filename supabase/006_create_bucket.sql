-- Crear el bucket 'product-images' si no existe
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Crear política para permitir que cualquiera pueda leer las imágenes
create policy "Cualquiera puede ver product-images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

-- Crear política para permitir subir imágenes (idealmente solo admins, pero para empezar lo dejamos simple)
create policy "Permitir subir imágenes a product-images"
  on storage.objects for insert
  with check ( bucket_id = 'product-images' );
