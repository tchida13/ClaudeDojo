import { parseHistory } from './storage';
import type { History } from '../types';

export const GOOGLE_CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';
export const driveEnabled = !!GOOGLE_CLIENT_ID;

const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const FILE_NAME = 'claudedojo-history.json';
const CSV_NAME = 'claudedojo-results.csv';

type TokenClient = { requestAccessToken: (o?: { prompt?: string }) => void };
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (c: {
            client_id: string; scope: string;
            callback: (r: { access_token?: string; error?: string }) => void;
            error_callback?: (e: unknown) => void;
          }) => TokenClient;
        };
      };
    };
  }
}

let gisLoading: Promise<void> | null = null;
function loadGis(): Promise<void> {
  if (window.google?.accounts) return Promise.resolve();
  gisLoading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { gisLoading = null; reject(new Error('Failed to load Google Identity Services')); };
    document.head.appendChild(s);
  });
  return gisLoading;
}

let cached: { token: string; exp: number } | null = null;

async function getToken(): Promise<string> {
  if (cached && cached.exp > Date.now() + 30_000) return cached.token;
  await loadGis();
  return new Promise((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPE,
      callback: (r) => {
        if (r.access_token) { cached = { token: r.access_token, exp: Date.now() + 50 * 60_000 }; resolve(r.access_token); }
        else reject(new Error(r.error ?? 'Authorization failed'));
      },
      error_callback: (e) => reject(new Error(typeof e === 'object' && e && 'type' in e ? String((e as { type: string }).type) : 'Authorization cancelled')),
    });
    client.requestAccessToken();
  });
}

async function api(token: string, url: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, ...(init.headers ?? {}) } });
  if (!res.ok) throw new Error(`Drive API ${res.status}`);
  return res;
}

async function findFile(token: string, name: string): Promise<string | null> {
  const q = encodeURIComponent(`name='${name}' and trashed=false`);
  const res = await api(token, `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id)&spaces=drive`);
  const j = (await res.json()) as { files: { id: string }[] };
  return j.files[0]?.id ?? null;
}

async function upload(token: string, name: string, mime: string, body: string): Promise<void> {
  const id = await findFile(token, name);
  const boundary = 'cd' + Math.random().toString(36).slice(2);
  const meta = id ? { name } : { name, mimeType: mime };
  const payload =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n` +
    `--${boundary}\r\nContent-Type: ${mime}\r\n\r\n${body}\r\n--${boundary}--`;
  const url = id
    ? `https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=multipart`
    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
  await api(token, url, { method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': `multipart/related; boundary=${boundary}` }, body: payload });
}

export async function saveToDrive(h: History, csv: string): Promise<void> {
  const token = await getToken();
  await upload(token, FILE_NAME, 'application/json', JSON.stringify(h));
  await upload(token, CSV_NAME, 'text/csv', csv);
}

/** Loads the history saved by this app (drive.file scope only sees files this app created). */
export async function loadFromDrive(): Promise<History | null> {
  const token = await getToken();
  const id = await findFile(token, FILE_NAME);
  if (!id) return null;
  const res = await api(token, `https://www.googleapis.com/drive/v3/files/${id}?alt=media`);
  return parseHistory(await res.json());
}
