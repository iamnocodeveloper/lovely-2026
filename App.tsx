import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RoomView from './components/RoomView';
import AIConsultant from './components/AIConsultant';
import StudioRules from './components/StudioRules';
import Login from './components/Login';
import Toast, { ToastMessage } from './components/Toast';
import { AppData, ModelRoom, StudioRules as IRules, UserSession } from './types';
import { INITIAL_DATA } from './constants';
import { LogOut, X, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from './services/supabaseClient';

const STORAGE_KEY = 'webcam_studio_ai_data_v23';
const SESSION_KEY = 'webcam_studio_user_session_v23';

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    return savedSession ? JSON.parse(savedSession) : null;
  });

  const [currentView, setCurrentView] = useState<number | 'dashboard' | 'rules' | 'ai'>('dashboard');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((text: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
  }, []);

  // Initial Data Load & Migration Logic
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // 1. Try to fetch from Supabase
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('*')
          .order('id');
        
        const { data: settingsData, error: settingsError } = await supabase
          .from('app_settings')
          .select('*')
          .single();

        if (!roomsError && roomsData && roomsData.length > 0 && settingsData) {
          // DATABASE HAS DATA: Use it
          console.log('Loaded data from Supabase');
          const loadedRooms = roomsData.map(r => r.content);
          const loadedRules = settingsData.content;
          setData({ rooms: loadedRooms, rules: loadedRules });
        } else {
          // DATABASE IS EMPTY OR ERROR: Migrate from LocalStorage or use Default
          console.log('Database empty or error. Checking LocalStorage for migration...');
          
          const saved = localStorage.getItem(STORAGE_KEY);
          let initialDataToUse = INITIAL_DATA;

          if (saved) {
            console.log('Found LocalStorage data. Migrating to Supabase...');
            try {
              initialDataToUse = JSON.parse(saved);
            } catch (e) {
              console.error('Error parsing LocalStorage, using defaults');
            }
          } else {
            console.log('No LocalStorage data. Initializing Supabase with defaults...');
          }

          // Upload to Supabase (Migration)
          if (import.meta.env.VITE_SUPABASE_URL) {
             // FIX: Add 'name' to satisfy DB constraint
             const roomInserts = initialDataToUse.rooms.map(r => ({ 
               id: r.id, 
               content: r,
               name: r.name 
             }));
             const settingsInsert = { id: 1, content: initialDataToUse.rules };
 
             // We use upsert to be safe
             const { error: insertRoomsError } = await supabase.from('rooms').upsert(roomInserts);
             const { error: insertSettingsError } = await supabase.from('app_settings').upsert(settingsInsert);
 
             if (insertRoomsError || insertSettingsError) {
               console.error('Migration failed:', insertRoomsError, insertSettingsError);
               const errorMsg = insertRoomsError?.message || insertSettingsError?.message || '';
               if (errorMsg.includes('column') || errorMsg.includes('content')) {
                 addToast('Falta configurar la Base de Datos (Corre SQL)', 'error');
               } else {
                 addToast('Error migrando datos a la nube', 'error');
               }
             } else {
               console.log('Migration to Supabase successful!');
               addToast('Datos migrados a la nube exitosamente', 'success');
             }
          } else {
             console.warn('Supabase not configured, skipping migration');
          }

          setData(initialDataToUse);
        }
      } catch (err) {
        console.error('Critical error loading data:', err);
        addToast('Error cargando datos', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [addToast]);

  // Keep LocalStorage in sync as backup (optional but good for safety)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (currentUser) {
      const userExists = data.rules.accounts.some(acc => acc.id === currentUser.id);
      if (!userExists) {
        executeLogout();
        return;
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
      
      if (currentUser.role === 'model' && currentUser.roomId) {
        const exists = data.rooms.some(r => r.id === currentUser.roomId);
        if (exists) setCurrentView(currentUser.roomId);
        else setCurrentView('dashboard');
      }
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [currentUser, data.rules.accounts, data.rooms]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateRoom = async (updatedRoom: ModelRoom) => {
    // 1. Optimistic Update
    setData(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === updatedRoom.id ? { ...updatedRoom } : r)
    }));

    // 2. Persist to Supabase
    const { error } = await supabase
      .from('rooms')
      .update({ content: updatedRoom, name: updatedRoom.name })
      .eq('id', updatedRoom.id);
    
    if (error) {
      console.error('Error saving room to Supabase:', error);
      addToast('Error guardando en la nube', 'error');
    }
  };

  const updateRooms = async (updatedRooms: ModelRoom[]) => {
    // Optimistic
    setData(prev => ({ ...prev, rooms: [...updatedRooms] }));
    
    const updates = updatedRooms.map(r => ({ id: r.id, content: r }));
    const { error } = await supabase.from('rooms').upsert(updates);
    
    if (error) {
      console.error('Error saving rooms:', error);
      addToast('Error guardando cambios masivos', 'error');
    }
  };

  const updateRules = async (updatedRules: IRules) => {
    // Optimistic
    setData(prev => ({ ...prev, rules: { ...updatedRules } }));

    // Persist
    const { error } = await supabase
      .from('app_settings')
      .update({ content: updatedRules })
      .eq('id', 1);

    if (error) {
      console.error('Error saving rules:', error);
      addToast('Error guardando configuración', 'error');
    }
  };

  const executeLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
    setCurrentView('dashboard');
    sessionStorage.clear();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="text-slate-500 font-medium">Cargando estudio...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} data={data} />;
  }

  const renderContent = () => {
    const isAdmin = currentUser.role === 'admin';
    const isManager = currentUser.role === 'manager';
    
    if (currentView === 'dashboard') {
      return (isAdmin || isManager) ? <Dashboard data={data} /> : <div className="p-20 text-center text-slate-400 font-black uppercase text-xs">Acceso Restringido</div>;
    }
    if (currentView === 'rules') {
      if (!isAdmin) return <div className="p-20 text-center text-red-400 font-black uppercase text-xs">Solo Administradores</div>;
      return <StudioRules data={data} onUpdateRules={updateRules} onUpdateRooms={updateRooms} onNotify={addToast} />;
    }
    if (currentView === 'ai') {
      return (isAdmin || isManager) ? <AIConsultant data={data} /> : <div className="p-20 text-center text-slate-400 font-black uppercase text-xs">Acceso Denegado</div>;
    }
    
    const room = data.rooms.find(r => r.id === currentView);
    if (room) {
      if (currentUser.role === 'model' && currentUser.roomId !== room.id) {
        return <div className="p-20 text-center text-slate-400 font-black uppercase text-xs">Acceso Denegado</div>;
      }
      return <RoomView key={room.id} room={room} rules={data.rules} onUpdate={updateRoom} currentUser={currentUser} onNotify={addToast} />;
    }
    
    return <Dashboard data={data} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        rooms={data.rooms} 
        selectedRoomId={currentView} 
        onSelect={setCurrentView}
        currentUser={currentUser}
        onLogout={() => setShowLogoutConfirm(true)}
      />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* SISTEMA DE NOTIFICACIONES */}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast} onClose={removeToast} />
        ))}
      </div>

      {/* MODAL DE CONFIRMACIÓN DE CIERRE DE SESIÓN */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="p-8 text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-inner">
                <LogOut size={40} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">¿Cerrar Sesión?</h3>
                <p className="text-slate-500 font-medium px-4">
                  Estás a punto de salir del sistema de control de <strong>Estudio Lovelys</strong>. Tendrás que ingresar tus credenciales nuevamente.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={executeLogout}
                  className="w-full bg-red-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-200 hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Sí, cerrar sesión
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  No, cancelar
                </button>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2">
                <AlertTriangle size={12} className="text-amber-500" />
                Se perderá el acceso inmediato a las salas
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
