import { type CheckIn, type ResetSession, type DistressAlert } from '@shared/types';
import * as Network from 'expo-network';

// -------------------------------------------------------------
// ADAPTER PATTERN 
// This cleanly separates the UI layer from the Backend logic.
// Once Supabase is ready, we swap the Mock implementation 
// below for the real Supabase implementation right here.
// -------------------------------------------------------------

export interface BackendAdapter {
    createSession(session: Partial<ResetSession>): Promise<ResetSession>;
    updateSession(sessionId: string, updates: Partial<ResetSession>): Promise<void>;
    submitCheckIn(checkIn: CheckIn): Promise<void>;
    logDistressAlert(alert: Partial<DistressAlert>): Promise<void>;
}

// -------------------------------------------------------------
// DEVELOPMENT ADAPTER (MOCK)
// Simulates network latency and failure gracefully.
// -------------------------------------------------------------

class MockSupabaseAdapter implements BackendAdapter {
    private async simulateNetwork() {
        const network = await Network.getNetworkStateAsync();
        if (!network.isConnected) {
            throw new Error('No network connection');
        }
        // simulate latency
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    async createSession(session: Partial<ResetSession>): Promise<ResetSession> {
        await this.simulateNetwork();
        console.log('[MOCK BACKEND] Created Session:', session.id);
        return session as ResetSession;
    }

    async updateSession(sessionId: string, updates: Partial<ResetSession>): Promise<void> {
        await this.simulateNetwork();
        console.log('[MOCK BACKEND] Updated Session:', sessionId, updates);
    }

    async submitCheckIn(checkIn: CheckIn): Promise<void> {
        await this.simulateNetwork();
        console.log('[MOCK BACKEND] Submitted Check In:', checkIn.id, 'SUDS:', checkIn.sudsRating);
    }

    async logDistressAlert(alert: Partial<DistressAlert>): Promise<void> {
        await this.simulateNetwork();
        console.log('[MOCK BACKEND] Logged Distress Alert:', alert.checkInId);
    }
}

export const api: BackendAdapter = new MockSupabaseAdapter();
