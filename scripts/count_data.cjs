
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
  console.log('--- CONTEO FINAL DE DATOS ---');
  
  const { count: roomCount } = await supabase
    .from('rooms')
    .select('*', { count: 'exact', head: true });
    
  console.log(`🏠 Salas en Base de Datos: ${roomCount}`);

  const { data: settings } = await supabase
    .from('app_settings')
    .select('content')
    .single();

  if (settings && settings.content && settings.content.accounts) {
    console.log(`👥 Usuarios en Base de Datos: ${settings.content.accounts.length}`);
  } else {
    console.log('👥 Usuarios en Base de Datos: 0 (o no encontrados en settings)');
  }
}

runTest();
