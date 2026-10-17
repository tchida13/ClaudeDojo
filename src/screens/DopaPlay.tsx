import { useEffect, useRef, useState } from 'react';
import { useApp } from '../ctx';
import { EXAM_BY_CODE } from '../data/exams';
import { burst, shower, RAINBOW_COLORS } from '../lib/confetti';
import {
  AUTO_NEXT_MS, CHANCE_RATE, CHARGE_MS, MILESTONE_MS, TIME_LIMIT_MS, ZONE_ENTER_DELAY_MS, ZONE_INTRO_MS,
  formatTime, isComboMilestone, isLucky, pickMultiplier, pointsFor, shouldEnterZone, tierOf,
  type Tier,
} from '../lib/dopa';
import { shuffle } from '../lib/engine';
import { flash, megaText, popText, rainbow, reducedMotion, shake } from '../lib/fx';
import {
  isMuted, playCharge, playCorrect, playFanfare, playGong, playHorn, playKyuin, playTick, playWrong, setMuted, unlockAudio,
} from '../lib/sound';
import type { Attempt, AnswerRecord, ExamCode, Lang, Option, Question } from '../types';

const T = {
  title: { ja: 'ドパドパモード', en: 'Dopa-Dopa Mode' },
  rules: {
    ja: ['3分間で、どれだけポイントを稼げるか!', '正解で100pt。連続正解で演出が 青→緑→赤→金→虹 に!', '正解でときどき「ドパゾーン」: 2択が正解し続ける間つづく!', 'ときどき「倍チャンス」: ×2〜×10!'],
    en: ['Earn as many points as you can in 3 minutes!', '+100 per correct answer. Streaks level up: blue → green → red → gold → rainbow!', 'Sometimes you enter the "Dopa Zone": 2 choices while you keep getting them right!', 'Sometimes a "Multiplier Chance" hits: ×2 to ×10!'],
  },
  single: { ja: '※ 1つ選ぶ問題だけが出ます', en: 'Only single-answer questions appear' },
  start: { ja: 'スタート!', en: 'Start!' },
  back: { ja: '戻る', en: 'Back' },
  next: { ja: 'つぎへ', en: 'Next' },
  zone: { ja: 'ドパゾーン 2択', en: 'Dopa Zone: 2 choices' },
  zoneIn: { ja: 'ドパゾーン とつにゅう!', en: 'DOPA ZONE!' },
  combo: { ja: 'コンボ', en: 'combo' },
  chance: { ja: 'ポイント倍チャンス!', en: 'Multiplier Chance!' },
  stop: { ja: 'STOP', en: 'STOP' },
  timeup: { ja: 'タイムアップ!', en: "Time's up!" },
  result: { ja: '結果', en: 'Result' },
  points: { ja: 'ポイント', en: 'Points' },
  correct: { ja: '正解', en: 'Correct' },
  bestStreak: { ja: '最高の連続正解', en: 'Best streak' },
  zones: { ja: 'ドパゾーンに入った回数', en: 'Dopa Zones entered' },
  bestMult: { ja: '最高倍率', en: 'Best multiplier' },
  retry: { ja: 'もう一回!', en: 'Again!' },
  best: { ja: '自己ベスト', en: 'Your best' },
  newBest: { ja: '自己ベスト更新!!', en: 'NEW BEST!!' },
  sound: { ja: '音', en: 'Sound' },
  wrong: { ja: '不正解', en: 'Wrong' },
  explanation: { ja: '解説', en: 'Explanation' },
  noQ: { ja: '1つ選ぶ問題がありません', en: 'No single-answer questions' },
} satisfies Record<string, Record<Lang, unknown>>;

const tx = (lang: Lang, k: Exclude<keyof typeof T, 'rules'>) => T[k][lang] as string;

