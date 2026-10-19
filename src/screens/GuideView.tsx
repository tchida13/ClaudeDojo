import { useApp } from '../ctx';
import { EXAM_BY_CODE } from '../data/exams';
import { GUIDES, LOGISTICS } from '../data/guides';
import { BANK } from '../data/bank';
import type { ExamCode, Lang } from '../types';

const T = {
  back: { ja: '戻る', en: 'Back' },
  overview: { ja: '試験の概要', en: 'Overview' },
  forWhom: { ja: '対象者', en: 'Who it is for' },
  notFor: { ja: '対象外', en: 'Not intended for' },
  experience: { ja: '推奨される経験', en: 'Recommended experience' },
  format: { ja: '出題の特徴', en: 'What to expect' },
  domains: { ja: '出題分野と問われる知識', en: 'Domains and what is tested' },
  knows: { ja: '問われる知識・スキル', en: 'Knowledge and skills' },
  traps: { ja: 'よくある落とし穴', en: 'Common traps' },
  practice: { ja: 'この分野を練習(10問)', en: 'Practice this domain (10)' },
  noQ: { ja: '問題なし', en: 'No questions' },
  strategy: { ja: '攻略法', en: 'Strategy' },
  plan: { ja: '学習の進め方', en: 'How to study' },
  heuristics: { ja: '正解を選ぶ定石', en: 'Rules of thumb for picking answers' },
  heuristicsNote: { ja: '公式ガイドの重点とサンプル問題の解説から整理したものです。', en: 'Distilled from the official guide\'s emphasis and sample-question explanations.' },
  handsOn: { ja: 'ガイド推奨の実践課題', en: 'Hands-on exercises from the guide' },
  logistics: { ja: '受験情報(全試験共通)', en: 'Exam logistics (all exams)' },
  facts: { ja: '試験の基本情報', en: 'Key facts' },
  items: { ja: '問題数', en: 'Items' },
  time: { ja: '試験時間', en: 'Time' },
  pass: { ja: '合格ライン', en: 'Passing' },
  fee: { ja: '受験料', en: 'Fee' },
  validity: { ja: '有効期間', en: 'Validity' },
  months: { ja: '12か月', en: '12 months' },
  min: { ja: '分', en: ' min' },
  go: { ja: '模擬試験・練習へ', en: 'Go to mock exam & practice' },
  disclaimer: {
    ja: 'この解説は、公開されている試験ガイド(v1.0、2026年7月施行)をもとに非公式にまとめたものです。内容・料金・規則は変更される場合があるため、受験前に Anthropic Partner Academy と Pearson VUE の最新情報を確認してください。',
    en: 'An unofficial summary of the published exam guide (v1.0, effective July 2026). Content, fees and rules may change; check the Anthropic Partner Academy and Pearson VUE before you book.',
  },
} satisfies Record<string, Record<Lang, string>>;

