import type { Question } from '../types';

const modules = import.meta.glob('./questions/*.json', { eager: true, import: 'default' }) as Record<string, Question[]>;
export const BANK: Question[] = Object.values(modules).flat();
