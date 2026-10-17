import type { History } from '../types';

const esc = (v: string | number | boolean | null) => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function attemptsToCsv(h: History): string {
  const head = ['id', 'exam', 'mode', 'startedAt', 'durationSec', 'questions', 'correct', 'scaledScore', 'passed'];
  const rows = h.attempts.map((a) => [
    a.id, a.exam, a.mode, new Date(a.startedAt).toISOString(), a.durationSec, a.answers.length,
    a.answers.filter((x) => x.correct).length, a.scaledScore, a.passed,
  ]);
  return [head, ...rows].map((r) => r.map(esc).join(',')).join('\n');
}