export function GuideView({ code, onBack, onMenu, onPractice }: {
  code: ExamCode; onBack: () => void; onMenu: () => void; onPractice: (domain: number) => void;
}) {
  const { lang } = useApp();
  const x = (k: keyof typeof T) => T[k][lang];
  const exam = EXAM_BY_CODE[code];
  const g = GUIDES[code];
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="card space-y-2"><h3 className="text-lg font-bold">{title}</h3>{children}</section>
  );
  const List = ({ items }: { items: { ja: string; en: string }[] }) => (
    <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">{items.map((i, n) => <li key={n}>{i[lang]}</li>)}</ul>
  );
  const facts: [string, string][] = [
    [x('items'), `${exam.items}`], [x('time'), `${exam.minutes}${x('min')}`],
    [x('pass'), `${exam.passScore} / 1000`], [x('fee'), `$${exam.feeUsd}`], [x('validity'), x('months')],
  ];
  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      <div className="flex gap-2">
        <button className="btn" onClick={onBack}>{x('back')}</button>
        <button className="btn-primary" onClick={onMenu}>{x('go')}</button>
      </div>
      <div>
        <div className="font-mono text-xs text-orange-600">{exam.code}</div>
        <h2 className="text-2xl font-bold">{exam.name[lang]}</h2>
        <p className="mt-1 text-stone-600 dark:text-stone-400">{g.tagline[lang]}</p>
      </div>

      <Section title={x('facts')}>
        <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-5">
          {facts.map(([k, v]) => (
            <div key={k} className="rounded-lg bg-stone-100 p-2 text-center dark:bg-stone-800">
              <dt className="text-xs text-stone-500">{k}</dt><dd className="font-bold">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title={x('overview')}>
        <h4 className="text-sm font-semibold">{x('forWhom')}</h4>
        <p className="text-sm leading-relaxed">{g.audience[lang]}</p>
        <h4 className="text-sm font-semibold">{x('notFor')}</h4>
        <p className="text-sm leading-relaxed">{g.notFor[lang]}</p>
        <h4 className="text-sm font-semibold">{x('experience')}</h4>
        <List items={g.experience} />
      </Section>

      <Section title={x('format')}>
        <List items={g.format} />
        {exam.scenarios && (
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {exam.scenarios.list.map((s) => (
              <li key={s.id} className="rounded-lg border border-stone-200 p-2 text-xs dark:border-stone-700">
                <b>{s.id}. {s.title[lang]}</b>
                <p className="mt-1 text-stone-500">{s.description[lang]}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={x('domains')}>
        <div className="space-y-4">
          {g.domains.map((d) => {
            const dom = exam.domains.find((e) => e.id === d.id)!;
            const n = BANK.filter((q) => q.exam === code && q.domain === d.id).length;
            return (
              <details key={d.id} className="rounded-lg border border-stone-200 p-3 dark:border-stone-700" open={d.id === 1}>
                <summary className="cursor-pointer">
                  <span className="font-semibold">D{d.id} {dom.name[lang]}</span>
                  <span className="ml-2 text-sm text-orange-600">{dom.weight}%</span>
                  <div className="mt-1 h-1.5 rounded bg-stone-200 dark:bg-stone-800">
                    <div className="h-1.5 rounded bg-orange-500" style={{ width: `${Math.min(100, dom.weight * 3)}%` }} />
                  </div>
                </summary>
                <h4 className="mt-3 text-sm font-semibold">{x('knows')}</h4>
                <List items={d.knows} />
                {d.traps && (
                  <>
                    <h4 className="mt-3 text-sm font-semibold text-red-600">⚠ {x('traps')}</h4>
                    <List items={d.traps} />
                  </>
                )}
                <button className="btn mt-3" disabled={!n} onClick={() => onPractice(d.id)}>
                  {n ? x('practice') : x('noQ')}
                </button>
              </details>
            );
          })}
        </div>
      </Section>

      <Section title={x('strategy')}>
        <h4 className="text-sm font-semibold">{x('plan')}</h4>
        <ol className="list-decimal space-y-1 pl-5 text-sm leading-relaxed">{g.plan.map((p, n) => <li key={n}>{p[lang]}</li>)}</ol>
        <h4 className="mt-3 text-sm font-semibold">{x('heuristics')}</h4>
        <p className="text-xs text-stone-500">{x('heuristicsNote')}</p>
        <List items={g.heuristics} />
        {g.handsOn && (
          <>
            <h4 className="mt-3 text-sm font-semibold">{x('handsOn')}</h4>
            <List items={g.handsOn} />
          </>
        )}
      </Section>

      <Section title={x('logistics')}>
        <dl className="space-y-2 text-sm">
          {LOGISTICS.map((l, n) => (
            <div key={n}><dt className="font-semibold">{l.title[lang]}</dt><dd className="leading-relaxed text-stone-600 dark:text-stone-400">{l.body[lang]}</dd></div>
          ))}
        </dl>
      </Section>

      <p className="text-xs text-stone-500">{x('disclaimer')}</p>
      <button className="btn-primary" onClick={onMenu}>{x('go')}</button>
    </div>
  );
}
