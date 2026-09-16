/**
 * SSS Reset Kit — Permissions Configuration
 *
 * Defines the permission model for current users and
 * prepares the structure for future staff/clinician access.
 */

export type UserRole = 'USER' | 'STAFF' | 'ADMIN';

export type StaffPermission =
    | 'VIEW_USERS'
    | 'VIEW_ALERTS'
    | 'ACKNOWLEDGE_ALERT'
    | 'RESOLVE_ALERT'
    | 'VIEW_SESSIONS'
    | 'VIEW_CHECK_INS'
    | 'MANAGE_GROUP';

/**
 * Current mobile user can only access their own data.
 * This is enforced server-side via Row Level Security.
 */
export const USER_PERMISSIONS = {
    canAccessOwnProfile: true,
    canAccessOwnResetPlan: true,
    canAccessOwnContacts: true,
    canAccessOwnSessions: true,
    canAccessOwnCheckIns: true,
    canSubmitCheckIn: true,
    canCreateDistressAlert: true,
} as const;

/**
 * Future staff permissions — prepared but not implemented
 * in the mobile user application.
 */
export const DEFAULT_STAFF_PERMISSIONS: StaffPermission[] = [];

export interface StaffAccessScope {
    organisationId: string;
    groupIds: string[];
}
