import { describe, expect, it } from 'vitest';
import { formatTime, isComboMilestone, pickMultiplier, pointsFor, tierOf } from './dopa';

describe('dopa rules', () => {
  it('tier by streak', () => {
    expect(tierOf(1)).toBe('blue');
    expect(tierOf(3)).toBe('green');
    expect(tierOf(4)).toBe('red');
    expect(tierOf(5)).toBe('gold');
    expect(tierOf(7)).toBe('rainbow');
    expect(tierOf(1, { lucky: true })).toBe('rainbow');
  });
  it('multiplier raises tier', () => {
    expect(tierOf(1, { multiplier: 2 })).toBe('red');
    expect(tierOf(1, { multiplier: 3 })).toBe('gold');
    expect(tierOf(1, { multiplier: 5 })).toBe('rainbow');
    expect(tierOf(7, { multiplier: 2 })).toBe('rainbow');
  });
  it('pickMultiplier follows weights', () => {
    expect(pickMultiplier(() => 0)).toBe(2);
    expect(pickMultiplier(() => 0.61)).toBe(3);
    expect(pickMultiplier(() => 0.86)).toBe(5);
    expect(pickMultiplier(() => 0.99)).toBe(10);
  });
  it('points, milestone, time', () => {
    expect(pointsFor(3)).toBe(300);
    expect([0, 9, 10, 20, 25].map(isComboMilestone)).toEqual([false, false, true, true, false]);
    expect(formatTime(179_500)).toBe('3:00');
    expect(formatTime(59_000)).toBe('0:59');
    expect(formatTime(0)).toBe('0:00');
  });
});
