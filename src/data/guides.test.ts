import { describe, expect, it } from 'vitest';
import { EXAMS } from './exams';
import { GUIDES, LOGISTICS } from './guides';

describe('guides', () => {
  it('cover every domain of every exam, once, with both languages', () => {
    for (const e of EXAMS) {
      const g = GUIDES[e.code];
      expect(g.domains.map((d) => d.id)).toEqual(e.domains.map((d) => d.id));
      const texts = [g.tagline, g.audience, g.notFor, ...g.experience, ...g.format, ...g.plan, ...g.heuristics,
        ...(g.handsOn ?? []), ...g.domains.flatMap((d) => [...d.knows, ...(d.traps ?? [])])];
      for (const t of texts) { expect(t.ja.trim()).not.toBe(''); expect(t.en.trim()).not.toBe(''); }
      for (const d of g.domains) expect(d.knows.length).toBeGreaterThan(0);
    }
    for (const l of LOGISTICS) { expect(l.title.ja && l.title.en && l.body.ja && l.body.en).toBeTruthy(); }
  });
});
