/**
 * SSS Reset Kit — Shared Data Models
 *
 * TypeScript types matching the database schema.
 * Used by both mobile app and future staff dashboard.
 */

import type { SudsCategory } from '../config/sudsConfig';

// ─── Organisation & Group ───────────────────────────────

export interface Organisation {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Group {
    id: string;
    organisationId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

// ─── User ───────────────────────────────────────────────

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
    id: string;
    email: string;
    displayName: string;
    organisationId: string;
    groupId: string;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile {
    userId: string;
    pinConfigured: boolean;
    preferences: Record<string, unknown>;
    accessibilityPreferences: {
        reducedMotion?: boolean;
        largeText?: boolean;
    };
}

// ─── Reset Plan ─────────────────────────────────────────

export interface ResetPlan {
    id: string;
    userId: string;
    earlyWarningSigns: string;
    triggers: string;
    thingsThatMakeItWorse: string;
    helpfulWords: string;
    preferredSupports: string;
    updatedAt: string;
}

// ─── Support Contact ────────────────────────────────────

export type SupportContactType = 'TRUSTED_PERSON' | 'WORKER';

export interface SupportContact {
    id: string;
    userId: string;
    type: SupportContactType;
    name: string;
    serviceName?: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
}

// ─── Reset Session ──────────────────────────────────────

export type ResetSessionStatus =
    | 'IDLE'
    | 'INITIAL_CHECK_IN'
    | 'SOFTEN'
    | 'STABILISE'
    | 'FOLLOW_UP_CHECK_IN'
    | 'STEP_FORWARD'
    | 'COMPLETED'
    | 'SUPPORT_INTERRUPTION';

export interface ResetSession {
    id: string;
    userId: string;
    status: ResetSessionStatus;
    startedAt: string;
    completedAt?: string;
    selectedNextStep?: string;
    createdAt: string;
    updatedAt: string;
}

// ─── Check In ───────────────────────────────────────────

export type CheckInType = 'INITIAL' | 'FOLLOW_UP';

export interface CheckIn {
    id: string;
    sessionId: string;
    userId: string;
    type: CheckInType;
    sequence: number;
    sudsRating: number;
    sudsCategory: SudsCategory;
    sensations: string[];
    submittedAt: string;
}

// ─── Soften Selection ───────────────────────────────────

export interface SoftenSelection {
    id: string;
    sessionId: string;
    option: string;
    isCustom: boolean;
    createdAt: string;
}

// ─── Stabilise Attempt ──────────────────────────────────

export interface StabiliseAttempt {
    id: string;
    sessionId: string;
    strategy: string;
    isCustom: boolean;
    selectedAt: string;
    completedAt?: string;
}

// ─── Next Step ──────────────────────────────────────────

export interface NextStep {
    id: string;
    sessionId: string;
    value: string;
    isCustom: boolean;
}

// ─── Distress Alert ─────────────────────────────────────

export type AlertStatus = 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface DistressAlert {
    id: string;
    organisationId: string;
    groupId: string;
    userId: string;
    checkInId: string;
    sessionId: string;
    sudsRating: number;
    sudsCategory: SudsCategory;
    checkInType: CheckInType;
    status: AlertStatus;
    createdAt: string;
    acknowledgedAt?: string;
    acknowledgedBy?: string;
    resolvedAt?: string;
    resolvedBy?: string;
}

// ─── Audit Event ────────────────────────────────────────

export type ActorType = 'USER' | 'STAFF' | 'SYSTEM';

export interface AuditEvent {
    id: string;
    actorId: string;
    actorType: ActorType;
    action: string;
    entityType: string;
    entityId: string;
    timestamp: string;
}

// ─── Future Staff Types (schema only) ───────────────────

export type StaffRole = 'CLINICIAN' | 'TEAM_LEAD' | 'ADMIN';
export type StaffStatus = 'ACTIVE' | 'INACTIVE';

export interface StaffUser {
    id: string;
    organisationId: string;
    name: string;
    role: StaffRole;
    status: StaffStatus;
    createdAt: string;
}

export interface StaffGroupAccess {
    staffUserId: string;
    groupId: string;
}
