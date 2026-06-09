"use client";

// 引入 React 核心 Hooks：useEffect 处理副作用，useRef 获取 DOM 引用，useState 管理表单状态
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";

// ── 登录方式 Tab 类型 ─────────────────────────────────────────────
type LoginTab = "email" | "phone" | "qrcode";

export default function RegisterPage() {
  // bgCanvasRef：指向背景霓虹雾气动画的 canvas 元素
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  // cardCanvasRef：指向 ID 卡内竖向光柱动画的 canvas 元素
  const cardCanvasRef = useRef<HTMLCanvasElement>(null);
  // bgAnimRef：存储背景动画的 requestAnimationFrame ID，用于组件卸载时取消动画防止内存泄漏
  const bgAnimRef = useRef<number>(0);
  // cardAnimRef：存储卡片动画的 requestAnimationFrame ID，同上
  const cardAnimRef = useRef<number>(0);

  // ── 视图切换：register | login ─────────────────────────────────
  const [view, setView] = useState<"register" | "login">("register");

  // ── 注册表单状态 ────────────────────────────────────────────────
  const [form, setForm] = useState({
    username: "",   // 账户名
    email: "",      // 邮箱
    account: "",    // 账号
    password: "",   // 密码
  });

  // ── 登录表单状态 ───────────────────────────────────────────────
  const [tab, setTab] = useState<LoginTab>("email");
  const [emailForm, setEmailForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [phoneForm, setPhoneForm] = useState({ phone: "", code: "" });
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [qrStatus, setQrStatus] = useState<"waiting" | "scanned" | "expired">("waiting");

  // ── 背景霓虹雾气动画 ──────────────────────────────────────────
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const blobs = [
      { x: 0.25, y: 0.2,  r: 0.45, c: [140, 40, 255], a: 0.55, dx: 0.3,  dy: 0.2  },
      { x: 0.7,  y: 0.15, r: 0.38, c: [180, 60, 255], a: 0.45, dx: -0.2, dy: 0.25 },
      { x: 0.5,  y: 0.6,  r: 0.35, c: [100,  0, 220], a: 0.40, dx: 0.15, dy: -0.3 },
      { x: 0.15, y: 0.7,  r: 0.30, c: [200, 80, 255], a: 0.30, dx: 0.25, dy: 0.15 },
      { x: 0.8,  y: 0.75, r: 0.32, c: [120, 20, 200], a: 0.38, dx: -0.3, dy: -0.2 },
    ];

    let t = 0;
    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#06010f";
      ctx.fillRect(0, 0, w, h);
      blobs.forEach((b, i) => {
        const ox = Math.sin(t * 0.4 + i * 1.3) * b.dx;
        const oy = Math.cos(t * 0.35 + i * 0.9) * b.dy;
        const cx = (b.x + ox) * w;
        const cy = (b.y + oy) * h;
        const r  = b.r * Math.min(w, h);
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0,   `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.a})`);
        g.addColorStop(0.5, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.a * 0.3})`);
        g.addColorStop(1,   "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });
      t += 0.012;
      bgAnimRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(bgAnimRef.current);
    };
  }, []);

  // ── ID 卡竖向发光光柱动画 ─────────────────────────────────────
  useEffect(() => {
    const canvas = cardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const CW = 290, CH = 580;
    canvas.width = CW;
    canvas.height = CH;

    const cols = Array.from({ length: 28 }, (_, i) => ({
      x:      (i / 28) * CW + Math.random() * 4,
      w:      3 + Math.random() * 8,
      bright: 0.15 + Math.random() * 0.6,
      speed:  0.008 + Math.random() * 0.015,
      phase:  Math.random() * Math.PI * 2,
      hue:    270 + Math.random() * 50,
    }));

    const blobs = [
      { cx: 0.65, cy: 0.25, r: 0.55, c: [140, 40, 255], a: 0.7 },
      { cx: 0.4,  cy: 0.5,  r: 0.40, c: [100,  0, 200], a: 0.5 },
      { cx: 0.7,  cy: 0.6,  r: 0.35, c: [180, 80, 255], a: 0.4 },
    ];

    let ct = 0;
    const draw = () => {
      ctx.clearRect(0, 0, CW, CH);

      blobs.forEach((b) => {
        const ox = Math.sin(ct * 0.5 + b.cx * 3) * 0.12;
        const oy = Math.cos(ct * 0.4 + b.cy * 2) * 0.1;
        const gx = (b.cx + ox) * CW;
        const gy = (b.cy + oy) * CH;
        const gr = b.r * CW;
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.a})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, CW, CH);
      });

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      cols.forEach((col) => {
        const pulse = 0.5 + 0.5 * Math.sin(ct * col.speed * 60 + col.phase);
        const alpha = col.bright * (0.5 + 0.5 * pulse);
        const g = ctx.createLinearGradient(0, 0, 0, CH);
        g.addColorStop(0,    `hsla(${col.hue},100%,80%,0)`);
        g.addColorStop(0.15, `hsla(${col.hue},100%,80%,${alpha * 0.3})`);
        g.addColorStop(0.4,  `hsla(${col.hue},100%,85%,${alpha})`);
        g.addColorStop(0.65, `hsla(${col.hue},100%,80%,${alpha * 0.6})`);
        g.addColorStop(1,    `hsla(${col.hue},100%,80%,0)`);
        ctx.fillStyle = g;
        ctx.fillRect(col.x, 0, col.w, CH);
      });
      ctx.restore();

      ct += 0.016;
      cardAnimRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(cardAnimRef.current);
  }, []);

  // ── 登录：清理倒计时定时器 ────────────────────────────────────
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // ── 登录：发送验证码 ─────────────────────────────────────────
  const handleSendCode = () => {
    if (countdown > 0 || !phoneForm.phone) return;
    setCountdown(60);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ── 登录：提交处理 ───────────────────────────────────────────
  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("登录方式:", tab, tab === "email" ? emailForm : phoneForm);
  };

  // ── 注册：表单提交 ───────────────────────────────────────────
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("注册信息：", form);
  };

  // ── 公用输入框样式 ───────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.055)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "9px 12px",
    color: "rgba(255,255,255,0.85)",
    fontSize: 12.5,
    fontFamily: "inherit",
    outline: "none",
  };

  // ── 登录 Tab 配置 ────────────────────────────────────────────
  const tabs: { key: LoginTab; label: string }[] = [
    { key: "email",  label: "邮箱登录" },
    { key: "phone",  label: "手机登录" },
    { key: "qrcode", label: "二维码"   },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#040410]">

      {/* 背景霓虹雾气动画 canvas */}
      <canvas ref={bgCanvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />

      {/* ID 卡整体场景容器 */}
      <div className="relative flex flex-col items-center" style={{ zIndex: 10 }}>

        {/* 吊绳 */}
        <div
          className="w-0.5 rounded-sm"
          style={{
            height: 56,
            background: "linear-gradient(to bottom, #1a1a1a, #555, #333)",
          }}
        />

        {/* 卡片摇摆动画容器 */}
        <div
          className="relative"
          style={{
            width: 290,
            animation: "sway 7s ease-in-out infinite",
            transformOrigin: "top center",
          }}
        >
          {/* ID 卡外壳 */}
          <div
            className="relative overflow-hidden"
            style={{
              width: 290,
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            {/* 第一层：深色磨砂玻璃底层 */}
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(8,10,35,0.45)",
                backdropFilter: "blur(18px) saturate(180%) brightness(0.9)",
                WebkitBackdropFilter: "blur(18px) saturate(180%) brightness(0.9)",
                borderRadius: 24,
                zIndex: 0,
              }}
            />

            {/* 第二层：竖向发光光柱 canvas */}
            <canvas
              ref={cardCanvasRef}
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: 24,
                opacity: 0.72,
                zIndex: 1,
                width: "100%",
                height: "100%",
              }}
            />

            {/* 第三层：轻薄磨砂雾气遮罩 */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "rgba(20,10,60,0.22)",
                backdropFilter: "blur(3px)",
                WebkitBackdropFilter: "blur(3px)",
                borderRadius: 24,
                zIndex: 2,
              }}
            />

            {/* 第四层：边缘高光 */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: 24,
                background: `
                  linear-gradient(to right,  rgba(255,255,255,0.07) 0%, transparent 6%, transparent 94%, rgba(255,255,255,0.07) 100%),
                  linear-gradient(to bottom, rgba(255,255,255,0.10) 0%, transparent 5%, transparent 95%, rgba(255,255,255,0.04) 100%)
                `,
                zIndex: 5,
              }}
            />

            {/* ── 卡片正文内容 ── */}
            <div className="relative px-6 pt-6 pb-5" style={{ zIndex: 6 }}>

              {/* 卡片顶部行：左侧徽章 + 右侧 Logo */}
              <div className="flex justify-between items-start mb-4">
                <div
                  className="text-[9px] tracking-widest leading-snug px-3 py-1"
                  style={{
                    border: "1px solid rgba(255,255,255,0.35)",
                    borderRadius: 20,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {view === "register" ? (
                    <>注册<br />通行证</>
                  ) : (
                    <>登录<br />通行证</>
                  )}
                </div>
                <div className="flex items-center">
                  <Logo size={40} />
                </div>
              </div>

              {/* ══════════════════════════════════════
                  注册视图
              ══════════════════════════════════════ */}
              {view === "register" && (
                <>
                  {/* 卡片主标题 */}
                  <div
                    className="text-[40px] font-black leading-none mb-1"
                    style={{
                      color: "rgba(255,255,255,0.95)",
                      letterSpacing: "-0.5px",
                      textShadow: "0 0 40px rgba(100,160,255,0.4)",
                    }}
                  >
                    入驻<br />通行证
                  </div>
                  <div className="text-[9px] tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Artvista · 2026 · V1
                  </div>
                  <div className="mb-4" style={{ height: 1, background: "rgba(255,255,255,0.1)" }} />

                  {/* 账户名 */}
                  <div className="mb-3">
                    <label className="block text-[9px] tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.38)" }}>账户名</label>
                    <input type="text" placeholder="请输入展示用昵称"
                      value={form.username}
                      onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                      className="w-full rounded-[10px] px-3 py-2 text-[12.5px] outline-none transition-all"
                      style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", fontFamily: "inherit" }}
                    />
                  </div>

                  {/* 邮箱 */}
                  <div className="mb-3">
                    <label className="block text-[9px] tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.38)" }}>邮箱</label>
                    <input type="email" placeholder="请输入邮箱地址"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-[10px] px-3 py-2 text-[12.5px] outline-none"
                      style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", fontFamily: "inherit" }}
                    />
                  </div>

                  {/* 账号 */}
                  <div className="mb-3">
                    <label className="block text-[9px] tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.38)" }}>账号</label>
                    <input type="text" placeholder="请设置登录账号"
                      value={form.account}
                      onChange={e => setForm(f => ({ ...f, account: e.target.value }))}
                      className="w-full rounded-[10px] px-3 py-2 text-[12.5px] outline-none"
                      style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", fontFamily: "inherit" }}
                    />
                  </div>

                  {/* 密码 */}
                  <div className="mb-3">
                    <label className="block text-[9px] tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.38)" }}>密码</label>
                    <input type="password" placeholder="请输入密码"
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full rounded-[10px] px-3 py-2 text-[12.5px] outline-none"
                      style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", fontFamily: "inherit" }}
                    />
                  </div>

                  {/* 注册按钮 */}
                  <button
                    onClick={handleSubmit}
                    className="w-full py-3 rounded-xl text-white text-[11px] font-bold tracking-widest mt-1 transition-opacity hover:opacity-85 active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, rgba(60,100,255,0.9), rgba(100,200,255,0.6))",
                      boxShadow: "0 4px 24px rgba(60,120,255,0.3)",
                      border: "none",
                      fontFamily: "inherit",
                    }}
                  >
                    激活通行证
                  </button>
                </>
              )}

              {/* ══════════════════════════════════════
                  登录视图
              ══════════════════════════════════════ */}
              {view === "login" && (
                <>
                  {/* 卡片主标题 */}
                  <div
                    className="text-[40px] font-black leading-none mb-1"
                    style={{
                      color: "rgba(255,255,255,0.95)",
                      letterSpacing: "-0.5px",
                      textShadow: "0 0 40px rgba(160,80,255,0.4)",
                    }}
                  >
                    欢迎<br />回来
                  </div>
                  <div className="text-[9px] tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Artvista · 2026 · V1
                  </div>
                  <div className="mb-4" style={{ height: 1, background: "rgba(255,255,255,0.1)" }} />

                  {/* 登录方式 Tab 切换 */}
                  <div className="flex mb-4" style={{
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 10,
                    padding: 3,
                    gap: 2,
                  }}>
                    {tabs.map(t => (
                      <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        style={{
                          flex: 1,
                          padding: "6px 0",
                          borderRadius: 8,
                          border: "none",
                          fontSize: 10,
                          fontWeight: tab === t.key ? 600 : 400,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.2s",
                          background: tab === t.key
                            ? "linear-gradient(135deg, rgba(120,40,255,0.85), rgba(180,80,255,0.6))"
                            : "transparent",
                          color: tab === t.key ? "#fff" : "rgba(255,255,255,0.4)",
                          boxShadow: tab === t.key ? "0 2px 12px rgba(140,40,255,0.3)" : "none",
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* ── 邮箱登录面板 ── */}
                  {tab === "email" && (
                    <div>
                      <div className="mb-3">
                        <label className="block text-[9px] tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.38)" }}>邮箱</label>
                        <input type="email" placeholder="请输入邮箱地址"
                          value={emailForm.email}
                          onChange={e => setEmailForm(f => ({ ...f, email: e.target.value }))}
                          className="outline-none transition-all"
                          style={inputStyle}
                        />
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[9px] tracking-widest" style={{ color: "rgba(255,255,255,0.38)" }}>密码</label>
                          <span className="text-[9px] hover:opacity-70 transition-opacity cursor-pointer" style={{ color: "rgba(180,120,255,0.75)" }}>
                            忘记密码？
                          </span>
                        </div>
                        <div style={{ position: "relative" }}>
                          <input type={showPwd ? "text" : "password"} placeholder="请输入密码"
                            value={emailForm.password}
                            onChange={e => setEmailForm(f => ({ ...f, password: e.target.value }))}
                            className="outline-none transition-all"
                            style={{ ...inputStyle, paddingRight: 36 }}
                          />
                          <button type="button" onClick={() => setShowPwd(v => !v)}
                            style={{
                              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                              background: "none", border: "none", cursor: "pointer", padding: 0,
                              color: "rgba(255,255,255,0.35)", fontSize: 14, lineHeight: 1,
                              transition: "color 0.15s",
                            }}>
                            {showPwd ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                                <line x1="1" y1="1" x2="23" y2="23"/>
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      <button onClick={handleLogin}
                        style={{
                          width: "100%", padding: "12px 0", borderRadius: 14, border: "none",
                          background: "linear-gradient(135deg, #5b4ff5 0%, #8b5cf6 50%, #a78bfa 100%)",
                          color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em",
                          cursor: "pointer", fontFamily: "inherit",
                          boxShadow: "0 6px 28px rgba(100,80,240,0.45)", marginTop: 8,
                          transition: "opacity 0.2s",
                        }}
                      >
                        立即登录
                      </button>
                    </div>
                  )}

                  {/* ── 手机登录面板 ── */}
                  {tab === "phone" && (
                    <div>
                      <div className="mb-3">
                        <label className="block text-[9px] tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.38)" }}>手机号</label>
                        <input type="tel" placeholder="请输入手机号"
                          value={phoneForm.phone}
                          onChange={e => setPhoneForm(f => ({ ...f, phone: e.target.value }))}
                          className="outline-none transition-all"
                          style={inputStyle}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="block text-[9px] tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.38)" }}>验证码</label>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input type="text" placeholder="请输入验证码"
                            value={phoneForm.code}
                            onChange={e => setPhoneForm(f => ({ ...f, code: e.target.value }))}
                            className="outline-none transition-all"
                            style={{ ...inputStyle, flex: 1 }}
                            maxLength={6}
                          />
                          <button onClick={handleSendCode}
                            disabled={countdown > 0 || !phoneForm.phone}
                            style={{
                              flexShrink: 0,
                              padding: "9px 10px",
                              borderRadius: 10,
                              border: "1px solid rgba(160,80,255,0.5)",
                              background: countdown > 0 || !phoneForm.phone ? "rgba(255,255,255,0.04)" : "rgba(120,40,255,0.2)",
                              color: countdown > 0 || !phoneForm.phone ? "rgba(255,255,255,0.3)" : "rgba(180,120,255,0.9)",
                              fontSize: 10,
                              fontFamily: "inherit",
                              cursor: countdown > 0 || !phoneForm.phone ? "not-allowed" : "pointer",
                              whiteSpace: "nowrap" as const,
                              transition: "all 0.15s",
                            }}
                          >
                            {countdown > 0 ? `${countdown}s` : "获取验证码"}
                          </button>
                        </div>
                      </div>
                      <button onClick={handleLogin}
                        style={{
                          width: "100%", padding: "12px 0", borderRadius: 14, border: "none",
                          background: "linear-gradient(135deg, #5b4ff5 0%, #8b5cf6 50%, #a78bfa 100%)",
                          color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em",
                          cursor: "pointer", fontFamily: "inherit",
                          boxShadow: "0 6px 28px rgba(100,80,240,0.45)", marginTop: 8,
                          transition: "opacity 0.2s",
                        }}
                      >
                        立即登录
                      </button>
                    </div>
                  )}

                  {/* ── 二维码登录面板 ── */}
                  {tab === "qrcode" && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 148, height: 148,
                        borderRadius: 14,
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        position: "relative", overflow: "hidden",
                      }}>
                        <svg width="112" height="112" viewBox="0 0 112 112">
                          <rect x="4"  y="4"  width="44" height="44" fill="none" stroke="rgba(180,120,255,0.8)" strokeWidth="3"/>
                          <rect x="64" y="4"  width="44" height="44" fill="none" stroke="rgba(180,120,255,0.8)" strokeWidth="3"/>
                          <rect x="4"  y="64" width="44" height="44" fill="none" stroke="rgba(180,120,255,0.8)" strokeWidth="3"/>
                          <rect x="14" y="14" width="24" height="24" fill="rgba(180,120,255,0.7)"/>
                          <rect x="74" y="14" width="24" height="24" fill="rgba(180,120,255,0.7)"/>
                          <rect x="14" y="74" width="24" height="24" fill="rgba(180,120,255,0.7)"/>
                          {[0,1,2,3,4,5,6].flatMap(row =>
                            [0,1,2,3,4,5,6].map(col => {
                              const skip = (row < 3 && col < 3) || (row < 3 && col > 3) || (row > 3 && col < 3);
                              if (skip) return null;
                              const on = (row * 7 + col * 3 + row + col) % 3 !== 0;
                              if (!on) return null;
                              return (
                                <rect key={`${row}-${col}`}
                                  x={4 + col * 16} y={4 + row * 16}
                                  width="10" height="10"
                                  fill="rgba(180,120,255,0.55)"
                                />
                              );
                            })
                          )}
                        </svg>

                        {qrStatus === "scanned" && (
                          <div style={{
                            position: "absolute", inset: 0,
                            background: "rgba(6,1,15,0.85)",
                            display: "flex", flexDirection: "column" as const,
                            alignItems: "center", justifyContent: "center", gap: 6,
                          }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="9,12 11,14 15,10"/>
                            </svg>
                            <span style={{ fontSize: 10, color: "#22c55e" }}>扫码成功</span>
                          </div>
                        )}

                        {qrStatus === "expired" && (
                          <div style={{
                            position: "absolute", inset: 0,
                            background: "rgba(6,1,15,0.88)",
                            display: "flex", flexDirection: "column" as const,
                            alignItems: "center", justifyContent: "center", gap: 8,
                          }}>
                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>二维码已过期</span>
                            <button onClick={() => setQrStatus("waiting")}
                              style={{
                                padding: "5px 12px", borderRadius: 8,
                                background: "rgba(120,40,255,0.3)",
                                border: "1px solid rgba(160,80,255,0.5)",
                                color: "rgba(180,120,255,0.9)",
                                fontSize: 10, cursor: "pointer", fontFamily: "inherit",
                              }}>
                              点击刷新
                            </button>
                          </div>
                        )}
                      </div>

                      <div style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "6px 14px", borderRadius: 99,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: qrStatus === "waiting" ? "#9b30ff" : qrStatus === "scanned" ? "#22c55e" : "#ef4444",
                          boxShadow: `0 0 6px ${qrStatus === "waiting" ? "#9b30ff" : qrStatus === "scanned" ? "#22c55e" : "#ef4444"}`,
                          animation: qrStatus === "waiting" ? "blink 2s ease-in-out infinite" : "none",
                        }}/>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
                          {qrStatus === "waiting"  && "等待扫码中..."}
                          {qrStatus === "scanned"  && "请在手机上确认登录"}
                          {qrStatus === "expired"  && "二维码已失效，请刷新"}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── 底部切换区域 ── */}
              <div
                className="flex justify-center items-center mt-3 pt-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                {view === "register" ? (
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    已有账号？{" "}
                    <button onClick={() => setView("login")}
                      className="hover:opacity-80"
                      style={{ color: "rgba(140,180,255,0.75)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit" }}>
                      立即登录
                    </button>
                  </span>
                ) : (
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    还没有账号？{" "}
                    <button onClick={() => setView("register")}
                      className="hover:opacity-80"
                      style={{ color: "rgba(140,180,255,0.75)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit" }}>
                      立即注册
                    </button>
                  </span>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 全局关键帧动画 */}
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-1deg); }
          50%       { transform: rotate(1deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:focus {
          border-color: rgba(160,80,255,0.6) !important;
          background: rgba(120,40,255,0.1) !important;
        }
      `}</style>
    </div>
  );
}
