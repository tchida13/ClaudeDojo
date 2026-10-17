import { useRef, useState } from 'react';
import { useApp } from '../ctx';
import { EXAM_BY_CODE } from '../data/exams';
import { isCorrect, shuffle } from '../lib/engine';
import { t } from '../i18n';
import type { AnswerRecord, Attempt, ExamCode, Question } from '../types';
import { QuestionView } from './QuestionView';

const AUTO_NEXT_MS = 1200;

/** 一問一答: 1問ずつ出題→選んだらすぐ判定。正解は自動で次へ、不正解は解説を読んで次へ。終了するまで続く。 */
export function QuickPlay({ code, pool, onExit }: { code: ExamCode; pool: Question[]; onExit: () => void }) {
  const { lang, history, updateHistory } = useApp();
  const exam = EXAM_BY_CODE[code];
  const startedAt = useRef(Date.now());
  const queue = useRef<Question[]>(shuffle(pool));
  const [q, setQ] = useState<Question>(() => queue.current.pop()!);
  const [sel, setSel] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState<Attempt | null>(null);
  const timer = useRef<number>(0);

  const next = () => {
    clearTimeout(timer.current);
    if (!queue.current.length) queue.current = shuffle(pool);
    setQ(queue.current.pop()!);
    setSel([]);
    setRevealed(false);
  };

  const check = (selected: string[]) => {
    const ok = isCorrect(q, selected);
    setAnswers((a) => [...a, { questionId: q.id, selected, correct: ok }]);
    setStreak((s) => (ok ? s + 1 : 0));
    setRevealed(true);
    if (ok) timer.current = window.setTimeout(next, AUTO_NEXT_MS);
  };

  const toggle = (id: string) => {
    if (revealed) return;
    if (q.type === 'single') {
      setSel([id]);
      check([id]);
    } else {
      setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    }
  };

  const finish = () => {
    clearTimeout(timer.current);
    if (!answers.length) return onExit();
    const now = Date.now();
    const attempt: Attempt = {
      id: `${now.toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      exam: code, mode: 'quick', startedAt: startedAt.current, finishedAt: now,
      durationSec: Math.round((now - startedAt.current) / 1000),
      answers, flagged: [], scaledScore: null, passed: null,
    };
    updateHistory((h) => ({ ...h, attempts: [...h.attempts, attempt] }));
    setDone(attempt);
  };

  const correct = answers.filter((a) => a.correct).length;

  if (done) {
    const pct = Math.round((correct / answers.length) * 100);
    return (
      <div className="mx-auto max-w-3xl p-4">
        <div className="card space-y-2 text-center">
          <h2 className="text-xl font-bold">{t(lang, 'quick')} — {code}</h2>
          <p className="text-5xl font-bold">{correct}<span className="text-lg text-stone-500"> / {answers.length}</span></p>
          <p className="text-stone-500">{pct}%</p>
          <button className="btn-primary" onClick={onExit}>{t(lang, 'back')}</button>
        </div>
      </div>
    );
  }

  const scenario = exam.scenarios?.list.find((s) => s.id === q.scenarioId);
  const bookmarked = history.bookmarks.includes(q.id);
  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <b>{t(lang, 'quick')} · {code}</b>
        <span className="text-sm">✓ {correct} / {answers.length}{streak >= 2 && <> · 🔥{streak}</>}</span>
        <button className="btn" onClick={finish}>{t(lang, 'finishQuick')}</button>
      </div>
      {scenario && <p className="mb-2 text-xs text-stone-500"><b>{scenario.id}: {scenario.title[lang]}</b> — {scenario.description[lang]}</p>}
      <div className="card">
        <p className="mb-1 text-xs text-stone-500">D{q.domain} {exam.domains.find((d) => d.id === q.domain)?.name[lang]}</p>
        <QuestionView q={q} lang={lang} selected={sel} onToggle={toggle} reveal={revealed} />
        {revealed && (
          <p className={`mt-3 font-semibold ${answers[answers.length - 1]?.correct ? 'text-green-600' : 'text-red-600'}`}>
            {answers[answers.length - 1]?.correct ? t(lang, 'correct') : t(lang, 'incorrect')}
          </p>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {q.type === 'multiple' && !revealed && (
          <button className="btn-primary" disabled={sel.length === 0} onClick={() => check(sel)}>{t(lang, 'check')}</button>
        )}
        {revealed && <button className="btn-primary" onClick={next}>{t(lang, 'next')}</button>}
        <button className="btn" onClick={() => updateHistory((h) => ({ ...h, bookmarks: bookmarked ? h.bookmarks.filter((b) => b !== q.id) : [...h.bookmarks, q.id] }))}>
          {bookmarked ? '★' : '☆'} {t(lang, 'bookmark')}
        </button>
      </div>
    </div>
  );
}
