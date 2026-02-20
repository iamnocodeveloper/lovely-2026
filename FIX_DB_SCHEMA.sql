-- ⚠️ ¡ATENCIÓN! ESTE SCRIPT BORRARÁ LAS TABLAS EXISTENTES Y LAS CREARÁ DESDE CERO
-- Esto es necesario porque la estructura actual tiene columnas obligatorias (como 'name') que bloquean la subida de datos.
-- Como la base de datos está vacía (según el diagnóstico), es seguro hacerlo.

-- 1. Eliminar tablas antiguas (Limpieza total)
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS app_settings;

-- 2. Crear tabla 'rooms' (Versión Correcta)
CREATE TABLE rooms (
  id bigint PRIMARY KEY,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. Crear tabla 'app_settings' (Versión Correcta)
CREATE TABLE app_settings (
  id bigint PRIMARY KEY,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 4. Configurar Seguridad (RLS)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas de acceso TOTAL (Lectura y Escritura para todos)
CREATE POLICY "Acceso Total Rooms" ON rooms
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Acceso Total Settings" ON app_settings
  FOR ALL USING (true) WITH CHECK (true);

-- 6. Insertar configuración inicial vacía (opcional, para evitar 404)
-- No es estrictamente necesario porque la app hará el upsert, pero ayuda a verificar.
