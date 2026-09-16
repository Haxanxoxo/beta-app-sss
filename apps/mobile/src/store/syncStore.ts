import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SyncActionType = 'CREATE_SESSION' | 'UPDATE_SESSION' | 'SUBMIT_CHECK_IN' | 'LOG_ALERT';

export interface SyncTask {
    id: string; // unique ID for the task itself
    type: SyncActionType;
    payload: any;
    createdAt: string;
    retryCount: number;
    status: 'PENDING' | 'FAILED';
}

interface SyncStoreState {
    queue: SyncTask[];
    isSyncing: boolean;
    addTask: (type: SyncActionType, payload: any) => void;
    removeTask: (taskId: string) => void;
    setSyncing: (isSyncing: boolean) => void;
    incrementRetry: (taskId: string) => void;
    markTaskFailed: (taskId: string) => void;
    clearQueue: () => void;
}

export const useSyncStore = create<SyncStoreState>()(
    persist(
        (set, get) => ({
            queue: [],
            isSyncing: false,

            addTask: (type, payload) => {
                const newTask: SyncTask = {
                    id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    type,
                    payload,
                    createdAt: new Date().toISOString(),
                    retryCount: 0,
                    status: 'PENDING',
                };

                set((state) => ({
                    queue: [...state.queue, newTask],
                }));
            },

            removeTask: (taskId) => {
                set((state) => ({
                    queue: state.queue.filter((task) => task.id !== taskId),
                }));
            },

            setSyncing: (isSyncing) => {
                set({ isSyncing });
            },

            incrementRetry: (taskId) => {
                set((state) => ({
                    queue: state.queue.map((task) =>
                        task.id === taskId
                            ? { ...task, retryCount: task.retryCount + 1 }
                            : task
                    ),
                }));
            },

            markTaskFailed: (taskId) => {
                set((state) => ({
                    queue: state.queue.map((task) =>
                        task.id === taskId
                            ? { ...task, status: 'FAILED' }
                            : task
                    ),
                }));
            },

            clearQueue: () => {
                set({ queue: [] });
            }
        }),
        {
            name: 'sss-sync-queue',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
