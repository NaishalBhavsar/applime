import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { syncQueuedData } from '../utils/SyncUtils';

interface User {
  email: string;
  role: 'operator' | 'supervisor';
  jwt: string;
}

interface Machine {
  id: string;
  name: string;
  type: string;
  status: 'RUN' | 'IDLE' | 'OFF';
}

interface DowntimeEvent {
  id: string;
  machineId: string;
  startTime: string;
  endTime?: string;
  reason: string;
  photo?: string; // Base64
  tenantId: string;
}

interface MaintenanceItem {
  id: string;
  machineId: string;
  title: string;
  dueDate: string;
  status: 'due' | 'overdue' | 'done';
  notes?: string;
  tenantId: string;
}

interface Alert {
  id: string;
  ts: string;
  machineId: string;
  rule: string;
  severity: string;
  msg: string;
  status: 'created' | 'acknowledged' | 'cleared';
  acknowledgedBy?: string;
  clearedBy?: string;
  tenantId: string;
}

interface QueueItem {
  id: string;
  type: 'downtime' | 'maintenance';
  data: any;
  timestamp: string;
}

interface Store {
  isLoggedIn: boolean;
  user: User | null;
  machines: Machine[];
  downtimeEvents: DowntimeEvent[];
  maintenanceItems: MaintenanceItem[];
  alerts: Alert[];
  queue: QueueItem[];
  pendingCount: number;
  login: (email: string, role: 'operator' | 'supervisor') => void;
  logout: () => void;
  updateMachineStatus: (id: string, status: Machine['status']) => void;
  addDowntime: (event: DowntimeEvent) => void;
  updateMaintenance: (item: MaintenanceItem) => void;
  acknowledgeAlert: (id: string, email: string) => void;
  clearAlert: (id: string, email: string) => void;
  addToQueue: (item: QueueItem) => void;
  sync: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      machines: [
        { id: 'M-101', name: 'Cutter 1', type: 'cutter', status: 'RUN' },
        { id: 'M-102', name: 'Roller A', type: 'roller', status: 'IDLE' },
        { id: 'M-103', name: 'Packing West', type: 'packer', status: 'OFF' },
      ],
      downtimeEvents: [],
      maintenanceItems: [
        { id: '1', machineId: 'M-101', title: 'Oil Change', dueDate: '2023-10-01', status: 'due', tenantId: 'default-tenant' },
        { id: '2', machineId: 'M-102', title: 'Belt Replacement', dueDate: '2023-09-30', status: 'overdue', tenantId: 'default-tenant' },
      ],
      alerts: [],
      queue: [],
      pendingCount: 0,
      login: (email, role) => set({ isLoggedIn: true, user: { email, role, jwt: 'mock-jwt-' + Date.now() } }),
      logout: () => set({ isLoggedIn: false, user: null }),
      updateMachineStatus: (id, status) => set((state) => ({
        machines: state.machines.map(m => m.id === id ? { ...m, status } : m),
      })),
      addDowntime: (event) => set((state) => ({
        downtimeEvents: [...state.downtimeEvents, event],
        queue: [...state.queue, { id: event.id, type: 'downtime', data: event, timestamp: new Date().toISOString() }],
        pendingCount: state.pendingCount + 1,
      })),
      updateMaintenance: (item) => set((state) => ({
        maintenanceItems: state.maintenanceItems.map(m => m.id === item.id ? item : m),
        queue: [...state.queue, { id: item.id, type: 'maintenance', data: item, timestamp: new Date().toISOString() }],
        pendingCount: state.pendingCount + 1,
      })),
      acknowledgeAlert: (id, email) => set((state) => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, status: 'acknowledged', acknowledgedBy: email } : a),
      })),
      clearAlert: (id, email) => set((state) => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, status: 'cleared', clearedBy: email } : a),
      })),
      addToQueue: (item) => set((state) => ({
        queue: [...state.queue, item],
        pendingCount: state.pendingCount + 1,
      })),
      sync: async () => {
        const { queue } = get();
        if (queue.length === 0) return;
        const state = await NetInfo.fetch();
        if (!state.isConnected) return;
        await syncQueuedData(queue, get().user?.email || '');
        set({ queue: [], pendingCount: 0 });
      },
    }),
    {
      name: 'field-app-storage',
      getStorage: () => AsyncStorage,
    }
  )
);

// Auto-sync on connectivity
NetInfo.addEventListener(state => {
  if (state.isConnected) {
    useStore.getState().sync();
  }
});
