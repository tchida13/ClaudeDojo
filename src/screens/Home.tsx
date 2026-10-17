import { useApp } from '../ctx';
import { t } from '../i18n';
import { EXAMS } from '../data/exams';
import { BANK } from '../data/bank';
import type { ExamCode } from '../types';

export function Home({ onSelect }: { onSelect: (c: ExamCode) => void }) {
  const { lang, history } = useApp();
  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <p className="text-sm text-stone-600 dark:text-stone-400">{t(lang, 'disclaimer')}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {EXAMS.map((e) => {
          const n = BANK.filter((q) => q.exam === e.code).length;
          const mocks = history.attempts.filter((a) => a.exam === e.code && a.mode === 'mock');
          const best = mocks.reduce<number | null>((m, a) => (a.scaledScore != null && (m == null || a.scaledScore > m) ? a.scaledScore : m), null);
          return (
            <button key={e.code} onClick={() => onSelect(e.code)} className="card text-left hover:border-orange-500 cursor-pointer">
              <div className="text-xs font-mono text-orange-600">{e.code}</div>
              <div className="font-semibold">{e.name[lang]}</div>
              <div className="mt-2 text-xs text-stone-500">
                {e.items}{t(lang, 'items')} / {e.minutes}{t(lang, 'minutes')} / {t(lang, 'passScore')} {e.passScore} / ${e.feeUsd}
              </div>
              <div className="mt-1 text-xs text-stone-500">
                {t(lang, 'bank')}: {n} · {t(lang, 'attempts')}: {mocks.length}
                {best != null && <> · {t(lang, 'bestScore')}: {best}</>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
