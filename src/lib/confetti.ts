/**
 * 紙吹雪。画面いっぱいの canvas を必要なときだけ作る（押した場所から飛び出す）。
 * OS の「視差効果を減らす」設定では何もしない。
 */
const COLORS = ["#ff8a65", "#3aa476", "#ffd166", "#7cc6ff", "#ff7aa8", "#9ddcbc", "#b39dff"];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  color: string;
  star: boolean;
  life: number;
  /** 1フレームごとに減る life（大きいほど早く消える） */
  fade: number;
};

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let raf = 0;

function reducedMotion() {
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "50" });
  document.body.append(canvas);
  ctx = canvas.getContext("2d");
  const resize = () => {
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  addEventListener("resize", resize);
  resize();
}

function drawStar(c: CanvasRenderingContext2D, r: number) {
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  c.closePath();
  c.fill();
}

function loop() {
  if (raf || !ctx) return;
  const c = ctx;
  const step = () => {
    c.clearRect(0, 0, innerWidth, innerHeight);
    particles = particles.filter((p) => p.y < innerHeight + 40 && p.life > 0);
    for (const p of particles) {
      p.vy += 0.28;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= p.fade;
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rot);
      c.globalAlpha = Math.max(0, Math.min(1, p.life * 1.5));
      c.fillStyle = p.color;
      if (p.star) drawStar(c, p.w * 0.9);
      else c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * 0.6);
      c.restore();
    }
    if (particles.length) raf = requestAnimationFrame(step);
    else {
      raf = 0;
      c.clearRect(0, 0, innerWidth, innerHeight);
    }
  };
  raf = requestAnimationFrame(step);
}

/**
 * (x, y) から count 個の紙吹雪を飛ばす。power は勢い。
 * fade は消える速さ（既定は約2.8秒。ひかえめな演出では 0.035 ＝約0.5秒）
 */
export function burst(x: number, y: number, count: number, power = 1, fade = 0.006): void {
  if (reducedMotion()) return;
  ensureCanvas();
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5;
    const speed = (6 + Math.random() * 8) * power;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      color: COLORS[i % COLORS.length],
      star: Math.random() < 0.3,
      life: 1,
      fade,
    });
  }
  loop();
}

/** 要素の中心から紙吹雪を飛ばす */
export function burstFrom(el: Element, count: number, power = 1, fade?: number): void {
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, count, power, fade);
}

/** 画面の上から count 個を降らせる（colors を渡すと、その色だけにする） */
export function shower(count: number, colors: readonly string[] = COLORS, fade = 0.004): void {
  if (reducedMotion()) return;
  ensureCanvas();
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * innerWidth,
      y: -20 - Math.random() * innerHeight * 0.5,
      vx: (Math.random() - 0.5) * 2,
      vy: 2 + Math.random() * 3,
      w: 8 + Math.random() * 6,
      h: 6 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: colors[i % colors.length],
      star: i % 2 === 1,
      life: 1,
      fade,
    });
  }
  loop();
}

export const RAINBOW_COLORS = ["#ff3b3b", "#ff9f1a", "#ffd21a", "#2fd27a", "#2f8cff", "#8e5cff"] as const;
