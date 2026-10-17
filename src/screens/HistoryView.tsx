import { useRef, useState } from 'react';
import { useApp } from '../ctx';
import { t } from '../i18n';
import { attemptsToCsv } from '../lib/csv';
import { driveEnabled, loadFromDrive, saveToDrive } from '../lib/drive';
import { emptyHistory, mergeHistory, parseHistory } from '../lib/storage';

function download(name: string, mime: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type: mime }));
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export function HistoryView({ onBack }: { onBack: () => void }) {
  const { lang, history, updateHistory } = useApp();
  const [msg, setMsg] = useState('');
  const file = useRef<HTMLInputElement>(null);

  const run = async (fn: () => Promise<void>) => {
    try { await fn(); setMsg(t(lang, 'done')); } catch (e) { setMsg(`${t(lang, 'failed')}: ${(e as Error).message}`); }
  };
  const attempts = [...history.attempts].reverse();

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <button className="btn" onClick={onBack}>{t(lang, 'back')}</button>
      <div className="card space-y-2">
        <h3 className="font-semibold">{t(lang, 'backup')}</h3>
        <p className="text-sm text-stone-500">{t(lang, 'backupNote')}</p>
        <div className="flex flex-wrap gap-2">
          <button className="btn" onClick={() => download('claudedojo-history.json', 'application/json', JSON.stringify(history, null, 2))}>{t(lang, 'exportJson')}</button>
          <button className="btn" onClick={() => download('claudedojo-results.csv', 'text/csv', attemptsToCsv(history))}>{t(lang, 'exportCsv')}</button>
          <button className="btn" onClick={() => file.current?.click()}>{t(lang, 'importJson')}</button>
          <input ref={file} type="file" accept="application/json" hidden onChange={(e) => {
            const f = e.target.files?.[0]; e.target.value = '';
            if (f) run(async () => { const h = parseHistory(JSON.parse(await f.text())); updateHistory((cur) => mergeHistory(cur, h)); });
          }} />
          {driveEnabled && <>
            <button className="btn" onClick={() => run(() => saveToDrive(history, attemptsToCsv(history)))}>{t(lang, 'saveDrive')}</button>
            <button className="btn" onClick={() => run(async () => {
              const h = await loadFromDrive();
              if (!h) throw new Error(t(lang, 'driveNone'));
              updateHistory((cur) => mergeHistory(cur, h));
            })}>{t(lang, 'loadDrive')}</button>
          </>}
        </div>
        {msg && <p className="text-sm">{msg}</p>}
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">{t(lang, 'history')}</h3>
        {attempts.length === 0 ? <p className="text-sm text-stone-500">{t(lang, 'noHistory')}</p> : (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-stone-500"><th>{t(lang, 'date')}</th><th>Exam</th><th>{t(lang, 'mode')}</th><th>{t(lang, 'score')}</th></tr></thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id} className="border-t border-stone-200 dark:border-stone-800">
                  <td>{new Date(a.startedAt).toLocaleString()}</td>
                  <td>{a.exam}</td>
                  <td>{a.mode === 'mock' ? t(lang, 'mockModeShort') : t(lang, 'practiceModeShort')}</td>
                  <td>{a.answers.filter((x) => x.correct).length}/{a.answers.length}{a.scaledScore != null && ` (${a.scaledScore})`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <button className="btn" onClick={() => window.confirm(t(lang, 'confirmClear')) && updateHistory(() => emptyHistory())}>{t(lang, 'clear')}</button>
    </div>
  );
}
