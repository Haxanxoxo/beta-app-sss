import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    type CheckIn,
    type ResetSession,
    type ResetSessionStatus,
    type SoftenSelection,
    type StabiliseAttempt,
    type NextStep
} from '@shared/types';
import { getSudsCategory, shouldCreateAlert } from '@config/sudsConfig';
import { useSyncStore } from './syncStore';

// Temporary mock UUID for the current user
export const MOCK_USER_ID = 'c1000000-0000-0000-0000-000000000001';

interface ResetEngineState {
    // Session
    currentSession: Partial<ResetSession> | null;
    checkIns: CheckIn[];
    softenSelections: SoftenSelection[];
    stabiliseAttempts: StabiliseAttempt[];
    nextSteps: NextStep[];

    // Transient UI state (NOT persisted)
    currentSudsValue: number;
    selectedSensations: string[];

    // Actions
    startNewSession: () => void;
    resumeSession: (session: ResetSession, checkIns: CheckIn[]) => void;
    setSudsValue: (value: number) => void;
    addSensations: (sensations: string[]) => void;
    submitInitialCheckIn: () => void;
    submitFollowUpCheckIn: () => void;
    markSoftenComplete: (selections: SoftenSelection[]) => void;
    markStabiliseAttempted: (strategyId: string, isCustom: boolean) => void;
    markStabiliseCompleted: (strategyId: string) => void;
    submitNextSteps: (steps: NextStep[]) => void;
    completeSession: () => void;
    resetEngine: () => void;
}

