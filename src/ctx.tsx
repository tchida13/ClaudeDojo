import { createContext, useContext } from 'react';
import type { History, Lang } from './types';

export type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  history: History;
  updateHistory: (fn: (h: History) => History) => void;
};
export const AppCtx = createContext<Ctx>(null!);
export const useApp = () => useContext(AppCtx);
