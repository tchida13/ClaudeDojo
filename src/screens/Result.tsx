import { useState } from 'react';
import { useApp } from '../ctx';
import { t } from '../i18n';
import { EXAM_BY_CODE } from '../data/exams';
import { domainStats } from '../lib/engine';
import type { Attempt, Question } from '../types';
import { QuestionView } from './QuestionView';

export function DomainBars({ stats, exam }: { stats: { domain: number; total: number; correct: number }[]; exam: ReturnType<typeof getExam> }) {
  const { lang } = useApp();
  return (
    <div className="space-y-2">
      {stats.map((s) => {
        const pct = s.total ? Math.round((s.correct / s.total) * 100) : 0;
        const d = exam.domains.find((x) => x.id === s.domain);
        return (
          <div key={s.domain}>
            <div className="flex justify-between text-sm">
              <span>D{s.domain} {d?.name[lang]}</span>
              <span>{s.correct}/{s.total} ({pct}%)</span>
            </div>
            <div className="h-2 rounded bg-stone-200 dark:bg-stone-800">
              <div className={`h-2 rounded ${pct >= 72 ? 'bg-green-600' : pct >= 50 ? 'bg-amber-500' : 'bg-red-600'}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
const getExam = (c: Attempt['exam']) => EXAM_BY_CODE[c];

export function Result({ attempt, questions, onHome }: { attempt: Attempt; questions: Question[]; onHome: () => void }) {
  const { lang } = useApp();
  const exam = getExam(attempt.exam);
  const stats = domainStats(questions, attempt.answers);
  const correct = attempt.answers.filter((a) => a.correct).length;
  const [showAll, setShowAll] = useState(false);
  const byId = new Map(attempt.answers.map((a) => [a.questionId, a]));
  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <div className="card text-center">
        <h2 className="text-xl font-bold">{t(lang, 'result')} — {exam.code}</h2>
        {attempt.scaledScore != null ? (
          <>
            <p className="mt-2 text-5xl font-bold">{attempt.scaledScore}<span className="text-lg text-stone-500"> / 1000</span></p>
            <p className={`mt-1 font-semibold ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
              {attempt.passed ? t(lang, 'pass') : t(lang, 'fail')} ({t(lang, 'passScore')} {exam.passScore})
            </p>
            <p className="mt-1 text-xs text-stone-500">{t(lang, 'scoreNote')}</p>
          </>
        ) : null}
        <p className="mt-2 text-lg">{correct} / {attempt.answers.length}</p>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">{t(lang, 'byDomain')}</h3>
        <DomainBars stats={stats} exam={exam} />
      </div>
      <div className="flex gap-2">
        <button className="btn-primary" onClick={() => setShowAll(!showAll)}>{t(lang, 'reviewAnswers')}</button>
        <button className="btn" onClick={onHome}>{t(lang, 'retry')}</button>
      </div>
      {showAll && questions.map((q, i) => {
        const rec = byId.get(q.id);
        return (
          <div key={q.id} className="card">
            <p className={`mb-2 text-sm font-semibold ${rec?.correct ? 'text-green-600' : 'text-red-600'}`}>
              #{i + 1} {rec?.correct ? t(lang, 'correct') : t(lang, 'incorrect')}
            </p>
            <QuestionView q={q} lang={lang} selected={rec?.selected ?? []} onToggle={() => {}} reveal />
          </div>
        );
      })}
    </div>
  );
}