const LABELS: Record<Tier, Record<Lang, string>> = {
  blue: { ja: 'せいかい!', en: 'Correct!' },
  green: { ja: 'その ちょうし!', en: 'Nice streak!' },
  red: { ja: 'アツい!', en: 'HOT!' },
  gold: { ja: 'げきアツ!', en: 'ON FIRE!' },
  rainbow: { ja: 'レインボー!!', en: 'RAINBOW!!' },
};
const TIER_BADGE: Record<Tier, string> = { blue: '🔵', green: '🟢', red: '🔴', gold: '🟡', rainbow: '🌈' };

type Status = 'idle' | 'charging' | 'right' | 'wrong';
type Phase = 'ready' | 'play' | 'chance' | 'result';

type G = {
  phase: Phase; left: number; paused: boolean;
  q: Question | null; opts: Option[]; picked: string | null; status: Status;
  streak: number; zone: boolean; zoneRun: number; zoneCount: number; zoneIntro: boolean;
  points: number; correct: number; answered: number; bestStreak: number; bestMult: number;
  mult: number; chanceVal: number; reel: number; lastGain: number; lastTier: Tier;
  queue: Question[]; answers: AnswerRecord[]; startedAt: number; newBest: boolean; prevBest: number;
  stopFn?: () => void;
};

const fresh = (prevBest: number): G => ({
  phase: 'ready', left: TIME_LIMIT_MS, paused: false, q: null, opts: [], picked: null, status: 'idle',
  streak: 0, zone: false, zoneRun: 0, zoneCount: 0, zoneIntro: false,
  points: 0, correct: 0, answered: 0, bestStreak: 0, bestMult: 1,
  mult: 1, chanceVal: 2, reel: 2, lastGain: 0, lastTier: 'blue',
  queue: [], answers: [], startedAt: 0, newBest: false, prevBest,
});

