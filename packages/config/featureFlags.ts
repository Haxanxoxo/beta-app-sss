/**
 * SSS Reset Kit — Feature Flags
 */

export const FEATURE_FLAGS = {
    /** Staff Guidance content section in mobile app */
    ENABLE_STAFF_GUIDANCE: true,
    /** Push notifications (not implemented in this build) */
    ENABLE_PUSH_NOTIFICATIONS: false,
    /** Email alerts (not implemented — future staff system) */
    ENABLE_EMAIL_ALERTS: false,
    /** SMS alerts (not implemented — future staff system) */
    ENABLE_SMS_ALERTS: false,
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
    return FEATURE_FLAGS[flag];
}
