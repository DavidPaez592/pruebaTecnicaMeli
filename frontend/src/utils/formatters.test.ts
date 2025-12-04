import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatCurrency,
  formatFullPrice,
  calculateDiscount,
  truncateText,
} from './formatters';

describe('formatters', () => {
  describe('formatPrice', () => {
    it('formats price with thousand separators', () => {
      expect(formatPrice(1000000)).toBe('1.000.000');
      expect(formatPrice(1234567)).toBe('1.234.567');
    });

    it('handles small numbers', () => {
      expect(formatPrice(100)).toBe('100');
      expect(formatPrice(0)).toBe('0');
    });
  });

  describe('formatCurrency', () => {
    it('returns currency symbol for known currencies', () => {
      expect(formatCurrency('ARS')).toBe('$');
      expect(formatCurrency('USD')).toBe('US$');
      expect(formatCurrency('BRL')).toBe('R$');
    });

    it('returns currency code for unknown currencies', () => {
      expect(formatCurrency('EUR')).toBe('EUR');
    });
  });

  describe('formatFullPrice', () => {
    it('formats complete price with currency and amount', () => {
      expect(formatFullPrice('ARS', 1000000)).toBe('$ 1.000.000');
    });
  });

  describe('calculateDiscount', () => {
    it('calculates discount percentage', () => {
      expect(calculateDiscount(100, 90)).toBe(10);
      expect(calculateDiscount(200, 150)).toBe(25);
    });

    it('returns null for no discount', () => {
      expect(calculateDiscount(null, 100)).toBe(null);
      expect(calculateDiscount(100, 100)).toBe(null);
      expect(calculateDiscount(90, 100)).toBe(null);
    });
  });

  describe('truncateText', () => {
    it('truncates long text', () => {
      const text = 'This is a very long text that should be truncated';
      expect(truncateText(text, 20)).toBe('This is a very long...');
    });

    it('does not truncate short text', () => {
      expect(truncateText('Short', 20)).toBe('Short');
    });
  });
});

