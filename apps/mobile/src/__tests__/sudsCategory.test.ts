import { getSudsCategory } from '@config/sudsConfig';

describe('SUDS Boundary Logic', () => {
    it('handles KALM boundaries (0 to <3)', () => {
        expect(getSudsCategory(0)).toBe('CALM');
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
