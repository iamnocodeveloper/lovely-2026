
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
  console.log('--- DIAGNÓSTICO APP_SETTINGS ---');
  
  // 1. Check existing data
  console.log('1. Leyendo app_settings...');
  const { data: currentData, error: readError } = await supabase
    .from('app_settings')
    .select('*');
    
  if (readError) {
    console.error('❌ Error leyendo app_settings:', readError.message);
  } else {
    console.log(`✅ Leídos ${currentData.length} registros.`);
    if (currentData.length > 0) {
      console.log('   Estructura del primer registro:', Object.keys(currentData[0]));
      if (currentData[0].content) {
        const content = currentData[0].content;
        console.log('   Contenido detectado:');
        console.log('   - Accounts (Usuarios):', content.accounts ? content.accounts.length : 'NO');
        console.log('   - Snack Catalog:', content.snackCatalog ? content.snackCatalog.length : 'NO');
      } else {
        console.warn('   ⚠️ ALERTA: La columna "content" está vacía o no existe en el objeto devuelto.');
      }
    }
  }

  // 2. Try Write
  console.log('\n2. Intentando escribir en app_settings...');
  const dummySettings = {
    id: 9999,
    content: { test: 'settings_test', accounts: [] }
  };

  const { error: writeError } = await supabase
    .from('app_settings')
    .upsert(dummySettings)
    .select();

  if (writeError) {
    console.error('❌ ERROR DE ESCRITURA en app_settings:');
    console.error(`   Mensaje: ${writeError.message}`);
    console.error(`   Código: ${writeError.code}`);
  } else {
    console.log('✅ Escritura en app_settings EXITOSA.');
    await supabase.from('app_settings').delete().eq('id', 9999);
  }
}

runTest();