export function DopaPlay({ code, pool, onExit }: { code: ExamCode; pool: Question[]; onExit: () => void }) {
  const { lang, history, updateHistory } = useApp();
  const exam = EXAM_BY_CODE[code];
  const singles = pool.filter((q) => q.type === 'single');
  const prevBest = Math.max(0, ...history.attempts.filter((a) => a.exam === code && a.mode === 'dopa').map((a) => a.points ?? 0));
  const g = useRef<G>(fresh(prevBest));
  const timers = useRef<number[]>([]);
  const [, setN] = useState(0);
  const render = () => setN((n) => n + 1);
  const [muted, setMutedState] = useState(isMuted());
  const s = g.current;

  const after = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // main clock
  useEffect(() => {
    let last = performance.now();
    let lastSec = -1;
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = now - last;
      last = now;
      const x = g.current;
      if (x.phase !== 'play' || x.paused) return;
      x.left -= dt;
      const sec = Math.ceil(x.left / 1000);
      if (sec !== lastSec) {
        lastSec = sec;
        if (sec <= 10 && sec > 0) playTick(sec <= 5 ? 1500 : 1100);
      }
      if (x.left <= 0) finish();
      render();
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextQuestion = () => {
    const x = g.current;
    if (x.phase === 'result') return;
    if (!x.queue.length) x.queue = shuffle(singles);
    const q = x.queue.pop()!;
    const correct = q.options.find((o) => o.id === q.answer[0])!;
    let opts = q.options;
    if (x.zone) opts = shuffle([correct, shuffle(q.options.filter((o) => o.id !== correct.id))[0]]);
    x.q = q; x.opts = opts; x.picked = null; x.status = 'idle'; x.mult = 1;
    if (Math.random() < CHANCE_RATE) startChance();
    else { x.phase = 'play'; x.paused = false; }
    render();
  };

  const startChance = () => {
    const x = g.current;
    x.phase = 'chance'; x.paused = true;
    x.chanceVal = pickMultiplier();
    let i = 0;
    const faces = [2, 3, 5, 10];
    const spin = window.setInterval(() => {
      x.reel = faces[i++ % faces.length];
      playTick(900 + (i % 4) * 150);
      render();
    }, 90);
    const stop = () => {
      clearInterval(spin);
      if (x.stopFn !== stop || x.phase !== 'chance') return;
      x.stopFn = undefined;
      x.reel = x.chanceVal;
      x.mult = x.chanceVal;
      x.bestMult = Math.max(x.bestMult, x.mult);
      (x.mult >= 5 ? playKyuin : playFanfare)(0);
      render();
      after(900, () => { x.phase = 'play'; x.paused = false; render(); });
    };
    x.stopFn = stop;
    after(3000, stop);
  };

  const start = () => {
    unlockAudio();
    const x = (g.current = fresh(prevBest));
    x.startedAt = Date.now();
    x.queue = shuffle(singles);
    playGong();
    nextQuestion();
  };

  const finish = () => {
    const x = g.current;
    if (x.phase === 'result') return;
    x.phase = 'result'; x.paused = true; x.left = 0;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    x.newBest = x.points > x.prevBest && x.points > 0;
    playGong();
    after(500, () => playFanfare());
    if (x.points >= 1500) shower(60, RAINBOW_COLORS);
    const now = Date.now();
    const attempt: Attempt = {
      id: `${now.toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      exam: code, mode: 'dopa', startedAt: x.startedAt, finishedAt: now,
      durationSec: Math.round((now - x.startedAt) / 1000),
      answers: x.answers, flagged: [], scaledScore: null, passed: null, points: x.points,
    };
    updateHistory((h) => ({ ...h, attempts: [...h.attempts, attempt] }));
    render();
  };

  const pick = (id: string, el: HTMLElement) => {
    const x = g.current;
    if (x.phase !== 'play' || x.status !== 'idle' || x.paused) return;
    x.picked = id; x.status = 'charging';
    playCharge();
    render();
    after(reducedMotion() ? 0 : CHARGE_MS, () => reveal(el));
  };

  const reveal = (el: HTMLElement) => {
    const x = g.current;
    const q = x.q!;
    if (x.phase === 'result') return;
    const ok = x.picked === q.answer[0];
    x.answered++;
    x.answers.push({ questionId: q.id, selected: [x.picked!], correct: ok });
    if (!ok) {
      x.status = 'wrong'; x.streak = 0; x.zone = false; x.zoneRun = 0;
      playWrong();
      if (x.mult > 1) after(180, playWrong);
      render();
      return;
    }
    x.status = 'right'; x.correct++; x.streak++;
    x.bestStreak = Math.max(x.bestStreak, x.streak);
    const lucky = isLucky(x.streak);
    const tier = tierOf(x.streak, { lucky, multiplier: x.mult });
    const gain = pointsFor(x.mult);
    x.points += gain; x.lastGain = gain; x.lastTier = tier;
    if (x.zone) x.zoneRun++;
    const milestone = x.zone && isComboMilestone(x.zoneRun);

    playCorrect(x.streak);
    const main = lucky && x.streak < 7 ? 'Lucky!!' : x.streak >= 2 && tier !== 'rainbow' ? (lang === 'ja' ? `${x.streak}れんぞく!` : `${x.streak} in a row!`) : LABELS[tier][lang];
    popText(main, null, tier);
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    burst(cx, cy, { blue: 24, green: 40, red: 56, gold: 80, rainbow: 120 }[tier], tier === 'rainbow' ? 1.5 : 1);
    if (tier === 'red') shake();
    if (tier === 'gold') { flash(); playFanfare(); }
    if (tier === 'rainbow') { rainbow(); shake(); after(450, shake); shower(50, RAINBOW_COLORS); playKyuin(); playFanfare(0.35); }

    let delay = AUTO_NEXT_MS;
    if (milestone) {
      x.paused = true;
      after(250, () => { megaText(String(x.zoneRun), lang === 'ja' ? 'コンボ!!' : 'COMBO!!', lang === 'ja' ? `${x.zoneRun}問連続正解!` : `${x.zoneRun} in a row!`); rainbow(); shake(); shower(80, RAINBOW_COLORS); playHorn(); });
      after(250 + MILESTONE_MS, () => { x.paused = false; });
      delay += MILESTONE_MS;
    }
    if (!x.zone && shouldEnterZone(x.streak)) {
      after(ZONE_ENTER_DELAY_MS, () => {
        x.zone = true; x.zoneRun = 0; x.zoneCount++; x.zoneIntro = true; x.paused = true;
        playHorn(); flash(); rainbow(); shower(60, RAINBOW_COLORS);
        popText(tx(lang, 'zoneIn'), null, 'rainbow');
        render();
        after(ZONE_INTRO_MS, () => { x.zoneIntro = false; x.paused = false; render(); });
      });
      delay = ZONE_ENTER_DELAY_MS + ZONE_INTRO_MS + 300;
    }
    after(delay, nextQuestion);
    render();
  };

  const toggleMute = () => { setMuted(!muted); setMutedState(!muted); if (muted) unlockAudio(); };

  /* ---------- 画面 ---------- */
  const header = (
    <div className="mb-3 flex items-center justify-between gap-2">
      <button className="btn" onClick={onExit}>{tx(lang, 'back')}</button>
      <b className="text-lg">{tx(lang, 'title')} · {code}</b>
      <button className="btn" aria-label={tx(lang, 'sound')} onClick={toggleMute}>{muted ? '🔇' : '🔊'}</button>
    </div>
  );

  if (s.phase === 'ready') {
    return (
      <main className="mx-auto max-w-3xl p-4">
        {header}
        <div className="card space-y-3 text-center">
          <h2 className="text-2xl font-black fx-rainbow-text">{tx(lang, 'title')}</h2>
          <p className="text-sm text-stone-500">{exam.name[lang]}</p>
          <ul className="mx-auto max-w-md space-y-1 text-left text-sm">
            {T.rules[lang].map((r) => <li key={r}>・{r}</li>)}
          </ul>
          <p className="text-xs text-stone-500">{tx(lang, 'single')}</p>
          {s.prevBest > 0 && <p className="text-sm">{tx(lang, 'best')}: <b>{s.prevBest.toLocaleString()}</b> pt</p>}
          {singles.length === 0 ? <p>{tx(lang, 'noQ')}</p> : <button className="btn-primary text-lg" onClick={start}>{tx(lang, 'start')}</button>}
        </div>
      </main>
    );
  }

  if (s.phase === 'result') {
    return (
      <main className="mx-auto max-w-3xl p-4">
        {header}
        <div className="card space-y-3 text-center">
          <h2 className="text-2xl font-black">{tx(lang, 'timeup')}</h2>
          <p className="text-6xl font-black fx-rainbow-text">{s.points.toLocaleString()}<span className="text-lg"> pt</span></p>
          {s.newBest && <p className="font-bold text-orange-600">{tx(lang, 'newBest')}</p>}
          <dl className="mx-auto grid max-w-sm grid-cols-2 gap-1 text-left text-sm">
            <dt>{tx(lang, 'correct')}</dt><dd>{s.correct} / {s.answered}</dd>
            <dt>{tx(lang, 'bestStreak')}</dt><dd>{s.bestStreak}</dd>
            <dt>{tx(lang, 'zones')}</dt><dd>{s.zoneCount}</dd>
            <dt>{tx(lang, 'bestMult')}</dt><dd>×{s.bestMult}</dd>
            <dt>{tx(lang, 'best')}</dt><dd>{Math.max(s.prevBest, s.points).toLocaleString()} pt</dd>
          </dl>
          <div className="flex justify-center gap-2">
            <button className="btn-primary" onClick={() => { g.current = fresh(Math.max(s.prevBest, s.points)); start(); }}>{tx(lang, 'retry')}</button>
            <button className="btn" onClick={onExit}>{tx(lang, 'back')}</button>
          </div>
        </div>
      </main>
    );
  }

  const q = s.q!;
  const hurry = s.left <= 10_000;
  const scenario = exam.scenarios?.list.find((x) => x.id === q.scenarioId);
  const tier = tierOf(Math.max(s.streak, 1));
  const revealed = s.status === 'right' || s.status === 'wrong';

  return (
    <main className="mx-auto max-w-3xl p-4">
      {header}
      <div className="mb-2 flex items-end justify-between">
        <div className={`font-mono text-3xl font-black ${hurry ? 'hurry' : ''}`}>{formatTime(s.left)}</div>
        <div className="text-right">
          <div className="text-2xl font-black">{s.points.toLocaleString()} <span className="text-sm">pt</span></div>
          {s.streak > 0 && <div className="text-sm font-bold">{TIER_BADGE[tier]} {s.streak} {lang === 'ja' ? 'れんぞく' : 'streak'}</div>}
        </div>
      </div>
      <div className="mb-3 h-2 rounded bg-stone-200 dark:bg-stone-800">
        <div className={`h-2 rounded ${hurry ? 'bg-red-600' : 'bg-orange-500'}`} style={{ width: `${(s.left / TIME_LIMIT_MS) * 100}%` }} />
      </div>
      {s.zone && (
        <div className="mb-2 text-center font-black fx-rainbow-text">
          {tx(lang, 'zone')} · {s.zoneRun} {tx(lang, 'combo')}
        </div>
      )}
      {s.phase === 'chance' && (
        <div className="card mb-3 text-center">
          <p className="font-bold">{tx(lang, 'chance')}</p>
          <p className="my-2 text-6xl font-black fx-rainbow-text">×{s.reel}</p>
          {s.mult === 1 && <button className="btn-primary" onClick={() => s.stopFn?.()}>{tx(lang, 'stop')}</button>}
        </div>
      )}
      {s.mult > 1 && s.phase === 'play' && <p className="mb-2 text-center font-black text-orange-600">×{s.mult}</p>}
      {scenario && (
        <p className="mb-2 text-xs text-stone-500"><b>{scenario.id}: {scenario.title[lang]}</b> — {scenario.description[lang]}</p>
      )}
      <div className={`card ${s.zone ? 'zone-ring' : ''}`}>
        <p className="whitespace-pre-wrap leading-relaxed">{q.stem[lang]}</p>
        <ul className="mt-3 space-y-2">
          {s.opts.map((o) => {
            const isPicked = s.picked === o.id;
            const isAns = q.answer[0] === o.id;
            let cls = 'border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800';
            if (s.status === 'charging' && isPicked) cls = 'border-orange-600 bg-orange-50 dark:bg-orange-950 animate-pulse';
            if (revealed && isAns) cls = 'border-green-600 bg-green-50 dark:bg-green-950';
            else if (revealed && isPicked) cls = 'border-red-600 bg-red-50 dark:bg-red-950';
            return (
              <li key={o.id}>
                <button
                  className={`w-full cursor-pointer rounded-lg border p-3 text-left disabled:cursor-default ${cls}`}
                  disabled={s.status !== 'idle' || s.phase !== 'play'}
                  onClick={(e) => pick(o.id, e.currentTarget)}
                >
                  <b className="mr-2">{o.id}.</b>{o[lang]}
                </button>
              </li>
            );
          })}
        </ul>
        {s.status === 'right' && <p className="mt-3 font-bold text-green-600">{LABELS[s.lastTier][lang]} +{s.lastGain}</p>}
        {s.status === 'wrong' && (
          <div className="mt-3 space-y-2">
            <p className="font-bold text-red-600">{tx(lang, 'wrong')}</p>
            <p className="text-sm whitespace-pre-wrap">{q.explanation[lang]}</p>
            <button className="btn-primary" onClick={nextQuestion}>{tx(lang, 'next')}</button>
          </div>
        )}
      </div>
    </main>
  );
}
