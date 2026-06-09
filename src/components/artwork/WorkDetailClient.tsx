"use client";

import { useEffect, useRef, useState } from "react";

interface WorkDetailClientProps {
  id: string;
}

export default function WorkDetailClient({ id }: WorkDetailClientProps) {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [followed, setFollowed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── 背景紫色霓虹雾气 ──────────────────────────────────────────
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const blobs = [
      { x: 0.1,  y: 0.15, r: 0.5,  c: [110, 20, 210], a: 0.5,  dx: 0.22, dy: 0.16 },
      { x: 0.75, y: 0.08, r: 0.42, c: [150, 45, 255], a: 0.38, dx: -0.18, dy: 0.20 },
      { x: 0.55, y: 0.6,  r: 0.38, c: [80,   0, 180], a: 0.35, dx: 0.16,  dy: -0.22 },
      { x: 0.88, y: 0.55, r: 0.32, c: [170, 60, 255], a: 0.28, dx: -0.20, dy: 0.14 },
    ];
    let t = 0;
    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#06010f"; ctx.fillRect(0, 0, w, h);
      blobs.forEach((b, i) => {
        const cx = (b.x + Math.sin(t * 0.32 + i * 1.3) * b.dx) * w;
        const cy = (b.y + Math.cos(t * 0.28 + i * 1.0) * b.dy) * h;
        const r  = b.r * Math.min(w, h);
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0,   `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.a})`);
        g.addColorStop(0.5, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.a * 0.22})`);
        g.addColorStop(1,   "transparent");
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      });
      t += 0.009;
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animRef.current); };
  }, []);

  // ── 数据 ──────────────────────────────────────────────────────
  const work = {
    id,
    title: `声音涟漪 #${id}`,
    category: "生成艺术 · 实时交互",
    desc: "以城市环境声为原始素材，通过音频频谱分析实时驱动粒子场运动，将不可见的声波转化为流动的视觉涟漪。作品曾于 MAMA 音乐节现场展出，与观众形成实时交互。",
    tags: ["生成艺术", "TouchDesigner", "实时交互", "GLSL", "Audio Reactive"],
    year: "2025",
    views: "12.4k",
    likes: "834",
  };

  const author = {
    name: "林默",
    handle: "@linmo",
    role: "实时视觉艺术家",
    online: true,
  };

  const moreWorks = [
    { title: "频率地图",    year: "2025", color: ["60,20,180", "155,48,255"] },
    { title: "光之折叠",    year: "2024", color: ["20,80,200", "80,160,255"] },
    { title: "噪声地形",    year: "2024", color: ["100,10,160","180,40,220"] },
    { title: "粒子编年史",  year: "2023", color: ["40,0,140",  "120,20,200"] },
  ];

  const recommended = [
    { title: "数字森林",     author: "陈晓雨", tag: "装置艺术",  color: ["20,100,160","60,180,255"] },
    { title: "镜像意识",     author: "王远飞", tag: "交互装置",  color: ["80,20,160", "160,60,255"] },
    { title: "熵增时刻",     author: "Liu Fang", tag: "生成艺术", color: ["10,80,140", "40,160,220"] },
    { title: "信号与噪声",   author: "张墨",   tag: "视听装置",  color: ["60,10,140", "140,40,220"] },
    { title: "流体记忆",     author: "Kai Sun", tag: "实时渲染", color: ["30,60,180", "80,140,255"] },
    { title: "褶皱地图",     author: "余欣",   tag: "数据可视化",color: ["80,0,160",  "160,40,240"] },
  ];

  // ── 样式常量 ──────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "0.5px solid rgba(255,255,255,0.08)",
    borderRadius: 16, overflow: "hidden",
  };

  const btnBase: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "9px 20px", borderRadius: 10, fontSize: 13,
    cursor: "pointer", fontFamily: "inherit", border: "none",
    transition: "all 0.15s",
  };

  const iconBtn: React.CSSProperties = {
    ...btnBase,
    background: "rgba(255,255,255,0.06)",
    border: "0.5px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.7)",
    padding: "9px 14px",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#06010f", color: "rgba(255,255,255,0.9)", fontFamily: "system-ui,-apple-system,sans-serif", position: "relative" }}>

      {/* 背景 canvas */}
      <canvas ref={bgCanvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />

      {/* ── 顶部导航 ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 48px",
        background: "rgba(6,1,15,0.75)", backdropFilter: "blur(18px)",
        borderBottom: "0.5px solid rgba(255,255,255,0.07)",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <polygon points="11,1 21,21 1,21" fill="none" stroke="#a020f0" strokeWidth="2" strokeLinejoin="round"/>
            <line x1="5.5" y1="15.5" x2="16.5" y2="15.5" stroke="#a020f0" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.05em", color: "#fff" }}>ARTVISTA</span>
        </a>
        {/* 翻页导航 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button style={{ ...iconBtn }}>上一件</button>
          <button style={{ ...iconBtn }}>下一件</button>
          <a href="/discover" style={{ ...iconBtn, textDecoration: "none" }}>关闭</a>
        </div>
      </nav>

      {/* ── 主体 ── */}
      <div style={{ position: "relative", zIndex: 1, paddingTop: 72 }}>

        {/* ══════════════════════════════════════════════════════
            作品顶部信息区：标题 + 作者行 + 操作按钮
        ══════════════════════════════════════════════════════ */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px 32px" }}>

          {/* 作品方向标签 */}
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {work.category.split("·").map(c => (
              <span key={c} style={{
                padding: "4px 14px", borderRadius: 99,
                background: "rgba(155,48,255,0.15)",
                border: "0.5px solid rgba(155,48,255,0.4)",
                color: "#c084fc", fontSize: 12, fontWeight: 500, letterSpacing: "0.06em",
              }}>{c.trim()}</span>
            ))}
          </div>

          {/* 作品大标题 */}
          <h1 style={{
            fontSize: "clamp(32px,5vw,56px)", fontWeight: 800,
            lineHeight: 1.05, letterSpacing: "-0.02em",
            color: "#fff", marginBottom: 28,
            textShadow: "0 0 60px rgba(155,48,255,0.4)",
          }}>{work.title}</h1>

          {/* 作者行：头像 + 名字 + 状态 + 操作按钮 */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 16, marginBottom: 36,
            paddingBottom: 28, borderBottom: "0.5px solid rgba(255,255,255,0.08)",
          }}>
            {/* 左：作者信息 */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* 头像 */}
              <div style={{
                width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg,#7b10e0,#c060ff)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 600, color: "#fff",
                position: "relative",
              }}>
                林
                {author.online && (
                  <span style={{
                    position: "absolute", bottom: 1, right: 1,
                    width: 10, height: 10, borderRadius: "50%",
                    background: "#22c55e", border: "1.5px solid #06010f",
                    boxShadow: "0 0 6px #22c55e",
                  }} />
                )}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{author.name}</div>
                <div style={{ fontSize: 12, color: "rgba(155,48,255,0.8)", marginTop: 1 }}>
                  {author.online ? "· 正在创作中" : author.handle}
                </div>
              </div>

              {/* 关注按钮 */}
              <button
                onClick={() => setFollowed(f => !f)}
                style={{
                  ...btnBase,
                  background: followed ? "rgba(155,48,255,0.15)" : "transparent",
                  border: `0.5px solid ${followed ? "rgba(155,48,255,0.5)" : "rgba(255,255,255,0.2)"}`,
                  color: followed ? "#c084fc" : "rgba(255,255,255,0.75)",
                  fontSize: 13,
                }}
              >
                {followed ? "已关注" : "关注"}
              </button>
            </div>

            {/* 右：操作按钮组 */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* 点赞 */}
              <button onClick={() => setLiked(l => !l)} style={{
                ...iconBtn,
                color: liked ? "#f472b6" : "rgba(255,255,255,0.6)",
                borderColor: liked ? "rgba(244,114,182,0.4)" : "rgba(255,255,255,0.12)",
                background: liked ? "rgba(244,114,182,0.08)" : "rgba(255,255,255,0.06)",
              }}>
                {liked ? "♥" : "♡"} {work.likes}
              </button>

              {/* 收藏 */}
              <button onClick={() => setSaved(s => !s)} style={{
                ...iconBtn,
                color: saved ? "#fbbf24" : "rgba(255,255,255,0.6)",
                borderColor: saved ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.12)",
                background: saved ? "rgba(251,191,36,0.08)" : "rgba(255,255,255,0.06)",
              }}>
                {saved ? "★" : "☆"}
              </button>

              {/* 分享 */}
              <button style={iconBtn}>分享</button>

              {/* 私信按钮 */}
              <button style={{
                ...btnBase,
                background: "linear-gradient(135deg,rgba(120,40,255,0.9),rgba(180,80,255,0.75))",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(140,40,255,0.35)",
              }}>
                私信他
              </button>
            </div>
          </div>

          {/* ── 作品主图 ── */}
          <div style={{
            width: "100%", borderRadius: 20, overflow: "hidden",
            border: "0.5px solid rgba(255,255,255,0.1)",
            marginBottom: 36,
            background: "linear-gradient(135deg,rgba(60,20,180,0.5),rgba(155,48,255,0.2),rgba(20,80,200,0.3))",
            aspectRatio: "16/9",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 30% 40%, rgba(155,48,255,0.35) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(60,120,255,0.25) 0%, transparent 50%)",
            }} />
            <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>作品主图 · ID: {id}</span>
            </div>
          </div>

          {/* ── 作品描述 ── */}
          <p style={{
            fontSize: 16, lineHeight: 1.85, color: "rgba(255,255,255,0.58)",
            maxWidth: 700, marginBottom: 24,
          }}>{work.desc}</p>

          {/* 标签 + 年份 + 浏览量 */}
          <div style={{ display: "flex", flexWrap: "wrap" as const, alignItems: "center", gap: 10, marginBottom: 48 }}>
            {work.tags.map(tag => (
              <span key={tag} style={{
                padding: "5px 14px", borderRadius: 99,
                border: "0.5px solid rgba(255,255,255,0.12)",
                fontSize: 12, color: "rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.04)",
              }}>{tag}</span>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 13, color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: 14 }}>
              <span>👁 {work.views}</span>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
              <span>{work.year}</span>
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            作者信息卡
        ══════════════════════════════════════════════════════ */}
        <div style={{
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.015)",
          backdropFilter: "blur(10px)",
          padding: "48px 32px",
          marginBottom: 64,
        }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg,#7b10e0,#c060ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 600, color: "#fff",
              boxShadow: "0 0 32px rgba(155,48,255,0.4)",
            }}>林</div>
            <div style={{ textAlign: "center" as const }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{author.name}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{author.role}</div>
            </div>
            <button style={{
              ...btnBase,
              background: "linear-gradient(135deg,rgba(120,40,255,0.9),rgba(180,80,255,0.75))",
              color: "#fff", fontSize: 14, padding: "10px 28px",
              boxShadow: "0 4px 24px rgba(140,40,255,0.35)",
            }}>
              私信联系
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            作者更多作品
        ══════════════════════════════════════════════════════ */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px 64px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>林默的更多作品</h2>
            <a href="/profile" style={{ fontSize: 13, color: "rgba(155,48,255,0.8)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              查看主页 →
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {moreWorks.map((w, i) => (
              <div key={i} style={{ ...card, cursor: "pointer" }}>
                <div style={{
                  height: 110,
                  background: `linear-gradient(135deg,rgba(${w.color[0]},0.6),rgba(${w.color[1]},0.3))`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 24, color: "rgba(255,255,255,0.2)" }}>🎨</span>
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{w.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{w.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            你可能也喜欢
        ══════════════════════════════════════════════════════ */}
        <div style={{
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
          padding: "64px 32px 80px",
        }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 28 }}>你可能也喜欢</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
              {recommended.map((r, i) => (
                <a key={i} href={`/artwork/${i + 1}`} style={{ textDecoration: "none" }}>
                  <div style={{ ...card, cursor: "pointer" }}>
                    {/* 封面 */}
                    <div style={{
                      height: 150,
                      background: `linear-gradient(135deg,rgba(${r.color[0]},0.55),rgba(${r.color[1]},0.25))`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      position: "relative",
                    }}>
                      <span style={{ fontSize: 28, color: "rgba(255,255,255,0.18)" }}>🎨</span>
                      {/* 分类标签 */}
                      <span style={{
                        position: "absolute", top: 10, left: 10,
                        padding: "3px 10px", borderRadius: 99,
                        background: "rgba(6,1,15,0.65)", backdropFilter: "blur(8px)",
                        fontSize: 11, color: "rgba(255,255,255,0.6)",
                        border: "0.5px solid rgba(255,255,255,0.12)",
                      }}>{r.tag}</span>
                    </div>
                    {/* 信息 */}
                    <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "#fff" }}>{r.title}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{
                            width: 18, height: 18, borderRadius: "50%",
                            background: "linear-gradient(135deg,#7b10e0,#c060ff)",
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            fontSize: 9, color: "#fff", flexShrink: 0,
                          }}>
                            {r.author[0]}
                          </span>
                          {r.author}
                        </div>
                      </div>
                      <span style={{ fontSize: 16, color: "rgba(255,255,255,0.3)" }}>♡</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { transition: opacity 0.15s, transform 0.1s; }
        button:hover { opacity: 0.82; }
        button:active { transform: scale(0.97); }
      `}</style>
    </div>
  );
}
