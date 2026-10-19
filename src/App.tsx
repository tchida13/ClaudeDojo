import { useEffect, useState } from 'react';
import { AppCtx } from './ctx';
import { pickPractice, shuffleOptions } from './lib/engine';
import { BANK } from './data/bank';
import { GuideView } from './screens/GuideView';
import { t } from './i18n';
import { loadHistory, loadLang, saveHistory, saveLang } from './lib/storage';
import type { Attempt, AttemptMode, ExamCode, History, Lang, Question } from './types';
import { Home } from './screens/Home';
import { ExamMenu } from './screens/ExamMenu';
import { Quiz } from './screens/Quiz';
import { Result } from './screens/Result';
import { HistoryView } from './screens/HistoryView';
import { QuickPlay } from './screens/QuickPlay';
import { DopaPlay } from './screens/DopaPlay';

type View =
  | { name: 'home' }
  | { name: 'history' }
  | { name: 'exam'; code: ExamCode }
  | { name: 'guide'; code: ExamCode }
  | { name: 'run'; code: ExamCode; mode: AttemptMode; qs: Question[] }
  | { name: 'special'; kind: 'quick' | 'dopa'; code: ExamCode; qs: Question[] }
  | { name: 'result'; attempt: Attempt; qs: Question[] };

export default function App() {
  const [lang, setLangState] = useState<Lang>(loadLang);
  const [history, setHistory] = useState<History>(loadHistory);
  const [view, setView] = useState<View>({ name: 'home' });
  const [dark, setDark] = useState(() => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false);

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const setLang = (l: Lang) => { setLangState(l); saveLang(l); };
  const updateHistory = (fn: (h: History) => History) => setHistory((h) => saveHistory(fn(h)));

  const home = () => setView({ name: 'home' });

  return (
    <AppCtx.Provider value={{ lang, setLang, history, updateHistory }}>
      <header className="border-b border-stone-200 dark:border-stone-800">
        <div className="mx-auto max-w-3xl flex items-center gap-2 p-3">
          <button className="font-bold text-lg cursor-pointer" onClick={home}>🥋 {t(lang, 'appName')}</button>
          <span className="hidden sm:block text-xs text-stone-500">{t(lang, 'tagline')}</span>
          <div className="flex-1" />
          <button className="btn" onClick={() => setView({ name: 'history' })}>{t(lang, 'history')}</button>
          <button className="btn" onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}>{lang === 'ja' ? 'EN' : '日本語'}</button>
          <button className="btn" aria-label={t(lang, 'dark')} onClick={() => setDark(!dark)}>{dark ? '☀️' : '🌙'}</button>
        </div>
      </header>
      {view.name === 'home' && <Home onSelect={(code) => setView({ name: 'exam', code })} onGuide={(code) => setView({ name: 'guide', code })} />}
      {view.name === 'guide' && (
        <GuideView code={view.code} onBack={home} onMenu={() => setView({ name: 'exam', code: view.code })}
          onPractice={(domain) => {
            const qs = pickPractice(BANK, { exam: view.code, domain, count: 10 }).map((q) => shuffleOptions(q));
            if (qs.length) setView({ name: 'run', code: view.code, mode: 'practice', qs });
          }} />
      )}
      {view.name === 'history' && <HistoryView onBack={home} />}
      {view.name === 'exam' && (
        <ExamMenu code={view.code} onBack={home} onGuide={() => setView({ name: 'guide', code: view.code })} onStart={(mode, qs) => qs.length && setView({ name: 'run', code: view.code, mode, qs: qs.map((q) => shuffleOptions(q)) })}
          onSpecial={(kind, qs) => qs.length && setView({ name: 'special', kind, code: view.code, qs: qs.map((q) => shuffleOptions(q)) })} />
      )}
      {view.name === 'run' && (
        <Quiz
          key={view.qs.map((q) => q.id).join()}
          exam={view.code} mode={view.mode} questions={view.qs}
          onExit={() => setView({ name: 'exam', code: view.code })}
          onFinish={(attempt) => {
            updateHistory((h) => ({ ...h, attempts: [...h.attempts, attempt] }));
            setView({ name: 'result', attempt, qs: view.qs });
          }}
        />
      )}
      {view.name === 'special' && (view.kind === 'quick'
        ? <QuickPlay key="quick" code={view.code} pool={view.qs} onExit={() => setView({ name: 'exam', code: view.code })} />
        : <DopaPlay key="dopa" code={view.code} pool={view.qs} onExit={() => setView({ name: 'exam', code: view.code })} />)}
      {view.name === 'result' && <Result attempt={view.attempt} questions={view.qs} onHome={home} />}
    </AppCtx.Provider>
  );
}
