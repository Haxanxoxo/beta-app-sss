export { SUDS_MIN, SUDS_MAX, SUDS_STEP, SUDS_DECIMAL_PLACES, SUDS_THRESHOLDS, ALERT_THRESHOLD, getSudsCategory, shouldCreateAlert, SUDS_CATEGORY_COLORS, SUDS_ZONE_COLORS } from './sudsConfig';
export type { SudsCategory } from './sudsConfig';

export { CATEGORY_GUIDANCE, PRESET_SOFTEN_OPTIONS, PRESET_STABILISE_STRATEGIES, PRESET_NEXT_STEPS, CLINICAL_CONTENT, STAFF_GUIDANCE_SECTIONS } from './resetGuidance';
export type { CategoryGuidance, SoftenOption, StabiliseStrategy, NextStepOption, ClinicalContentEntry, StaffGuidanceSection } from './resetGuidance';

export { EMERGENCY_CONTACTS, EMERGENCY_CONTACTS_DISPLAY } from './emergencyContacts';
export type { EmergencyContact } from './emergencyContacts';

export { FEATURE_FLAGS, isFeatureEnabled } from './featureFlags';
export type { FeatureFlagKey } from './featureFlags';

export { USER_PERMISSIONS } from './permissions';
export type { UserRole, StaffPermission, StaffAccessScope } from './permissions';
