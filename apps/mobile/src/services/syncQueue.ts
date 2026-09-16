import { useSyncStore } from '../store/syncStore';
import { api } from './api';
import * as Network from 'expo-network';

/**
 * Iterates through the offline queue and attempts to process tasks.
 * Applies basic idempotency by allowing the API to handle duplicated IDs safely.
 */
export async function processSyncQueue() {
    const state = useSyncStore.getState();

    // Don't run multiple sync loops simultaneously
    if (state.isSyncing || state.queue.length === 0) return;

    const network = await Network.getNetworkStateAsync();
    if (!network.isConnected) return; // Still offline

    state.setSyncing(true);

    // Process in order (FIFO)
    for (const task of state.queue) {
        if (task.status === 'FAILED' && task.retryCount > 3) {
            continue; // Skip repeatedly failing tasks for now
        }

        try {
            switch (task.type) {
                case 'CREATE_SESSION':
                    await api.createSession(task.payload);
                    break;
                case 'UPDATE_SESSION':
                    await api.updateSession(task.payload.sessionId, task.payload.updates);
                    break;
                case 'SUBMIT_CHECK_IN':
                    await api.submitCheckIn(task.payload);
                    break;
                case 'LOG_ALERT':
                    await api.logDistressAlert(task.payload);
                    break;
            }

            // If successful, remove from queue
            state.removeTask(task.id);

        } catch (error) {
            console.warn(`[SYNC ERROR] Task ${task.type} failed:`, error);
            state.incrementRetry(task.id);

            // If we're offline suddenly, abort the loop
            const checkNetwork = await Network.getNetworkStateAsync();
            if (!checkNetwork.isConnected) break;
        }
    }

    state.setSyncing(false);
}
