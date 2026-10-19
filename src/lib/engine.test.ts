import { describe, expect, it } from 'vitest';
import { allocateByWeight, buildMockExam, domainStats, isCorrect, scaledScore, shuffleOptions } from './engine';
import { EXAM_BY_CODE } from '../data/exams';
import type { Question } from '../types';

const mk = (id: string, domain: number, answer: string[], extra: Partial<Question> = {}): Question => ({
  id, exam: 'CCAO-F', domain, type: answer.length > 1 ? 'multiple' : 'single', select: answer.length,
  stem: { ja: 'q', en: 'q' }, options: ['A', 'B', 'C', 'D'].map((o) => ({ id: o, ja: o, en: o })),
  answer, explanation: { ja: 'e', en: 'e' }, ...extra,
});

describe('isCorrect', () => {
  it('single', () => { expect(isCorrect(mk('1', 1, ['B']), ['B'])).toBe(true); expect(isCorrect(mk('1', 1, ['B']), ['A'])).toBe(false); });
  it('multiple is all-or-nothing and order-free', () => {
    const q = mk('1', 1, ['A', 'C']);
    expect(isCorrect(q, ['C', 'A'])).toBe(true);
    expect(isCorrect(q, ['A'])).toBe(false);
    expect(isCorrect(q, ['A', 'B', 'C'])).toBe(false);
  });
});

describe('allocateByWeight', () => {
  it('sums to total', () => {
    for (const e of Object.values(EXAM_BY_CODE)) {
      const a = allocateByWeight(e.domains, e.items);
      expect([...a.values()].reduce((s, n) => s + n, 0)).toBe(e.items);
    }
  });
  it('follows weights', () => {
    const a = allocateByWeight(EXAM_BY_CODE['CCAR-F'].domains, 60);
    expect(a.get(1)).toBe(16); // 27% of 60 = 16.2
  });
});

describe('weights', () => {
  it('each exam totals 100', () => {
    for (const e of Object.values(EXAM_BY_CODE)) expect(Math.round(e.domains.reduce((s, d) => s + d.weight, 0))).toBe(100);
  });
});

describe('buildMockExam', () => {
  it('returns at most the available questions without duplicates', () => {
    const bank = Array.from({ length: 20 }, (_, i) => mk(`q${i}`, (i % 7) + 1, ['A']));
    const m = buildMockExam(EXAM_BY_CODE['CCAO-F'], bank);
    expect(m.length).toBe(20);
    expect(new Set(m.map((q) => q.id)).size).toBe(20);
  });
  it('limits CCAR-F to 4 scenarios', () => {
    const bank = Array.from({ length: 60 }, (_, i) => mk(`q${i}`, (i % 5) + 1, ['A'], { exam: 'CCAR-F', scenarioId: `S${(i % 6) + 1}` }));
    const m = buildMockExam(EXAM_BY_CODE['CCAR-F'], bank);
    expect(new Set(m.map((q) => q.scenarioId)).size).toBeLessThanOrEqual(4);
  });
});

describe('scaledScore', () => {
  it('maps 0%→100 and 100%→1000', () => {
    const e = EXAM_BY_CODE['CCAO-F'];
    expect(scaledScore(e, [{ domain: 1, total: 4, correct: 0 }])).toBe(100);
    expect(scaledScore(e, [{ domain: 1, total: 4, correct: 4 }])).toBe(1000);
  });
  it('domainStats counts', () => {
    const qs = [mk('a', 1, ['A']), mk('b', 1, ['A']), mk('c', 2, ['A'])];
    const s = domainStats(qs, [{ questionId: 'a', selected: ['A'], correct: true }]);
    expect(s).toEqual([{ domain: 1, total: 2, correct: 1 }, { domain: 2, total: 1, correct: 0 }]);
  });
});

describe('shuffleOptions', () => {
  it('keeps the correct answer text and remaps rationale keys', () => {
    const q = mk('1', 1, ['B', 'D'], {
      options: ['A', 'B', 'C', 'D'].map((o) => ({ id: o, ja: `ja${o}`, en: `en${o}` })),
      optionRationale: { A: { ja: 'ra', en: 'ra' }, C: { ja: 'rc', en: 'rc' } },
    });
    for (let i = 0; i < 50; i++) {
      const s = shuffleOptions(q);
      expect(s.options.map((o) => o.id)).toEqual(['A', 'B', 'C', 'D']);
      const correctTexts = s.answer.map((a) => s.options.find((o) => o.id === a)!.en).sort();
      expect(correctTexts).toEqual(['enB', 'enD']);
      for (const [k, v] of Object.entries(s.optionRationale!)) {
        const text = s.options.find((o) => o.id === k)!.en;
        expect(text).toBe(v.en === 'ra' ? 'enA' : 'enC');
      }
    }
  });
});
