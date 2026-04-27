-- Ejecuta esto en tu SQL Editor para eliminar el bloqueo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
