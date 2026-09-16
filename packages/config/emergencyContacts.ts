/**
 * SSS Reset Kit — Emergency / Support Contacts Configuration
 *
 * Configurable rather than hardcoded throughout the app.
 * Australian defaults — change before deployment to other regions.
 */

export interface EmergencyContact {
    id: string;
    label: string;
    phone: string;
    description?: string;
    isCrisis: boolean;
}

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
    {
        id: 'emergency-000',
        label: 'Call 000',
        phone: '000',
        description: 'If you or someone else is in immediate danger, call 000.',
        isCrisis: true,
    },
    {
        id: 'kids-helpline',
        label: 'Kids Helpline',
        phone: '1800551800',
        description: undefined,
        isCrisis: false,
    },
    {
        id: 'lifeline',
        label: 'Lifeline',
        phone: '131114',
        description: undefined,
        isCrisis: false,
    },
];

/** Format phone for display: "1800 55 1800", "13 11 14" etc. */
export const EMERGENCY_CONTACTS_DISPLAY: Record<string, string> = {
    'emergency-000': '000',
    'kids-helpline': '1800 55 1800',
    'lifeline': '13 11 14',
};
