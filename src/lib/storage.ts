import type { Attempt, History, Lang } from '../types';

const KEY = 'claudedojo:v1';
const LANG_KEY = 'claudedojo:lang';

export const emptyHistory = (): History => ({ version: 1, attempts: [], bookmarks: [], updatedAt: 0 });

export function parseHistory(raw: unknown): History {
  const o = raw as Partial<History> | null;
  if (!o || o.version !== 1 || !Array.isArray(o.attempts) || !Array.isArray(o.bookmarks)) {
    throw new Error('Invalid history file');
  }
  return { version: 1, attempts: o.attempts as Attempt[], bookmarks: o.bookmarks as string[], updatedAt: Number(o.updatedAt) || 0 };
}

export function loadHistory(): History {
  try {
    const s = localStorage.getItem(KEY);
    return s ? parseHistory(JSON.parse(s)) : emptyHistory();
  } catch {
    return emptyHistory();
  }
}

export function saveHistory(h: History): History {
  const next = { ...h, updatedAt: Date.now() };
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
  return next;
}

/** Union by attempt id / bookmark id; used when importing. */
export function mergeHistory(a: History, b: History): History {
  const byId = new Map<string, Attempt>();
  for (const at of [...a.attempts, ...b.attempts]) byId.set(at.id, at);
  return {
    version: 1,
    attempts: [...byId.values()].sort((x, y) => x.startedAt - y.startedAt),
    bookmarks: [...new Set([...a.bookmarks, ...b.bookmarks])],
    updatedAt: Math.max(a.updatedAt, b.updatedAt),
  };
}

export function loadLang(): Lang {
  try {
    const s = localStorage.getItem(LANG_KEY);
    if (s === 'ja' || s === 'en') return s;
  } catch { /* ignore */ }
  return typeof navigator !== 'undefined' && navigator.language.startsWith('ja') ? 'ja' : 'en';
}

export function saveLang(l: Lang) {
  try { localStorage.setItem(LANG_KEY, l); } catch { /* ignore */ }
}
