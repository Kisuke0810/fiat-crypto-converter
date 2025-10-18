import { describe, it, expect } from 'vitest';
import { toFixedFloor } from '../lib/number';
describe('toFixedFloor', () => {
  it('floors and trims zeros', () => {
    expect(toFixedFloor(1/3, 6)).toBe('0.333333');
    expect(toFixedFloor(0.010000001, 8)).toBe('0.01');
    expect(toFixedFloor(123.45, 8)).toBe('123.45');
  });
});

