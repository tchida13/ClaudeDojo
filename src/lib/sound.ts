/** ドパドパモードの効果音。すべて Web Audio で合成する(音声ファイルは使わない)。 */
let ctx: AudioContext | null = null;
const MUTE_KEY = 'claudedojo:mute';

export function isMuted(): boolean {
  try { return localStorage.getItem(MUTE_KEY) === '1'; } catch { return false; }
}
export function setMuted(m: boolean) {
  try { localStorage.setItem(MUTE_KEY, m ? '1' : '0'); } catch { /* ignore */ }
}

function audio(): AudioContext | null {
  if (isMuted()) return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function note(c: AudioContext, freq: number, at: number, dur: number, type: OscillatorType = 'triangle', vol = 0.2) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(vol, at + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(g).connect(c.destination);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

/** タップの中で呼び、以降の音を鳴らせるようにする */
export function unlockAudio(): void { audio(); }

/** 正解の音。連続正解のたびに半音ずつ高くなる(最大12段) */
export function playCorrect(streak: number): void {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + 0.01;
  const base = 587.33 * Math.pow(2, (Math.min(Math.max(streak, 1), 12) - 1) / 12);
  const steps = streak >= 5 ? [1, 1.26, 1.5, 2] : streak >= 3 ? [1, 1.26, 1.5] : [1, 1.5];
  steps.forEach((r, i) => {
    note(c, base * r, t + i * 0.075, 0.32, 'triangle', 0.18);
    note(c, base * r * 2, t + i * 0.075, 0.18, 'sine', 0.05);
  });
  if (streak >= 5) note(c, base * 4, t + steps.length * 0.075, 0.5, 'sine', 0.06);
}

export function playWrong(): void {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + 0.01;
  note(c, 311.13, t, 0.22, 'sine', 0.14);
  note(c, 261.63, t + 0.14, 0.32, 'sine', 0.12);
}

/** 「キュイン」: 短い音程の上昇の繰り返し */
export function playKyuin(times = 3): void {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + 0.01;
  for (let i = 0; i < times; i++) {
    const at = t + i * 0.16;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(700, at);
    osc.frequency.exponentialRampToValueAtTime(2600, at + 0.12);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(0.08, at + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.15);
    osc.connect(g).connect(c.destination);
    osc.start(at);
    osc.stop(at + 0.18);
  }
}

export function playFanfare(delay = 0): void {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + 0.01 + delay;
  const seq: [number, number][] = [[523.25, 0], [659.25, 0.12], [783.99, 0.24], [1046.5, 0.36], [783.99, 0.56], [1046.5, 0.68]];
  seq.forEach(([f, d], i) => {
    const long = i === seq.length - 1;
    note(c, f, t + d, long ? 0.7 : 0.22, 'square', 0.07);
    note(c, f / 2, t + d, long ? 0.7 : 0.22, 'triangle', 0.1);
  });
}

/** 溜めの「ププッ」 */
export function playCharge(): void {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + 0.01;
  note(c, 1400, t, 0.04, 'square', 0.05);
  note(c, 1750, t + 0.07, 0.04, 'square', 0.05);
}

export function playTick(freq = 1100): void {
  const c = audio();
  if (!c) return;
  note(c, freq, c.currentTime + 0.005, 0.04, 'square', 0.04);
}

/** 試合開始・終了のゴング風の音 */
export function playGong(): void {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + 0.01;
  note(c, 196, t, 1.2, 'sine', 0.2);
  note(c, 392 * 1.01, t, 0.9, 'triangle', 0.08);
  note(c, 587, t, 0.6, 'sine', 0.05);
}

/** ドパゾーン突入のホーン */
export function playHorn(): void {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + 0.01;
  note(c, 440, t, 0.5, 'sawtooth', 0.07);
  note(c, 554, t, 0.5, 'sawtooth', 0.06);
  note(c, 659, t + 0.12, 0.5, 'sawtooth', 0.06);
}
