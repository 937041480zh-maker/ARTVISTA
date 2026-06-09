'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface CardData {
  id: number;
  slug: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
}

const cardsData: CardData[] = [
  {
    id: 0,
    slug: 'touchdesigner',
    image: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format')",
    title: 'TouchDesigner',
    subtitle: 'NODE VISUAL',
    description: '实时节点可视化编程，创造沉浸式互动装置与视觉表演体验',
    tags: ['实时渲染', '装置艺术', '节点编程'],
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    id: 1,
    slug: 'audio-visual',
    image: "url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80&auto=format')",
    title: '音画互动',
    subtitle: 'AUDIO VISUAL',
    description: '声音驱动视觉生成，音频响应与可视化的艺术融合',
    tags: ['音频可视化', '响应式', '实时'],
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    id: 2,
    slug: 'generative-design',
    image: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80&auto=format')",
    title: '生成式设计',
    subtitle: 'GENERATIVE',
    description: '算法驱动形态生成，探索规则与随机之间的无限可能',
    tags: ['算法艺术', '参数化', '生成AI'],
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  },
  {
    id: 3,
    slug: 'code-art',
    image: "url('https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80&auto=format')",
    title: '代码交互',
    subtitle: 'CODE ART',
    description: '以代码为笔触，构建可触摸、可回应的数字艺术装置',
    tags: ['WebGL', 'p5.js', '交互'],
    icon: (
      <svg viewBox="0 0 24 24">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: 4,
    slug: 'venue',
    image: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80&auto=format')",
    title: '场馆动态',
    subtitle: 'VENUE',
    description: '沉浸式空间投影映射与大型场馆互动艺术现场记录',
    tags: ['投影映射', '空间艺术', '现场'],
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    id: 5,
    slug: 'live-vj',
    image: "url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80&auto=format')",
    title: '现场视觉',
    subtitle: 'LIVE VJ',
    description: '演出现场实时视觉表演，VJ艺术与现场视觉混合创作',
    tags: ['VJ', 'Live', '演出'],
    icon: (
      <svg viewBox="0 0 24 24">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    ),
  },
];

// Canvas animation functions
function drawCard0(ctx: CanvasRenderingContext2D, width: number, height: number, isOpen: boolean, time: number) {
  if (!isOpen) return;
  const nodes = (ctx as any)._nodes || [];
  if (!(ctx as any)._nodes) {
    (ctx as any)._nodes = Array.from({ length: 18 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0008,
      vy: (Math.random() - 0.5) * 0.0008,
      r: 2 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  const ns = (ctx as any)._nodes;
  ns.forEach((n: any) => {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > 1) n.vx *= -1;
    if (n.y < 0 || n.y > 1) n.vy *= -1;
  });

  ns.forEach((a: any, i: number) => {
    ns.slice(i + 1).forEach((b: any) => {
      const dx = (a.x - b.x) * width;
      const dy = (a.y - b.y) * height;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < width * 0.28) {
        const alpha = (1 - d / (width * 0.28)) * 0.35;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(167,110,255,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.moveTo(a.x * width, a.y * height);
        ctx.lineTo(b.x * width, b.y * height);
        ctx.stroke();
      }
    });
  });

  ns.forEach((n: any, i: number) => {
    const pulse = 0.6 + 0.4 * Math.sin(time * 2 + n.phase);
    ctx.beginPath();
    ctx.arc(n.x * width, n.y * height, n.r * pulse, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(196,148,255,${0.55 * pulse})`;
    ctx.fill();
    if (i % 4 === 0) {
      ctx.beginPath();
      ctx.arc(n.x * width, n.y * height, n.r * 2.2 * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(196,148,255,${0.18 * pulse})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  });

  const lines = ['if(frame%2==0){', '  emit(particle)', '  wave.freq+=.01', '}', `// nodes: ${ns.length}`];
  lines.forEach((l, i) => {
    const a = 0.06 + 0.06 * Math.sin(time + i);
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = `rgba(196,148,255,${a})`;
    ctx.fillText(l, 14, height - 70 + i * 13);
  });
}

function drawCard1(ctx: CanvasRenderingContext2D, width: number, height: number, isOpen: boolean, time: number) {
  if (!isOpen) return;
  const bars = 28;
  const bw = width / bars;
  for (let i = 0; i < bars; i++) {
    const phase = (i / bars) * Math.PI * 4 - time * 1.8;
    const amp = 0.18 + 0.22 * Math.abs(Math.sin((i / bars) * Math.PI));
    const bh = height * 0.12 + height * amp * Math.abs(Math.sin(phase));
    const alpha = 0.3 + 0.5 * Math.abs(Math.sin(phase));
    const grd = ctx.createLinearGradient(0, height / 2 - bh / 2, 0, height / 2 + bh / 2);
    grd.addColorStop(0, 'rgba(216,180,254,0)');
    grd.addColorStop(0.5, `rgba(167,110,255,${alpha})`);
    grd.addColorStop(1, 'rgba(216,180,254,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(i * bw + bw * 0.15, height / 2 - bh / 2, bw * 0.7, bh);
  }

  const cx = width / 2;
  const cy = height / 2;
  for (let r = 0; r < 3; r++) {
    const rr = width * 0.12 + r * width * 0.08 + Math.sin(time + r) * 4;
    ctx.beginPath();
    ctx.arc(cx, cy, rr, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(196,148,255,${0.1 - r * 0.025})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
}

function drawCard2(ctx: CanvasRenderingContext2D, width: number, height: number, isOpen: boolean, time: number) {
  if (!isOpen) return;
  const cx = width / 2;
  const cy = height / 2;
  for (let layer = 0; layer < 4; layer++) {
    const n = 3 + layer * 2;
    const R = width * 0.08 + layer * width * 0.07;
    const rot = time * (layer % 2 ? 1 : -1) * (layer * 0.4 + 0.3);
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2 + rot;
      const r = R * (1 + 0.15 * Math.sin(time * 2 + i + layer));
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(${180 + layer * 12},${100 + layer * 20},255,${0.25 - layer * 0.03})`;
    ctx.lineWidth = 0.9;
    ctx.stroke();
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + time * 0.4;
    const r = width * 0.22 + Math.sin(time + i) * 6;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2 + Math.sin(time * 2 + i), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(216,180,254,.55)`;
    ctx.fill();
  }
}

function drawCard3(ctx: CanvasRenderingContext2D, width: number, height: number, isOpen: boolean, time: number) {
  if (!isOpen) return;
  ctx.fillStyle = 'rgba(9,7,20,.18)';
  ctx.fillRect(0, 0, width, height);

  const chars = '01{}[]()<>=!+-*/;:.,?@#'.split('');
  const cols = (ctx as any)._cols || [];
  if (!(ctx as any)._cols) {
    const n = Math.floor(width / 12);
    (ctx as any)._cols = Array.from({ length: n }, (_, i) => ({
      x: i * 12 + 6,
      y: Math.random() * height,
      speed: 1 + Math.random() * 2,
      alpha: Math.random(),
    }));
  }

  const cs = (ctx as any)._cols;
  ctx.font = '11px JetBrains Mono, monospace';
  cs.forEach((c: any) => {
    c.y += c.speed;
    if (c.y > height) {
      c.y = -14;
      c.alpha = 0.3 + Math.random() * 0.5;
    }
    const ch = chars[Math.floor(Math.random() * chars.length)];
    const a = c.alpha * 0.7;
    ctx.fillStyle = `rgba(196,148,255,${a})`;
    ctx.fillText(ch, c.x, c.y);
    ctx.fillStyle = `rgba(255,255,255,${a * 0.3})`;
    ctx.fillText(ch, c.x, c.y - 14);
  });
}

function drawCard4(ctx: CanvasRenderingContext2D, width: number, height: number, isOpen: boolean, time: number) {
  if (!isOpen) return;
  const gx = 6;
  const gy = 5;
  for (let ix = 0; ix < gx; ix++) {
    for (let iy = 0; iy < gy; iy++) {
      const fx = ix / gx;
      const fy = iy / gy;
      const wave = Math.sin(fx * Math.PI * 2 - time * 1.5) * Math.cos(fy * Math.PI * 2 + time);
      const alpha = 0.06 + 0.22 * (0.5 + 0.5 * wave);
      const x = fx * width + width / gx / 2;
      const y = fy * height + height / gy / 2;
      const sz = (width / gx) * 0.4 + wave * 4;
      ctx.strokeStyle = `rgba(167,110,255,${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.strokeRect(x - sz / 2, y - sz / 2, sz, sz);
      const diag = Math.sin((ix + iy) / 2 + time) > 0.4;
      if (diag) {
        ctx.beginPath();
        ctx.moveTo(x - sz / 2, y - sz / 2);
        ctx.lineTo(x + sz / 2, y + sz / 2);
        ctx.strokeStyle = `rgba(216,180,254,${alpha * 0.6})`;
        ctx.stroke();
      }
    }
  }
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + time * 0.3;
    const r = width * 0.18 + Math.sin(time + i) * 8;
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2);
    ctx.lineTo(width / 2 + Math.cos(a) * r, height / 2 + Math.sin(a) * r);
    ctx.strokeStyle = `rgba(196,148,255,.15)`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
}

function drawCard5(ctx: CanvasRenderingContext2D, width: number, height: number, isOpen: boolean, time: number) {
  if (!isOpen) return;
  ctx.fillStyle = 'rgba(9,7,20,.22)';
  ctx.fillRect(0, 0, width, height);
  const cx = width / 2;
  const cy = height * 0.5;
  const beams = (ctx as any)._beams || [];
  if (!(ctx as any)._beams) {
    (ctx as any)._beams = Array.from({ length: 20 }, (_, i) => ({
      angle: (i / 20) * Math.PI * 2,
      speed: 0.003 + Math.random() * 0.005,
      len: 0.2 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
    }));
  }
  const bs = (ctx as any)._beams;
  bs.forEach((b: any) => {
    b.angle += b.speed;
    const pulse = 0.4 + 0.6 * Math.abs(Math.sin(time * 1.5 + b.phase));
    const len = Math.min(width, height) * b.len * pulse;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(b.angle) * len, cy + Math.sin(b.angle) * len);
    ctx.strokeStyle = `rgba(216,180,254,${0.18 * pulse})`;
    ctx.lineWidth = 0.8 + pulse;
    ctx.stroke();
  });
  for (let r = 1; r <= 4; r++) {
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(width, height) * r * 0.1, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(167,110,255,${0.12 - r * 0.02})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, 5 + 2 * Math.sin(time * 3), 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,220,255,.7)';
  ctx.fill();
}

const drawFunctions = [drawCard0, drawCard1, drawCard2, drawCard3, drawCard4, drawCard5];

function Card({ data, isOpen, onOpen }: { data: CardData; isOpen: boolean; onOpen: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    const parent = canvas.parentElement;
    if (parent) observer.observe(parent);

    let lastTime = 0;
    const animate = (timestamp: number) => {
      const delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      if (isOpen) {
        timeRef.current += delta * (data.id === 0 ? 0.018 : data.id === 1 ? 0.022 : data.id === 2 ? 0.012 : data.id === 3 ? 0.016 : data.id === 4 ? 0.014 : 0.018);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFunctions[data.id](ctx as CanvasRenderingContext2D, canvas.width, canvas.height, isOpen, timeRef.current);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [isOpen, data.id]);

  return (
    <Link
      href={`/categories/${data.slug}`}
      className={`${styles.card} ${isOpen ? styles.cardOpen : ''}`}
      onMouseEnter={onOpen}
    >
      <div className={styles.cbg} style={{ backgroundImage: data.image }} />
      <div className={styles.cover} />
      <canvas ref={canvasRef} className={styles.art} />
      <span className={styles.cnum}>0{data.id + 1}</span>
      <div className={styles.cicn}>{data.icon}</div>
      <div className={styles.cline} />
      <div className={styles.ctw}>
        <span className={styles.ctit}>{data.title}</span>
        <span className={styles.csub}>{data.subtitle}</span>
      </div>
      <div className={styles.cbody}>
        <p className={styles.cdesc}>{data.description}</p>
        <div className={styles.ctags}>
          {data.tags.map((tag) => (
            <span key={tag} className={styles.ctag}>
              {tag}
            </span>
          ))}
        </div>
        <Link href={`/artwork/${data.id}`} className={styles.ccta}>
          浏览作品
          <svg viewBox="0 0 10 10">
            <path d="M1 5h8M5 1l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </Link>
  );
}

export default function CategoriesPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + cardsData.length) % cardsData.length);
  }, []);

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % cardsData.length);
  }, []);

  return (
    <div className="min-h-screen bg-black pt-16">
      <h2 className="sr-only">Artvista 作品分类 — 六个交互卡片，鼠标悬停展开并显示动态艺术效果</h2>
      <div className={styles.wrap}>
        <div className={styles.scene}>
          {cardsData.map((card, index) => (
            <Card
              key={card.id}
              data={card}
              isOpen={activeIndex === index}
              onOpen={() => setActiveIndex(index)}
            />
          ))}
          <div className={styles.nav}>
            <button className={styles.nbtn} onClick={handlePrev} aria-label="上一个">
              <svg viewBox="0 0 12 12">
                <path d="M8 2L3 6l5 4" />
              </svg>
            </button>
            <button className={styles.nbtn} onClick={handleNext} aria-label="下一个">
              <svg viewBox="0 0 12 12">
                <path d="M4 2l5 4-5 4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
