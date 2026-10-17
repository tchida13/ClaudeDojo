import type { Tier } from './dopa';

/** 画面中央の文字・光・虹・揺れ。見た目は index.css の .fx-*。「視差効果を減らす」設定では出さない */
export function reducedMotion() {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function transient(className: string, ms: number): HTMLElement {
  const el = document.createElement('div');
  el.className = className;
  el.setAttribute('aria-hidden', 'true');
  document.body.append(el);
  setTimeout(() => el.remove(), ms);
  return el;
}

const FONT_SIZE: Record<Tier, string> = {
  blue: 'clamp(44px, 14vw, 64px)',
  green: 'clamp(44px, 14vw, 64px)',
  red: 'clamp(50px, 16vw, 72px)',
  gold: 'clamp(54px, 17vw, 78px)',
  rainbow: 'clamp(56px, 18vw, 84px)',
};

/** 長い文字は画面幅の88%に収める(全角=1、半角=0.6で数える) */
export function fitFontSize(text: string, tier: Tier): string {
  const width = Math.max(1, [...text].reduce((w, ch) => w + ((ch.codePointAt(0) ?? 0) < 0x2000 ? 0.6 : 1), 0));
  return `min(${FONT_SIZE[tier]}, ${Math.floor((88 / width) * 10) / 10}vw)`;
}

export function popText(main: string, sub: string | null, tier: Tier): void {
  if (reducedMotion()) return;
  const el = transient(`fx-combo fx-${tier}`, tier === 'rainbow' ? 1550 : 1150);
  el.style.fontSize = fitFontSize(main, tier);
  el.append(main);
  if (sub) {
    const s = document.createElement('small');
    s.textContent = sub;
    el.append(s);
  }
}

export function megaText(count: string, word: string, sub: string | null): void {
  if (reducedMotion()) return;
  const el = transient('fx-combo fx-rainbow fx-mega', 2250);
  el.style.fontSize = fitFontSize(word, 'rainbow');
  const num = document.createElement('span');
  num.className = 'fx-mega-num';
  num.textContent = count;
  el.append(num, word);
  if (sub) {
    const s = document.createElement('small');
    s.textContent = sub;
    el.append(s);
  }
}

export function flash(): void {
  if (!reducedMotion()) transient('fx-flash', 750);
}

export function rainbow(): void {
  if (!reducedMotion()) transient('fx-rainbow-bg', 1850);
}

export function shake(): void {
  if (reducedMotion()) return;
  const main = document.querySelector('main');
  if (!main) return;
  main.classList.remove('fx-shake');
  void main.offsetWidth;
  main.classList.add('fx-shake');
}
