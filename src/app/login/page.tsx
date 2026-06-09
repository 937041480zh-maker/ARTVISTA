"use client";

// 引入 React 核心 Hooks
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// 登录方式 Tab 类型
type LoginTab = "email" | "phone" | "qrcode";

export default function LoginPage() {
  const bgCanvasRef   = useRef<HTMLCanvasElement>(null); // 背景霓虹雾气 canvas
  const cardCanvasRef = useRef<HTMLCanvasElement>(null); // 卡片光柱 canvas
  const bgAnimRef     = useRef<number>(0);               // 背景动画帧 ID
  const cardAnimRef   = useRef<number>(0);               // 卡片动画帧 ID

  // 当前登录方式 Tab
  const [tab, setTab] = useState<LoginTab>("email");

  // 邮箱登录表单状态
  const [emailForm, setEmailForm] = useState({ email: "", password: "" });
  // 是否显示密码明文
  const [showPwd, setShowPwd] = useState(false);

  // 手机登录表单状态
  const [phoneForm, setPhoneForm] = useState({ phone: "", code: "" });
  // 倒计时秒数（0 = 可发送）
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 二维码扫描状态
  const [qrStatus, setQrStatus] = useState<"waiting" | "scanned" | "expired">("waiting");

  // ── 背景紫色霓虹雾气动画（与注册页完全一致） ─────────────────────
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => {
      canvas.width  = window.innerWidth;
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

  // ── 卡片竖向紫色光柱动画（与注册页完全一致） ─────────────────────
  useEffect(() => {
    const canvas = cardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const CW = 320, CH = 620;
    canvas.width = CW; canvas.height = CH;

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
        const gx = (b.cx + Math.sin(ct * 0.5 + b.cx * 3) * 0.12) * CW;
        const gy = (b.cy + Math.cos(ct * 0.4 + b.cy * 2) * 0.1)  * CH;
        const gr = b.r * CW;
        const g  = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
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

  // 清理倒计时定时器
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // 发送验证码：启动 60s 倒计时
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

  // 登录提交
  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("登录方式:", tab, tab === "email" ? emailForm : phoneForm);
  };

  // ── 公用输入框样式 ─────────────────────────────────────────────
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

  // ── Tab 标签配置 ───────────────────────────────────────────────
  const tabs: { key: LoginTab; label: string }[] = [
    { key: "email",  label: "邮箱登录" },
    { key: "phone",  label: "手机登录" },
    { key: "qrcode", label: "二维码"   },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#06010f" }}>

      {/* 背景霓虹雾气 canvas */}
      <canvas ref={bgCanvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }} />

      {/* ID 卡场景容器 */}
      <div className="relative flex flex-col items-center" style={{ zIndex: 10 }}>

        {/* ── 挂绳 + 卡片整体容器（与注册页完全相同的挂绳结构） ── */}
        <div className="relative flex flex-col items-center" style={{ width: 290 }}>

          {/* 极细挂绳：单线从顶部渐变消逝 */}
          <div style={{
            width: 1.5,
            height: 80,
            background: "linear-gradient(to bottom, transparent 0%, rgba(160,100,255,0.25) 40%, rgba(160,100,255,0.55) 100%)",
            flexShrink: 0,
          }} />

          {/* 卡片摇摆容器 */}
          <div style={{
            width: 320,
            animation: "sway 7s ease-in-out infinite",
            transformOrigin: "top center",
          }}>
            {/* ID 卡外壳：顶部无圆角（与金属槽口条无缝衔接） */}
            <div className="relative overflow-hidden" style={{
              width: 320,
              borderRadius: "0 0 24px 24px",
              border: "1px solid rgba(255,255,255,0.18)",
              borderTop: "none",
            }}>

              {/* 第一层：深色磨砂玻璃底 */}
              <div className="absolute inset-0" style={{
                background: "rgba(8,4,25,0.5)",
                backdropFilter: "blur(18px) saturate(180%) brightness(0.9)",
                WebkitBackdropFilter: "blur(18px) saturate(180%) brightness(0.9)",
                borderRadius: "0 0 24px 24px", zIndex: 0,
              }}/>

              {/* 第二层：竖向紫色光柱 canvas */}
              <canvas ref={cardCanvasRef} className="absolute inset-0 pointer-events-none"
                style={{ borderRadius: 24, opacity: 0.72, zIndex: 1, width: "100%", height: "100%" }}/>

              {/* 第三层：轻薄磨砂雾气遮罩 */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: "rgba(30,5,60,0.22)",
                backdropFilter: "blur(3px)",
                WebkitBackdropFilter: "blur(3px)",
                borderRadius: 24, zIndex: 2,
              }}/>

              {/* 第四层：边缘高光 */}
              <div className="absolute inset-0 pointer-events-none" style={{
                borderRadius: 24,
                background: `
                  linear-gradient(to right,  rgba(255,255,255,0.07) 0%, transparent 6%, transparent 94%, rgba(255,255,255,0.07) 100%),
                  linear-gradient(to bottom, rgba(255,255,255,0.10) 0%, transparent 5%, transparent 95%, rgba(255,255,255,0.04) 100%)
                `,
                zIndex: 5,
              }}/>

              {/* ── 卡片正文内容 ── */}
              <div className="relative px-6 pt-6 pb-5" style={{ zIndex: 6 }}>

                {/* 顶部：椭圆边框徽章 + 三角描边 A Logo（对应图片样式） */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                  {/* 左侧椭圆徽章：改为"登录/通行证" */}
                  <div style={{
                    border: "1px solid rgba(255,255,255,0.35)",
                    borderRadius: 24, padding: "6px 14px",
                    fontSize: 10, lineHeight: 1.55,
                    color: "rgba(255,255,255,0.75)",
                    fontFamily: "inherit", letterSpacing: "0.04em",
                    textAlign: "center" as const,
                  }}>
                    登录<br />通行证
                  </div>

                  {/* 右侧 Logo：SVG 三角描边 A */}
                  <svg width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <filter id="aGlow" x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur stdDeviation="2.5" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <linearGradient id="aGrad" x1="18" y1="0" x2="18" y2="34" gradientUnits="userSpaceOnUse">
                        <stop offset="0%"   stopColor="#d8a4ff"/>
                        <stop offset="100%" stopColor="#9b30ff"/>
                      </linearGradient>
                    </defs>
                    <line x1="18" y1="2" x2="2"  y2="32"
                      stroke="url(#aGrad)" strokeWidth="2.8" strokeLinecap="round"
                      filter="url(#aGlow)"/>
                    <line x1="18" y1="2" x2="34" y2="32"
                      stroke="url(#aGrad)" strokeWidth="2.8" strokeLinecap="round"
                      filter="url(#aGlow)"/>
                    <line x1="10" y1="21" x2="26" y2="21"
                      stroke="url(#aGrad)" strokeWidth="2.5" strokeLinecap="round"
                      filter="url(#aGlow)"/>
                    <line x1="2"  y1="32" x2="9"  y2="32"
                      stroke="url(#aGrad)" strokeWidth="2.5" strokeLinecap="round"
                      filter="url(#aGlow)"/>
                    <line x1="27" y1="32" x2="34" y2="32"
                      stroke="url(#aGrad)" strokeWidth="2.5" strokeLinecap="round"
                      filter="url(#aGlow)"/>
                  </svg>
                </div>

                {/* 主标题 */}
                <div style={{
                  fontSize: 36, fontWeight: 900, lineHeight: 1.1,
                  letterSpacing: "-0.02em", color: "rgba(255,255,255,0.95)",
                  marginBottom: 6, textShadow: "0 0 40px rgba(160,80,255,0.4)",
                }}>
                  欢迎<br />回来
                </div>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>
                  Artvista · 2026 · V1
                </div>
                <div style={{ height: 1, background: "rgba(255,255,255,0.1)", marginBottom: 20 }} />

                {/* ── 登录方式 Tab 切换 ── */}
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

                {/* ══════════════════════════════════════
                    邮箱登录面板
                ══════════════════════════════════════ */}
                {tab === "email" && (
                  <div>
                    {/* 邮箱 */}
                    <div className="mb-3">
                      <label className="block text-[9px] tracking-widest mb-1"
                        style={{ color: "rgba(255,255,255,0.38)" }}>邮箱</label>
                      <input
                        type="email"
                        placeholder="请输入邮箱地址"
                        value={emailForm.email}
                        onChange={e => setEmailForm(f => ({ ...f, email: e.target.value }))}
                        className="outline-none transition-all"
                        style={inputStyle}
                      />
                    </div>

                    {/* 密码 + 显示/隐藏按钮 + 忘记密码 */}
                    <div className="mb-1">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[9px] tracking-widest"
                          style={{ color: "rgba(255,255,255,0.38)" }}>密码</label>
                        <Link href="/forgot-password"
                          className="text-[9px] hover:opacity-70 transition-opacity"
                          style={{ color: "rgba(180,120,255,0.75)", textDecoration: "none" }}>
                          忘记密码？
                        </Link>
                      </div>
                      {/* 密码框 + 眼睛图标 */}
                      <div style={{ position: "relative" }}>
                        <input
                          type={showPwd ? "text" : "password"}
                          placeholder="请输入密码"
                          value={emailForm.password}
                          onChange={e => setEmailForm(f => ({ ...f, password: e.target.value }))}
                          className="outline-none transition-all"
                          style={{ ...inputStyle, paddingRight: 36 }}
                        />
                        {/* 显示/隐藏密码按钮 */}
                        <button
                          type="button"
                          onClick={() => setShowPwd(v => !v)}
                          style={{
                            position: "absolute", right: 10, top: "50%",
                            transform: "translateY(-50%)",
                            background: "none", border: "none",
                            cursor: "pointer", padding: 0,
                            color: "rgba(255,255,255,0.35)",
                            fontSize: 14, lineHeight: 1,
                            transition: "color 0.15s",
                          }}
                          title={showPwd ? "隐藏密码" : "显示密码"}
                        >
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

                    {/* 登录按钮 */}
                    <button onClick={handleLogin}
                      style={{
                        width: "100%", padding: "14px 0", borderRadius: 16, border: "none",
                        background: "linear-gradient(135deg, #5b4ff5 0%, #8b5cf6 50%, #a78bfa 100%)",
                        color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: "0.12em",
                        cursor: "pointer", fontFamily: "inherit",
                        boxShadow: "0 6px 28px rgba(100,80,240,0.45)", marginTop: 16,
                        transition: "opacity 0.2s",
                      }}
                    >
                      立即登录
                    </button>
                  </div>
                )}

                {/* ══════════════════════════════════════
                    手机登录面板
                ══════════════════════════════════════ */}
                {tab === "phone" && (
                  <div>
                    {/* 手机号 */}
                    <div className="mb-3">
                      <label className="block text-[9px] tracking-widest mb-1"
                        style={{ color: "rgba(255,255,255,0.38)" }}>手机号</label>
                      <input
                        type="tel"
                        placeholder="请输入手机号"
                        value={phoneForm.phone}
                        onChange={e => setPhoneForm(f => ({ ...f, phone: e.target.value }))}
                        className="outline-none transition-all"
                        style={inputStyle}
                      />
                    </div>

                    {/* 验证码输入 + 获取按钮 */}
                    <div className="mb-3">
                      <label className="block text-[9px] tracking-widest mb-1"
                        style={{ color: "rgba(255,255,255,0.38)" }}>验证码</label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          type="text"
                          placeholder="请输入验证码"
                          value={phoneForm.code}
                          onChange={e => setPhoneForm(f => ({ ...f, code: e.target.value }))}
                          className="outline-none transition-all"
                          style={{ ...inputStyle, flex: 1 }}
                          maxLength={6}
                        />
                        {/* 获取验证码按钮：倒计时期间禁用 */}
                        <button
                          onClick={handleSendCode}
                          disabled={countdown > 0 || !phoneForm.phone}
                          style={{
                            flexShrink: 0,
                            padding: "9px 10px",
                            borderRadius: 10,
                            border: "1px solid rgba(160,80,255,0.5)",
                            background: countdown > 0 || !phoneForm.phone
                              ? "rgba(255,255,255,0.04)"
                              : "rgba(120,40,255,0.2)",
                            color: countdown > 0 || !phoneForm.phone
                              ? "rgba(255,255,255,0.3)"
                              : "rgba(180,120,255,0.9)",
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

                    {/* 登录按钮 */}
                    <button onClick={handleLogin}
                      style={{
                        width: "100%", padding: "14px 0", borderRadius: 16, border: "none",
                        background: "linear-gradient(135deg, #5b4ff5 0%, #8b5cf6 50%, #a78bfa 100%)",
                        color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: "0.12em",
                        cursor: "pointer", fontFamily: "inherit",
                        boxShadow: "0 6px 28px rgba(100,80,240,0.45)", marginTop: 12,
                        transition: "opacity 0.2s",
                      }}
                    >
                      立即登录
                    </button>
                  </div>
                )}

                {/* ══════════════════════════════════════
                    二维码登录面板
                ══════════════════════════════════════ */}
                {tab === "qrcode" && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>

                    {/* 二维码展示区域 */}
                    <div style={{
                      width: 148, height: 148,
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      position: "relative", overflow: "hidden",
                    }}>
                      {/* 模拟二维码图案（实际替换为真实二维码图片） */}
                      <svg width="112" height="112" viewBox="0 0 112 112">
                        {/* 外框 */}
                        <rect x="4"  y="4"  width="44" height="44" fill="none" stroke="rgba(180,120,255,0.8)" strokeWidth="3"/>
                        <rect x="64" y="4"  width="44" height="44" fill="none" stroke="rgba(180,120,255,0.8)" strokeWidth="3"/>
                        <rect x="4"  y="64" width="44" height="44" fill="none" stroke="rgba(180,120,255,0.8)" strokeWidth="3"/>
                        {/* 定位点内块 */}
                        <rect x="14" y="14" width="24" height="24" fill="rgba(180,120,255,0.7)"/>
                        <rect x="74" y="14" width="24" height="24" fill="rgba(180,120,255,0.7)"/>
                        <rect x="14" y="74" width="24" height="24" fill="rgba(180,120,255,0.7)"/>
                        {/* 模拟数据点阵 */}
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

                      {/* 已扫码遮罩 */}
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

                      {/* 过期遮罩 */}
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

                    {/* 提示文字 */}
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textAlign: "center" as const, lineHeight: 1.6 }}>
                      使用移动设备扫码登录
                    </p>

                    {/* 扫码状态提示 */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "6px 14px", borderRadius: 99,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}>
                      {/* 状态指示灯 */}
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: qrStatus === "waiting"  ? "#9b30ff"
                                  : qrStatus === "scanned"  ? "#22c55e"
                                  : "#ef4444",
                        boxShadow: `0 0 6px ${
                          qrStatus === "waiting"  ? "#9b30ff"
                        : qrStatus === "scanned"  ? "#22c55e"
                        : "#ef4444"}`,
                        animation: qrStatus === "waiting" ? "blink 2s ease-in-out infinite" : "none",
                      }}/>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
                        {qrStatus === "waiting"  && "等待扫码中..."}
                        {qrStatus === "scanned"  && "请在手机上确认登录"}
                        {qrStatus === "expired"  && "二维码已失效，请刷新"}
                      </span>
                    </div>

                    {/* 模拟状态切换按钮（开发调试用，上线可删除） */}
                    <div style={{ display: "flex", gap: 6 }}>
                      {(["waiting","scanned","expired"] as const).map(s => (
                        <button key={s} onClick={() => setQrStatus(s)}
                          style={{
                            padding: "3px 8px", borderRadius: 6,
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: qrStatus === s ? "rgba(120,40,255,0.25)" : "transparent",
                            color: "rgba(255,255,255,0.3)", fontSize: 9,
                            cursor: "pointer", fontFamily: "inherit",
                          }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── 分隔线 + 第三方登录 ── */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "16px 0 12px" }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}/>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" as const }}>
                    其他登录方式
                  </span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}/>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                  {/* GitHub 登录按钮 */}
                  <button
                    className="hover:opacity-80 active:scale-[0.97] transition-all"
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      padding: "9px 0", borderRadius: 10,
                      background: "rgba(255,255,255,0.055)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.75)", fontSize: 11,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub
                  </button>

                  {/* Google 登录按钮 */}
                  <button
                    className="hover:opacity-80 active:scale-[0.97] transition-all"
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      padding: "9px 0", borderRadius: 10,
                      background: "rgba(255,255,255,0.055)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.75)", fontSize: 11,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                </div>

                {/* ── 底部：还没有账号？立即注册 ── */}
                <div className="flex justify-center items-center mt-3 pt-3"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    还没有账号？{" "}
                    <Link href="/register"
                      className="hover:opacity-80"
                      style={{ color: "rgba(180,120,255,0.85)", textDecoration: "none" }}>
                      立即注册
                    </Link>
                  </span>
                </div>

              </div>{/* 卡片正文结束 */}
            </div>{/* ID 卡外壳结束 */}
          </div>{/* 卡片摇摆容器结束 */}
        </div>{/* 挂绳+卡片整体容器结束 */}
      </div>{/* 场景容器结束 */}

      {/* 全局关键帧动画（与注册页完全相同） */}
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
