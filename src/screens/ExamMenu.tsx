import { useState } from 'react';
import { useApp } from '../ctx';
import { t } from '../i18n';
import { EXAM_BY_CODE } from '../data/exams';
import { BANK } from '../data/bank';
import { buildMockExam, domainStats, pickPractice } from '../lib/engine';
import { DomainBars } from './Result';
import type { AttemptMode, ExamCode, Question } from '../types';

export function ExamMenu({ code, onStart, onSpecial, onBack, onGuide }: { code: ExamCode; onStart: (mode: AttemptMode, qs: Question[]) => void; onSpecial: (kind: 'quick' | 'dopa', qs: Question[]) => void; onBack: () => void; onGuide: () => void }) {
  const { lang, history } = useApp();
  const exam = EXAM_BY_CODE[code];
  const bank = BANK.filter((q) => q.exam === code);
  const [domain, setDomain] = useState<number | 0>(0);
  const [count, setCount] = useState(10);

  // review pool: bookmarks + questions whose most recent answer was wrong
  const last = new Map<string, boolean>();
  for (const a of history.attempts.filter((x) => x.exam === code)) for (const r of a.answers) last.set(r.questionId, r.correct);
  const reviewIds = new Set([...history.bookmarks, ...[...last].filter(([, ok]) => !ok).map(([id]) => id)]);
  const reviewQs = bank.filter((q) => reviewIds.has(q.id));

  const bestDopa = Math.max(0, ...history.attempts.filter((a) => a.exam === code && a.mode === 'dopa').map((a) => a.points ?? 0));

  // weakness across all attempts
  const allAnswers = history.attempts.filter((a) => a.exam === code).flatMap((a) => a.answers);
  const answered = bank.filter((q) => allAnswers.some((r) => r.questionId === q.id));
  const stats = domainStats(answered, allAnswers);

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <div className="flex gap-2">
        <button className="btn" onClick={onBack}>{t(lang, 'back')}</button>
        <button className="btn-primary" onClick={onGuide}>📖 {t(lang, 'guide')}</button>
      </div>
      <h2 className="text-xl font-bold">{exam.code} — {exam.name[lang]}</h2>
      <p className="text-sm text-stone-500">{t(lang, 'bank')}: {bank.length}</p>
      {bank.length === 0 && <p>{t(lang, 'noQuestions')}</p>}

      <div className="card space-y-2">
        <h3 className="font-semibold">{t(lang, 'mockExam')}</h3>
        <p className="text-sm text-stone-500">{exam.items}{t(lang, 'items')} / {exam.minutes}{t(lang, 'minutes')}</p>
        <button className="btn-primary" disabled={!bank.length} onClick={() => onStart('mock', buildMockExam(exam, BANK))}>{t(lang, 'start')}</button>
      </div>

      <div className="card space-y-2">
        <h3 className="font-semibold">{t(lang, 'quick')}</h3>
        <p className="text-sm text-stone-500">{t(lang, 'quickDesc')}</p>
        <div className="flex flex-wrap items-center gap-2">
          <select className="btn" value={domain} onChange={(e) => setDomain(Number(e.target.value))}>
            <option value={0}>{t(lang, 'allDomains')}</option>
            {exam.domains.map((d) => <option key={d.id} value={d.id}>D{d.id} {d.name[lang]}</option>)}
          </select>
          <button className="btn-primary" disabled={!bank.length} onClick={() => onSpecial('quick', bank.filter((q) => !domain || q.domain === domain))}>{t(lang, 'start')}</button>
        </div>
      </div>

      <div className="card space-y-2 border-orange-400">
        <h3 className="font-semibold fx-rainbow-text">⚡ {t(lang, 'dopa')}</h3>
        <p className="text-sm text-stone-500">{t(lang, 'dopaDesc')}</p>
        {bestDopa > 0 && <p className="text-sm">{t(lang, 'bestScore')}: <b>{bestDopa.toLocaleString()}</b> pt</p>}
        <button className="btn-primary" disabled={!bank.length} onClick={() => onSpecial('dopa', bank)}>{t(lang, 'start')}</button>
      </div>

      <div className="card space-y-2">
        <h3 className="font-semibold">{t(lang, 'practice')}</h3>
        <div className="flex flex-wrap gap-2 items-center">
          <select className="btn" value={domain} onChange={(e) => setDomain(Number(e.target.value))}>
            <option value={0}>{t(lang, 'allDomains')}</option>
            {exam.domains.map((d) => (
              <option key={d.id} value={d.id}>D{d.id} {d.name[lang]} ({bank.filter((q) => q.domain === d.id).length})</option>
            ))}
          </select>
          <label className="text-sm">{t(lang, 'count')}
            <select className="btn ml-2" value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {[5, 10, 20, 30].map((n) => <option key={n}>{n}</option>)}
            </select>
          </label>
          <button className="btn-primary" disabled={!bank.length}
            onClick={() => onStart('practice', pickPractice(BANK, { exam: code, domain: domain || undefined, count }))}>
            {t(lang, 'start')}
          </button>
        </div>
      </div>

      <div className="card space-y-2">
        <h3 className="font-semibold">{t(lang, 'review')} ({reviewQs.length})</h3>
        <button className="btn-primary" disabled={!reviewQs.length} onClick={() => onStart('practice', pickPractice(BANK, { exam: code, count: 50, onlyIds: reviewIds }))}>
          {t(lang, 'start')}
        </button>
        {!reviewQs.length && <p className="text-sm text-stone-500">{t(lang, 'reviewEmpty')}</p>}
      </div>

      {stats.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-2">{t(lang, 'byDomain')}</h3>
          <DomainBars stats={stats} exam={exam} />
        </div>
      )}
    </div>
  );
}
