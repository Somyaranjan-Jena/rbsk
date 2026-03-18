import { describe, it, expect } from 'vitest';
import { generateUniqueId, sanitize } from '../utils/helpers';

describe('generateUniqueId', () => {
  it('generates an ID starting with RBSK-', () => {
    const id = generateUniqueId();
    expect(id).toMatch(/^RBSK-\d{8}-[0-9A-F]{4}$/);
  });

  it('generates unique IDs on successive calls', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateUniqueId()));
    expect(ids.size).toBeGreaterThan(45); // statistically should be unique
  });
});

describe('sanitize', () => {
  it('removes angle brackets from strings', () => {
    expect(sanitize('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
  });

  it('returns non-string values unchanged', () => {
    expect(sanitize(42)).toBe(42);
    expect(sanitize(null)).toBe(null);
    expect(sanitize(undefined)).toBe(undefined);
  });

  it('leaves normal strings unchanged', () => {
    expect(sanitize('Hello World')).toBe('Hello World');
    expect(sanitize('Ravi Kumar')).toBe('Ravi Kumar');
  });
});
