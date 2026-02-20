
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
  console.log('--- INTENTO DE ARREGLO (WORKAROUND) ---');
  
  const dummyRoom = {
    id: 9999,
    content: { name: 'Test Room Fixed', test: true },
    name: 'Test Room Fixed' // <--- AGREGAMOS ESTO PARA SATISFACER LA RESTRICCIÓN
  };

  console.log('Intentando escribir con campo "name" extra...');
  
  const { data, error } = await supabase
    .from('rooms')
    .upsert(dummyRoom)
    .select();

  if (error) {
    console.error('❌ FALLÓ EL ARREGLO:');
    console.error(`   Mensaje: ${error.message}`);
  } else {
    console.log('✅ ¡FUNCIONÓ! Si enviamos el "name", la base de datos lo acepta.');
    console.log('   Podemos arreglar el código sin pedirle al usuario que toque SQL.');
    
    // Limpiar
    await supabase.from('rooms').delete().eq('id', 9999);
  }
}

runTest();
