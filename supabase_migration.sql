-- Copia y pega este código en el Editor SQL de Supabase (SQL Editor) para corregir las tablas

-- 1. Tabla 'rooms' (Salas)
CREATE TABLE IF NOT EXISTS rooms (
  id bigint PRIMARY KEY,
  content jsonb
);

-- Asegurar que exista la columna 'content'
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS content jsonb;

-- 2. Tabla 'app_settings' (Configuración Global)
CREATE TABLE IF NOT EXISTS app_settings (
  id bigint PRIMARY KEY,
  content jsonb
);

-- Asegurar que exista la columna 'content'
ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS content jsonb;

-- 3. Habilitar Row Level Security (RLS) - Opcional pero recomendado
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas de acceso (Permitir todo para este caso de uso)
-- Eliminar políticas antiguas para evitar conflictos
DROP POLICY IF EXISTS "Public Access Rooms" ON rooms;
DROP POLICY IF EXISTS "Public Access Settings" ON app_settings;

-- Crear nuevas políticas
CREATE POLICY "Public Access Rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Settings" ON app_settings FOR ALL USING (true) WITH CHECK (true);
