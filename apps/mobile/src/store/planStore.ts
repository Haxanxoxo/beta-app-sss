import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PersonalResetPlan {
    earlyWarningSigns: string;
    triggers: string;
    thingsThatMakeItWorse: string;
    helpfulWords: string;
    preferredSupports: string;
    trustedPersonName: string;
    trustedPersonPhone: string;
    workerName: string;
    workerPhone: string;
}

interface PlanStoreState {
    plan: PersonalResetPlan;
    hasSavedPlan: boolean;
    updatePlan: (updates: Partial<PersonalResetPlan>) => void;
    savePlan: (plan: PersonalResetPlan) => void;
    clearPlan: () => void;
}

const EMPTY_PLAN: PersonalResetPlan = {
    earlyWarningSigns: '',
    triggers: '',
    thingsThatMakeItWorse: '',
    helpfulWords: '',
    preferredSupports: '',
    trustedPersonName: '',
    trustedPersonPhone: '',
    workerName: '',
    workerPhone: '',
};

export const usePlanStore = create<PlanStoreState>()(
    persist(
        (set) => ({
            plan: { ...EMPTY_PLAN },
            hasSavedPlan: false,

            updatePlan: (updates) => {
                set((state) => ({
                    plan: { ...state.plan, ...updates },
                }));
            },

            savePlan: (plan) => {
                set({ plan, hasSavedPlan: true });
            },

            clearPlan: () => {
                set({ plan: { ...EMPTY_PLAN }, hasSavedPlan: false });
            },
        }),
        {
            name: 'sss-reset-plan',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
