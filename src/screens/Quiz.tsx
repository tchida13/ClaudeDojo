import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../ctx';
import { t } from '../i18n';
import { domainStats, isCorrect, scaledScore } from '../lib/engine';
import { EXAM_BY_CODE } from '../data/exams';
import type { Attempt, AttemptMode, ExamCode, Question } from '../types';
import { QuestionView } from './QuestionView';

type Props = {
  exam: ExamCode;
  mode: AttemptMode;
  questions: Question[];
  onFinish: (a: Attempt) => void;
  onExit: () => void;
};

export function Quiz({ exam: code, mode, questions, onFinish, onExit }: Props) {
  const { lang, history, updateHistory } = useApp();
  const exam = EXAM_BY_CODE[code];
  const mock = mode === 'mock';
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const startedAt = useRef(Date.now());
  const [now, setNow] = useState(Date.now());
  const q = questions[idx];
  const totalSec = exam.minutes * 60;
  const elapsed = Math.floor((now - startedAt.current) / 1000);
  const left = Math.max(0, totalSec - elapsed);

  useEffect(() => {
    if (!mock) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [mock]);

  const finish = () => {
    const finishedAt = Date.now();
    const recs = questions.map((x) => {
      const selected = answers[x.id] ?? [];
      return { questionId: x.id, selected, correct: isCorrect(x, selected) };
    });
    const stats = domainStats(questions, recs);
    const score = mock ? scaledScore(exam, stats) : null;
    onFinish({
      id: `${finishedAt.toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      exam: code, mode, startedAt: startedAt.current, finishedAt,
      durationSec: Math.round((finishedAt - startedAt.current) / 1000),
      answers: recs, flagged: [...flagged],
      scaledScore: score, passed: score == null ? null : score >= exam.passScore,
    });
  };

  useEffect(() => {
    if (mock && left === 0) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, mock]);

  const toggle = (id: string) => {
    setAnswers((a) => {
      const cur = a[q.id] ?? [];
      if (q.type === 'single') return { ...a, [q.id]: [id] };
      return { ...a, [q.id]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
    });
  };

  const sel = answers[q.id] ?? [];
  const revealed = !mock && checked.has(q.id);
  const answeredCount = questions.filter((x) => (answers[x.id]?.length ?? 0) > 0).length;
  const scenario = useMemo(() => exam.scenarios?.list.find((s) => s.id === q.scenarioId), [exam, q.scenarioId]);
  const bookmarked = history.bookmarks.includes(q.id);
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  const submit = () => {
    if (answeredCount < questions.length && !window.confirm(t(lang, 'confirmSubmit'))) return;
    finish();
  };

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <button className="btn" onClick={onExit}>{t(lang, 'back')}</button>
        <div className="text-sm text-stone-500">{t(lang, 'questionOf')} {idx + 1} / {questions.length}</div>
        {mock ? <div className={`font-mono ${left < 600 ? 'text-red-600' : ''}`}>{t(lang, 'timeLeft')} {mm}:{ss}</div> : <div />}
      </div>
      {scenario && (
        <div className="card mb-3 text-sm">
          <b>{t(lang, 'scenario')} {scenario.id}: {scenario.title[lang]}</b>
          <p className="mt-1 text-stone-600 dark:text-stone-400">{scenario.description[lang]}</p>
        </div>
      )}
      <div className="card">
        <QuestionView q={q} lang={lang} selected={sel} onToggle={toggle} reveal={revealed} />
        {revealed && (
          <p className={`mt-3 font-semibold ${isCorrect(q, sel) ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect(q, sel) ? t(lang, 'correct') : t(lang, 'incorrect')}
          </p>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button className="btn" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>{t(lang, 'prev')}</button>
        {!mock && !revealed && (
          <button className="btn-primary" disabled={sel.length === 0} onClick={() => setChecked(new Set(checked).add(q.id))}>
            {t(lang, 'check')}
          </button>
        )}
        <button className="btn" disabled={idx === questions.length - 1} onClick={() => setIdx(idx + 1)}>{t(lang, 'next')}</button>
        <button className="btn" onClick={() => setFlagged((f) => { const n = new Set(f); n.has(q.id) ? n.delete(q.id) : n.add(q.id); return n; })}>
          {flagged.has(q.id) ? '🚩' : '⚑'} {t(lang, 'flag')}
        </button>
        <button className="btn" onClick={() => updateHistory((h) => ({ ...h, bookmarks: bookmarked ? h.bookmarks.filter((b) => b !== q.id) : [...h.bookmarks, q.id] }))}>
          {bookmarked ? '★' : '☆'} {t(lang, 'bookmark')}
        </button>
        <div className="flex-1" />
        <button className="btn-primary" onClick={mock ? submit : finish}>{mock ? t(lang, 'submitExam') : t(lang, 'finish')}</button>
      </div>
      {mock && (
        <div className="mt-4 flex flex-wrap gap-1">
          {questions.map((x, i) => {
            const done = (answers[x.id]?.length ?? 0) > 0;
            return (
              <button key={x.id} onClick={() => setIdx(i)} title={done ? '' : t(lang, 'unanswered')}
                className={`h-8 w-8 rounded text-xs border ${i === idx ? 'border-orange-600 ring-2 ring-orange-400' : 'border-stone-300 dark:border-stone-700'} ${done ? 'bg-stone-200 dark:bg-stone-700' : ''}`}>
                {flagged.has(x.id) ? '🚩' : i + 1}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
