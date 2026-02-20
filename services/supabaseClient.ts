
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | any = null;

if (supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Error al inicializar Supabase:', error);
    supabaseInstance = createDummyClient();
  }
} else {
  console.warn('Faltan variables de entorno de Supabase o son inválidas. La persistencia en la nube no funcionará.');
  supabaseInstance = createDummyClient();
}

function createDummyClient() {
  const errorResponse = { data: null, error: { message: 'Supabase no configurado (Variables de entorno faltantes o inválidas)' } };

  // Helper to create a chainable proxy that mocks the PostgrestBuilder
  const createBuilder = () => {
    return new Proxy({} as any, {
      get: (target, prop) => {
        // If awaited, return the error response
        if (prop === 'then') {
           return (resolve: any) => resolve(errorResponse);
        }
        // Allow chaining for any method (select, order, eq, single, etc.)
        return (...args: any[]) => createBuilder();
      }
    });
  };

  return {
    from: (table: string) => createBuilder(),
    rpc: (fn: string) => createBuilder(),
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => errorResponse,
      signOut: async () => errorResponse,
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    storage: {
        from: () => createBuilder()
    }
  } as any;
}

export const supabase = supabaseInstance;
