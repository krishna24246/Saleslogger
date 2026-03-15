import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Visit } from '../types';

interface AppState {
  user: string | null;
  visits: Visit[];
  login: (email: string) => void;
  logout: () => void;
  addVisit: (visit: Visit) => void;
  updateVisit: (id: string, updated: Partial<Visit>) => void;
  deleteVisit: (id: string) => void;
  syncAll: () => Promise<void>;
  retrySync: (id: string) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      visits: [],
      login: (email) => set({ user: email }),
      logout: () => set({ user: null }), 
      addVisit: (visit) => set((state) => ({ visits: [...state.visits, visit] })),
      updateVisit: (id, updated) => set((state) => ({
        visits: state.visits.map((v) => v.id === id ? { ...v, ...updated } : v)
      })),
      deleteVisit: (id) => set((state) => ({
        visits: state.visits.filter((v) => v.id !== id)
      })),
      syncAll: async () => {
        const { visits, updateVisit } = get();
        const unsynced = visits.filter(v => ['Draft', 'Failed'].includes(v.syncStatus));
        for (const v of unsynced) {
           updateVisit(v.id, { syncStatus: 'Syncing' });
           await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
           const isSuccess = Math.random() > 0.2;
           updateVisit(v.id, { syncStatus: isSuccess ? 'Synced' : 'Failed' });
        }
      },
      retrySync: async (id) => {
        const { updateVisit } = get();
        updateVisit(id, { syncStatus: 'Syncing' });
        await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
        updateVisit(id, { syncStatus: 'Synced' });
      }
    }),
    {
      name: 'sales-logger-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