export const useResetEngine = create<ResetEngineState>()(
    persist(
        (set, get) => ({
            currentSession: null,
            checkIns: [],
            softenSelections: [],
            stabiliseAttempts: [],
            nextSteps: [],
            currentSudsValue: 0,
            selectedSensations: [],

            startNewSession: () => {
                const sessionId = `temp_sess_${Date.now()}`;
                const newSession = {
                    id: sessionId,
                    userId: MOCK_USER_ID,
                    status: 'INITIAL_CHECK_IN' as ResetSessionStatus,
                    startedAt: new Date().toISOString(),
                };

                useSyncStore.getState().addTask('CREATE_SESSION', newSession);

                set({
                    currentSession: newSession,
                    checkIns: [],
                    softenSelections: [],
                    stabiliseAttempts: [],
                    nextSteps: [],
                    currentSudsValue: 0,
                    selectedSensations: [],
                });
            },

            resumeSession: (session, checkIns) => {
                set({
                    currentSession: session,
                    checkIns,
                    currentSudsValue: checkIns.length > 0 ? checkIns[checkIns.length - 1].sudsRating : 0,
                    selectedSensations: [],
                });
            },

            setSudsValue: (value) => {
                set({ currentSudsValue: value });
            },

            addSensations: (sensations) => {
                set({ selectedSensations: sensations });
            },

            submitInitialCheckIn: () => {
                const { currentSession, currentSudsValue, selectedSensations, checkIns } = get();
                if (!currentSession) return;

                const category = getSudsCategory(currentSudsValue);

                let nextStatus: ResetSessionStatus = 'COMPLETED';
                if (category === 'CALM') nextStatus = 'STEP_FORWARD';
                else if (category === 'RISING') nextStatus = 'SOFTEN';
                else if (category === 'HIGH') nextStatus = 'STABILISE';
                else if (category === 'CRISIS') nextStatus = 'SUPPORT_INTERRUPTION';

                const newCheckIn: CheckIn = {
                    id: `temp_ci_${Date.now()}`,
                    sessionId: currentSession.id as string,
                    userId: MOCK_USER_ID,
                    type: 'INITIAL',
                    sequence: 1,
                    sudsRating: currentSudsValue,
                    sudsCategory: category,
                    sensations: selectedSensations,
                    submittedAt: new Date().toISOString(),
                };

                const updatedSession = {
                    ...currentSession,
                    status: nextStatus as ResetSessionStatus,
                };

                useSyncStore.getState().addTask('SUBMIT_CHECK_IN', newCheckIn);
                useSyncStore.getState().addTask('UPDATE_SESSION', { sessionId: currentSession.id, updates: updatedSession });

                // Fire alert for HIGH and CRISIS per shouldCreateAlert config
                if (shouldCreateAlert(currentSudsValue)) {
                    useSyncStore.getState().addTask('LOG_ALERT', {
                        sessionId: currentSession.id,
                        checkInId: newCheckIn.id,
                        category,
                        rating: currentSudsValue,
                    });
                }

                set({
                    checkIns: [...checkIns, newCheckIn],
                    currentSession: updatedSession,
                    selectedSensations: [],
                });
            },

            submitFollowUpCheckIn: () => {
                const { currentSession, currentSudsValue, selectedSensations, checkIns } = get();
                if (!currentSession) return;

                const category = getSudsCategory(currentSudsValue);

                let nextStatus: ResetSessionStatus = 'COMPLETED';
                if (category === 'CALM') nextStatus = 'STEP_FORWARD';
                else if (category === 'RISING') nextStatus = 'SOFTEN';
                else if (category === 'HIGH') nextStatus = 'STABILISE';
                else if (category === 'CRISIS') nextStatus = 'SUPPORT_INTERRUPTION';

                const newCheckIn: CheckIn = {
                    id: `temp_ci_${Date.now()}`,
                    sessionId: currentSession.id as string,
                    userId: MOCK_USER_ID,
                    type: 'FOLLOW_UP',
                    sequence: checkIns.length + 1,
                    sudsRating: currentSudsValue,
                    sudsCategory: category,
                    sensations: selectedSensations,
                    submittedAt: new Date().toISOString(),
                };

                const updatedSession = {
                    ...currentSession,
                    status: nextStatus as ResetSessionStatus,
                };

                useSyncStore.getState().addTask('SUBMIT_CHECK_IN', newCheckIn);
                useSyncStore.getState().addTask('UPDATE_SESSION', { sessionId: currentSession.id, updates: updatedSession });

                // Fire alert for HIGH and CRISIS per shouldCreateAlert config
                if (shouldCreateAlert(currentSudsValue)) {
                    useSyncStore.getState().addTask('LOG_ALERT', {
                        sessionId: currentSession.id,
                        checkInId: newCheckIn.id,
                        category,
                        rating: currentSudsValue,
                    });
                }

                set({
                    checkIns: [...checkIns, newCheckIn],
                    currentSession: updatedSession,
                    selectedSensations: [],
                });
            },

            markSoftenComplete: (selections) => {
                const { currentSession } = get();
                if (!currentSession) return;

                set({
                    softenSelections: selections,
                    currentSession: {
                        ...currentSession,
                        status: 'STABILISE',
                    },
                });
            },

            markStabiliseAttempted: (strategyId, isCustom) => {
                const { stabiliseAttempts, currentSession } = get();
                if (!currentSession) return;

                if (stabiliseAttempts.some(a => a.strategy === strategyId)) return;

                const attempt: StabiliseAttempt = {
                    id: `temp_sta_${Date.now()}`,
                    sessionId: currentSession.id as string,
                    strategy: strategyId,
                    isCustom,
                    selectedAt: new Date().toISOString(),
                };

                set({ stabiliseAttempts: [...stabiliseAttempts, attempt] });
            },

            markStabiliseCompleted: (strategyId) => {
                const { stabiliseAttempts } = get();
                const updated = stabiliseAttempts.map(a =>
                    a.strategy === strategyId
                        ? { ...a, completedAt: new Date().toISOString() }
                        : a
                );

                set({ stabiliseAttempts: updated });
            },

            submitNextSteps: (steps) => {
                set({ nextSteps: steps });
            },

            completeSession: () => {
                const { currentSession, nextSteps } = get();
                if (!currentSession) return;

                const updatedSession = {
                    ...currentSession,
                    status: 'COMPLETED' as ResetSessionStatus,
                    completedAt: new Date().toISOString(),
                    selectedNextStep: nextSteps[0]?.value || undefined,
                };

                useSyncStore.getState().addTask('UPDATE_SESSION', { sessionId: currentSession.id, updates: updatedSession });

                set({ currentSession: updatedSession });
            },

            resetEngine: () => {
                set({
                    currentSession: null,
                    checkIns: [],
                    softenSelections: [],
                    stabiliseAttempts: [],
                    nextSteps: [],
                    currentSudsValue: 0,
                    selectedSensations: [],
                });
            },
        }),
        {
            name: 'sss-reset-engine',
            storage: createJSONStorage(() => AsyncStorage),
            // Only persist session data — transient UI values (suds slider, sensations) reset fresh each time
            partialize: (state) => ({
                currentSession: state.currentSession,
                checkIns: state.checkIns,
                softenSelections: state.softenSelections,
                stabiliseAttempts: state.stabiliseAttempts,
                nextSteps: state.nextSteps,
            }),
        }
    )
);
