import type { AnswerRecord, Exam, Question } from '../types';

export type Rng = () => number;

export function shuffle<T>(arr: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LETTERS = 'ABCDEFGH';

/**
 * 選択肢の順序をランダムにして A, B, C… を振り直す(正解位置の偏りを学習で覚えないため)。
 * answer と optionRationale のキーも新しい記号に付け替える。解説文は選択肢の記号を参照しない前提。
 */
export function shuffleOptions(q: Question, rng: Rng = Math.random): Question {
  const order = shuffle(q.options, rng);
  const map = new Map(order.map((o, i) => [o.id, LETTERS[i]]));
  return {
    ...q,
    options: order.map((o, i) => ({ ...o, id: LETTERS[i] })),
    answer: q.answer.map((a) => map.get(a)!).sort(),
    optionRationale: q.optionRationale
      ? Object.fromEntries(Object.entries(q.optionRationale).map(([k, v]) => [map.get(k)!, v]))
      : undefined,
  };
}

export function isCorrect(q: Question, selected: readonly string[]): boolean {
  if (selected.length !== q.answer.length) return false;
  const s = new Set(selected);
  return q.answer.every((a) => s.has(a));
}

/** Largest-remainder allocation of `total` items across domains by weight. */
export function allocateByWeight(domains: { id: number; weight: number }[], total: number): Map<number, number> {
  const sum = domains.reduce((s, d) => s + d.weight, 0);
  const raw = domains.map((d) => ({ id: d.id, exact: (d.weight / sum) * total }));
  const out = new Map(raw.map((r) => [r.id, Math.floor(r.exact)]));
  let rest = total - [...out.values()].reduce((s, n) => s + n, 0);
  const byFrac = [...raw].sort((a, b) => (b.exact % 1) - (a.exact % 1));
  for (let i = 0; rest > 0; i = (i + 1) % byFrac.length, rest--) {
    out.set(byFrac[i].id, out.get(byFrac[i].id)! + 1);
  }
  return out;
}

/** Build a mock exam following the blueprint weights; degrades gracefully if the bank is small. */
export function buildMockExam(exam: Exam, bank: readonly Question[], rng: Rng = Math.random): Question[] {
  let pool = bank.filter((q) => q.exam === exam.code);
  if (exam.scenarios) {
    const withQs = exam.scenarios.list.filter((s) => pool.some((q) => q.scenarioId === s.id));
    const chosen = new Set(shuffle(withQs, rng).slice(0, exam.scenarios.pick).map((s) => s.id));
    pool = pool.filter((q) => !q.scenarioId || chosen.has(q.scenarioId));
  }
  const target = Math.min(exam.items, pool.length);
  const alloc = allocateByWeight(exam.domains, target);
  const picked: Question[] = [];
  const used = new Set<string>();
  for (const d of exam.domains) {
    const cand = shuffle(pool.filter((q) => q.domain === d.id), rng).slice(0, alloc.get(d.id) ?? 0);
    cand.forEach((q) => (used.add(q.id), picked.push(q)));
  }
  // top up shortfall from remaining pool
  for (const q of shuffle(pool, rng)) {
    if (picked.length >= target) break;
    if (!used.has(q.id)) (used.add(q.id), picked.push(q));
  }
  return shuffle(picked, rng);
}

export type DomainStat = { domain: number; total: number; correct: number };

export function domainStats(questions: readonly Question[], answers: readonly AnswerRecord[]): DomainStat[] {
  const byId = new Map(answers.map((a) => [a.questionId, a]));
  const map = new Map<number, DomainStat>();
  for (const q of questions) {
    const s = map.get(q.domain) ?? { domain: q.domain, total: 0, correct: 0 };
    s.total++;
    if (byId.get(q.id)?.correct) s.correct++;
    map.set(q.domain, s);
  }
  return [...map.values()].sort((a, b) => a.domain - b.domain);
}

/**
 * Approximate 100–1000 scaled score: weighted domain accuracy mapped linearly.
 * The official conversion is not published; this is an estimate only.
 */
export function scaledScore(exam: Exam, stats: readonly DomainStat[]): number {
  let wSum = 0;
  let acc = 0;
  for (const s of stats) {
    const w = exam.domains.find((d) => d.id === s.domain)?.weight ?? 0;
    if (!s.total) continue;
    wSum += w;
    acc += w * (s.correct / s.total);
  }
  if (!wSum) return 100;
  return Math.round(100 + 900 * (acc / wSum));
}

export function pickPractice(
  bank: readonly Question[],
  opts: { exam: Exam['code']; domain?: number; count: number; onlyIds?: ReadonlySet<string> },
  rng: Rng = Math.random,
): Question[] {
  const pool = bank.filter(
    (q) => q.exam === opts.exam && (opts.domain == null || q.domain === opts.domain) && (!opts.onlyIds || opts.onlyIds.has(q.id)),
  );
  return shuffle(pool, rng).slice(0, opts.count);
}
