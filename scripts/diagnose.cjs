
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) envVars[key.trim()] = value.trim();
});

const supabase = createClient(envVars['VITE_SUPABASE_URL'], envVars['VITE_SUPABASE_ANON_KEY']);

async function runTest() {
  console.log('--- DIAGNÓSTICO DE ESCRITURA ---');
  
  const dummyRoom = {
    id: 9999,
    content: { name: 'Test Room', test: true }
  };

  console.log('Intentando escribir (UPSERT) en tabla "rooms"...');
  
  const { data, error } = await supabase
    .from('rooms')
    .upsert(dummyRoom)
    .select();

  if (error) {
    console.error('❌ ERROR DE ESCRITURA:');
    console.error(`   Código: ${error.code}`);
    console.error(`   Mensaje: ${error.message}`);
    
    if (error.code === '42501') console.log('👉 CAUSA: Permisos denegados (RLS). Faltan políticas de seguridad.');
    if (error.code === '23505') console.log('👉 CAUSA: Conflicto de clave única.');
  } else {
    console.log('✅ ESCRITURA EXITOSA. La base de datos acepta datos.');
    
    // Limpiar
    await supabase.from('rooms').delete().eq('id', 9999);
    console.log('   (Registro de prueba eliminado)');
  }
}

runTest();
