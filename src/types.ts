export type Lang = 'ja' | 'en';
export type ExamCode = 'CCAO-F' | 'CCDV-F' | 'CCAR-F' | 'CCAR-P';
export type L10n = { ja: string; en: string };

export type Option = { id: string; ja: string; en: string };

export type Question = {
  id: string;
  exam: ExamCode;
  domain: number;
  taskStatement?: string;
  scenarioId?: string;
  type: 'single' | 'multiple';
  select: number;
  stem: L10n;
  options: Option[];
  answer: string[];
  explanation: L10n;
  optionRationale?: Record<string, L10n>;
  difficulty?: 1 | 2 | 3;
};

export type Domain = { id: number; name: L10n; weight: number };
export type Scenario = { id: string; title: L10n; description: L10n };

export type Exam = {
  code: ExamCode;
  name: L10n;
  items: number;
  minutes: number;
  passScore: number;
  feeUsd: number;
  domains: Domain[];
  scenarios?: { pick: number; list: Scenario[] };
};

export type AnswerRecord = { questionId: string; selected: string[]; correct: boolean };

export type AttemptMode = 'mock' | 'practice' | 'quick' | 'dopa';

export type Attempt = {
  id: string;
  exam: ExamCode;
  mode: AttemptMode;
  startedAt: number;
  finishedAt: number;
  durationSec: number;
  answers: AnswerRecord[];
  flagged: string[];
  scaledScore: number | null; // mock only
  points?: number; // dopa mode only
  passed: boolean | null;
};

export type History = {
  version: 1;
  attempts: Attempt[];
  bookmarks: string[];
  updatedAt: number;
};
