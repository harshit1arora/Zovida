import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  time: string;
  days: string[];
  isActive: boolean;
}

interface ReminderStore {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'isActive'>) => void;
  removeReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
}

export const useReminderStore = create<ReminderStore>()(
  persist(
    (set) => ({
      reminders: [],
      addReminder: (reminder) => set((state) => ({
        reminders: [
          ...state.reminders,
          {
            ...reminder,
            id: Math.random().toString(36).substring(7),
            isActive: true,
          },
        ],
      })),
      removeReminder: (id) => set((state) => ({
        reminders: state.reminders.filter((r) => r.id !== id),
      })),
      toggleReminder: (id) => set((state) => ({
        reminders: state.reminders.map((r) =>
          r.id === id ? { ...r, isActive: !r.isActive } : r
        ),
      })),
      updateReminder: (id, updates) => set((state) => ({
        reminders: state.reminders.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        ),
      })),
    }),
    {
      name: 'zovida-reminders',
    }
  )
);
