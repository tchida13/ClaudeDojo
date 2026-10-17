import type { Lang, Question } from '../types';
import { t } from '../i18n';

type Props = {
  q: Question;
  lang: Lang;
  selected: string[];
  onToggle: (id: string) => void;
  reveal: boolean;
};

export function QuestionView({ q, lang, selected, onToggle, reveal }: Props) {
  const ans = new Set(q.answer);
  const sel = new Set(selected);
  return (
    <div>
      <p className="whitespace-pre-wrap leading-relaxed">{q.stem[lang]}</p>
      <p className="mt-2 text-xs text-stone-500">
        {q.type === 'multiple' ? (lang === 'ja' ? `${q.select}${t(lang, 'selectN')}` : `${t(lang, 'selectN')} ${q.select}`) : t(lang, 'selectOne')}
      </p>
      <ul className="mt-3 space-y-2">
        {q.options.map((o) => {
          const isSel = sel.has(o.id);
          let cls = 'border-stone-300 dark:border-stone-700';
          if (reveal) {
            if (ans.has(o.id)) cls = 'border-green-600 bg-green-50 dark:bg-green-950';
            else if (isSel) cls = 'border-red-600 bg-red-50 dark:bg-red-950';
          } else if (isSel) cls = 'border-orange-600 bg-orange-50 dark:bg-orange-950';
          return (
            <li key={o.id}>
              <label className={`flex gap-3 rounded-lg border p-3 cursor-pointer ${cls}`}>
                <input
                  type={q.type === 'multiple' ? 'checkbox' : 'radio'}
                  name={q.id}
                  checked={isSel}
                  disabled={reveal}
                  onChange={() => onToggle(o.id)}
                  className="mt-1"
                />
                <span><b className="mr-2">{o.id}.</b>{o[lang]}</span>
              </label>
              {reveal && !ans.has(o.id) && q.optionRationale?.[o.id] && (
                <p className="ml-9 mt-1 text-xs text-stone-600 dark:text-stone-400">
                  {t(lang, 'whyWrong')}: {q.optionRationale[o.id][lang]}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      {reveal && (
        <div className="card mt-4">
          <h4 className="font-semibold mb-1">{t(lang, 'explanation')}</h4>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{q.explanation[lang]}</p>
        </div>
      )}
    </div>
  );
}
