/**
 * SSS Reset Kit — Design Tokens
 *
 * 4px / 8px spacing system, brand palette, typography config.
 * Source of truth for all visual constants.
 */

export const colors = {
    // Primary brand
    deepNavy: '#0C3F6B',
    secondaryBlue: '#125B8F',

    // Stage colors
    softenTeal: '#2DAEAA',
    stabiliseBlue: '#125B8F',
    stepForwardCoral: '#F16A3D',

    // Backgrounds
    mainBackground: '#F7FAF9',
    warmSurface: '#FCFBF8',
    cardBackground: '#FFFFFF',

    // Borders & text
    softBorder: '#DCE7EA',
    secondaryText: '#687B87',
    primaryText: '#0C3F6B',

    // Soft tints
    softTeal: '#EAF7F5',
    softBlue: '#EDF4F8',
    softCoral: '#FFF1EB',

    // SUDS zone colors
    calmGreen: '#A9DCC5',
    risingYellow: '#F5DE83',
    highOrange: '#F4B46A',
    crisisRed: '#D95A67',

    // Functional
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    error: '#D95A67',
    success: '#2DAEAA',
    warning: '#F4B46A',

    // Overlays
    overlay: 'rgba(12, 63, 107, 0.5)',
    overlayLight: 'rgba(12, 63, 107, 0.1)',
} as const;

export const spacing = {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 56,
    '6xl': 64,
} as const;

export const radii = {
    sm: 8,
    button: 14,
    card: 16,
    lg: 20,
    xl: 24,
    full: 9999,
} as const;

export const typography = {
    // Emotional / reflective headings
    serif: {
        fontFamily: 'SourceSerif4-Regular',
    },
    serifMedium: {
        fontFamily: 'SourceSerif4-SemiBold',
    },
    serifBold: {
        fontFamily: 'SourceSerif4-Bold',
    },

    // Functional text
    sans: {
        fontFamily: 'Manrope-Regular',
    },
    sansMedium: {
        fontFamily: 'Manrope-Medium',
    },
    sansSemiBold: {
        fontFamily: 'Manrope-SemiBold',
    },
    sansBold: {
        fontFamily: 'Manrope-Bold',
    },
    sansExtraBold: {
        fontFamily: 'Manrope-ExtraBold',
    },
} as const;

export const fontSizes = {
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 32,
    '4xl': 36,
    '5xl': 40,
} as const;

export const lineHeights = {
    tight: 1.2,
    base: 1.4,
    relaxed: 1.6,
    loose: 1.8,
} as const;

/** Minimum interactive target per spec: 44×44pt */
export const MIN_TOUCH_TARGET = 44;

export const shadows = {
    sm: {
        shadowColor: colors.deepNavy,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
    },
    md: {
        shadowColor: colors.deepNavy,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
} as const;

// Stage accent helpers
export const stageAccent = {
    SOFTEN: colors.softenTeal,
    STABILISE: colors.stabiliseBlue,
    STEP_FORWARD: colors.stepForwardCoral,
} as const;
