import { getSudsCategory, shouldCreateAlert, SUDS_MIN, SUDS_MAX, SUDS_STEP } from '@config/sudsConfig';

describe('SUDS Scale Configuration', () => {
    it('SUDS_MIN is 0.5', () => {
        expect(SUDS_MIN).toBe(0.5);
    });

    it('SUDS_MAX is 10', () => {
        expect(SUDS_MAX).toBe(10);
    });

    it('SUDS_STEP is 0.5', () => {
        expect(SUDS_STEP).toBe(0.5);
    });

    it('valid selectable values are 0.5 to 10 in 0.5 steps', () => {
        const values: number[] = [];
        for (let v = SUDS_MIN; v <= SUDS_MAX; v += SUDS_STEP) {
            values.push(Math.round(v * 10) / 10); // avoid float issues
        }
        expect(values.length).toBe(20);
        expect(values[0]).toBe(0.5);
        expect(values[values.length - 1]).toBe(10);
        expect(values).not.toContain(0);
    });
});

describe('SUDS Boundary Logic', () => {
    it('handles CALM boundaries (0.5 to <3)', () => {
        expect(getSudsCategory(0.5)).toBe('CALM');
        expect(getSudsCategory(1)).toBe('CALM');
        expect(getSudsCategory(2.5)).toBe('CALM');
    });

    it('handles RISING boundaries (3 to <6)', () => {
        expect(getSudsCategory(3)).toBe('RISING');
        expect(getSudsCategory(4.5)).toBe('RISING');
        expect(getSudsCategory(5.5)).toBe('RISING');
    });

    it('handles HIGH boundaries (6 to <8)', () => {
        expect(getSudsCategory(6)).toBe('HIGH');
        expect(getSudsCategory(7)).toBe('HIGH');
        expect(getSudsCategory(7.5)).toBe('HIGH');
    });

    it('handles CRISIS boundaries (8 to 10)', () => {
        expect(getSudsCategory(8)).toBe('CRISIS');
        expect(getSudsCategory(9)).toBe('CRISIS');
        expect(getSudsCategory(10)).toBe('CRISIS');
    });
});

describe('DistressAlert Logic', () => {
    it('does NOT alert for CALM values', () => {
        expect(shouldCreateAlert(0.5)).toBe(false);
        expect(shouldCreateAlert(2.5)).toBe(false);
    });

    it('does NOT alert for RISING values', () => {
        expect(shouldCreateAlert(3)).toBe(false);
        expect(shouldCreateAlert(5.5)).toBe(false);
    });

    it('DOES alert for HIGH values (>= 6)', () => {
        expect(shouldCreateAlert(6)).toBe(true);
        expect(shouldCreateAlert(7.5)).toBe(true);
    });

    it('DOES alert for CRISIS values (>= 8)', () => {
        expect(shouldCreateAlert(8)).toBe(true);
        expect(shouldCreateAlert(10)).toBe(true);
    });
});
