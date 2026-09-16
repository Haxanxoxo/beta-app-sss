/**
 * SSS Reset Kit — SUDS (Subjective Units of Distress Scale) Configuration
 *
 * SINGLE SOURCE OF TRUTH for all SUDS-related thresholds,
 * categories, and display constants. Never duplicate these
 * values elsewhere in the application.
 */

// ─── Scale ──────────────────────────────────────────────
export const SUDS_MIN = 0;
export const SUDS_MAX = 10;
export const SUDS_STEP = 0.5;
export const SUDS_DECIMAL_PLACES = 1;

// ─── Category Thresholds ────────────────────────────────
// CALM:    0  to < 3
// RISING:  3  to < 6
// HIGH:    6  to < 8
// CRISIS:  8  to  10
export const SUDS_THRESHOLDS = {
  CALM_MAX: 3,     // exclusive upper bound
  RISING_MAX: 6,   // exclusive upper bound
  HIGH_MAX: 8,     // exclusive upper bound
  CRISIS_MAX: 10,  // inclusive upper bound (= SUDS_MAX)
} as const;

// ─── Alert Threshold ────────────────────────────────────
/** Ratings at or above this value trigger a DistressAlert */
export const ALERT_THRESHOLD = 6;

// ─── Category Enum ──────────────────────────────────────
export type SudsCategory = 'CALM' | 'RISING' | 'HIGH' | 'CRISIS';

/**
 * Determine the SUDS category for a given rating.
 * The rating must be between SUDS_MIN and SUDS_MAX inclusive.
 */
export function getSudsCategory(rating: number): SudsCategory {
  if (rating < SUDS_THRESHOLDS.CALM_MAX) return 'CALM';
  if (rating < SUDS_THRESHOLDS.RISING_MAX) return 'RISING';
  if (rating < SUDS_THRESHOLDS.HIGH_MAX) return 'HIGH';
  return 'CRISIS';
}

/**
 * Determine whether a submitted rating should generate a DistressAlert.
 */
export function shouldCreateAlert(rating: number): boolean {
  return rating >= ALERT_THRESHOLD;
}

// ─── Category Display Colors ────────────────────────────
export const SUDS_CATEGORY_COLORS: Record<SudsCategory, { bg: string; text: string; accent: string }> = {
  CALM: {
    bg: '#EAF7F5',
    text: '#2DAEAA',
    accent: '#A9DCC5',
  },
  RISING: {
    bg: '#FFF8E1',
    text: '#C89B2A',
    accent: '#F5DE83',
  },
  HIGH: {
    bg: '#FFF1EB',
    text: '#D48A4C',
    accent: '#F4B46A',
  },
  CRISIS: {
    bg: '#FDE8EA',
    text: '#D95A67',
    accent: '#D95A67',
  },
};

// ─── Zone Colors for the SUDS Curve ─────────────────────
export const SUDS_ZONE_COLORS = {
  CALM: '#A9DCC5',
  RISING: '#F5DE83',
  HIGH: '#F4B46A',
  CRISIS: '#D95A67',
} as const;
