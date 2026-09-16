/**
 * SSS Reset Kit — Reset Guidance Configuration
 *
 * All user-facing copy for the SUDS categories, the three stages,
 * and the recommended actions. Copy marked as "approved" must be
 * preserved exactly — see spec § COPY AND CONTENT FIDELITY.
 */

import type { SudsCategory } from './sudsConfig';

// ─── Per-Category Guidance ──────────────────────────────

export interface CategoryGuidance {
    category: SudsCategory;
    label: string;
    explanation: string;
    recommendationHeading: string;
    recommendation: string;
    guidanceLabels: string[];
    primaryActionLabel: string;
    route: 'STEP_FORWARD' | 'SOFTEN' | 'STABILISE' | 'SUPPORT';
}

export const CATEGORY_GUIDANCE: Record<SudsCategory, CategoryGuidance> = {
    CALM: {
        category: 'CALM',
        label: 'CALM',
        explanation: 'Maintain what is helping, or choose a gentle reset.',
        recommendationHeading: 'Recommended for Calm',
        recommendation: 'Maintain steadiness with mindful awareness and recovery supports.',
        guidanceLabels: ['MINDFUL', 'PLEASE'],
        primaryActionLabel: 'Choose a gentle next step',
        route: 'STEP_FORWARD',
    },
    RISING: {
        category: 'RISING',
        label: 'RISING',
        explanation: 'Something is building. Let\u2019s soften first, then find some steadiness.',
        recommendationHeading: 'Recommended for Rising',
        recommendation: 'Pause, validate the feeling, then use FACTS or GROUND.',
        guidanceLabels: ['STOP', 'FACTS', 'GROUND'],
        primaryActionLabel: 'Start with Soften',
        route: 'SOFTEN',
    },
    HIGH: {
        category: 'HIGH',
        label: 'HIGH',
        explanation: 'This feels strong. Reduce demands and choose one stabilising support.',
        recommendationHeading: 'Recommended for High',
        recommendation: 'Reduce demands and use TIP, grounding, breathing or sensory support.',
        guidanceLabels: ['TIP', 'GROUND'],
        primaryActionLabel: 'Try Stabilise',
        route: 'STABILISE',
    },
    CRISIS: {
        category: 'CRISIS',
        label: 'CRISIS',
        explanation: 'Safety comes first. Connect with a trusted person or agreed safety support now.',
        recommendationHeading: 'Recommended for Crisis',
        recommendation: 'Safety comes first. Connect with a trusted person and follow the safety plan.',
        guidanceLabels: ['CRISIS', 'SAFETY PLAN'],
        primaryActionLabel: 'Open safety supports',
        route: 'SUPPORT',
    },
};

// ─── Soften Options (§ SOFTEN — exact supplied copy) ────

export interface SoftenOption {
    id: string;
    label: string;
    isCustom: boolean;
}

export const PRESET_SOFTEN_OPTIONS: SoftenOption[] = [
    { id: 'less-noise', label: 'Less noise', isCustom: false },
    { id: 'some-space', label: 'Some space', isCustom: false },
    { id: 'someone-nearby', label: 'Someone nearby', isCustom: false },
    { id: 'comforting-words', label: 'Comforting words', isCustom: false },
];

// ─── Stabilise Strategies (§ STABILISE — exact copy) ────

export interface StabiliseStrategy {
    id: string;
    label: string;
    description: string;
    isCustom: boolean;
}

export const PRESET_STABILISE_STRATEGIES: StabiliseStrategy[] = [
    {
        id: 'slow-breathing',
        label: 'Slow my breathing',
        description: 'Breathe in gently, then make the out-breath a little longer.',
        isCustom: false,
    },
    {
        id: 'notice-five',
        label: 'Notice five things',
        description: 'Look around. Name five things you can see, without rushing.',
        isCustom: false,
    },
    {
        id: 'something-sensory',
        label: 'Use something sensory',
        description: 'Choose cool water, a textured object, music or a familiar scent.',
        isCustom: false,
    },
    {
        id: 'move-body',
        label: 'Move my body',
        description: 'Stretch, walk, shake out your hands or press your feet into the floor.',
        isCustom: false,
    },
];

// ─── Step Forward Options (§ STEP FORWARD — exact copy) ─

export interface NextStepOption {
    id: string;
    label: string;
    isCustom: boolean;
}

export const PRESET_NEXT_STEPS: NextStepOption[] = [
    { id: 'drink-snack', label: 'Have a drink or snack', isCustom: false },
    { id: 'message-someone', label: 'Message someone I trust', isCustom: false },
    { id: 'return-gently', label: 'Return gently to what I was doing', isCustom: false },
    { id: 'ask-more-time', label: 'Ask for more time', isCustom: false },
    { id: 'safer-space', label: 'Move to a safer or quieter space', isCustom: false },
];

// ─── Clinical Content Placeholders ──────────────────────
// These are configurable content slots. Only use supplied
// wording. Unknown content remains null (awaiting approved content).

export interface ClinicalContentEntry {
    key: string;
    title: string;
    content: string | null; // null = awaiting approved content
}

export const CLINICAL_CONTENT: Record<string, ClinicalContentEntry> = {
    MINDFUL: { key: 'MINDFUL', title: 'MINDFUL', content: null },
    PLEASE: { key: 'PLEASE', title: 'PLEASE', content: null },
    STOP: { key: 'STOP', title: 'STOP', content: null },
    FACTS: { key: 'FACTS', title: 'FACTS', content: null },
    GROUND: { key: 'GROUND', title: 'GROUND', content: null },
    TIP: { key: 'TIP', title: 'TIP', content: null },
    CRISIS: { key: 'CRISIS', title: 'CRISIS', content: null },
    SAFETY_PLAN: { key: 'SAFETY_PLAN', title: 'SAFETY PLAN', content: null },
};

// ─── Staff Guidance Content Shell ───────────────────────

export interface StaffGuidanceSection {
    id: string;
    title: string;
    content: string | null; // null = awaiting approved content
}

export const STAFF_GUIDANCE_SECTIONS: StaffGuidanceSection[] = [
    { id: 'overview', title: 'Overview', content: null },
    { id: 'using-suds', title: 'Using the SUDS Scale', content: null },
    { id: 'supporting-reset', title: 'Supporting a Reset', content: null },
    { id: 'safety-planning', title: 'Safety Planning', content: null },
    { id: 'contact-protocol', title: 'Contact Protocol', content: null },
];
