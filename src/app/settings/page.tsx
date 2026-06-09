"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// 左侧导航项的类型定义
type NavKey = "profile" | "account" | "notifications" | "privacy" | "security" | "language" | "terms";

// 左侧导航配置数组
const navItems: { key: NavKey; label: string; icon: string }[] = [
  { key: "profile",       label: "编辑个人资料", icon: "ti-user-circle"  },
  { key: "account",       label: "账户管理",     icon: "ti-settings-2"   },
  { key: "notifications", label: "通知服务",     icon: "ti-bell"          },
  { key: "privacy",       label: "隐私与数据",   icon: "ti-shield-lock"   },
  { key: "security",      label: "安全",         icon: "ti-lock"          },
  { key: "language",      label: "语言设置",     icon: "ti-language"      },
  { key: "terms",         label: "服务条款",     icon: "ti-file-text"     },
];

// 分隔线出现在哪些 key 的下方
const dividersAfter: NavKey[] = ["notifications", "security"];

export default function SettingsPage() {
  // 当前选中的导航项
  const [active, setActive] = useState<NavKey>("profile");
  // 导航栏是否展开
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  // 通知开关状态
  const [notif, setNotif] = useState({
    comment: true, follow: true, like: false,
    event: true, weekly: false,
  });

  // 隐私开关状态
  const [priv, setPriv] = useState({
    publicProfile: true, repost: false, recommend: true, analytics: true,
  });

  // 当前选中语言
  const [lang, setLang] = useState("zh-CN");

  // 语言列表
  const languages = [
    { code: "zh-CN", flag: "🇨🇳", name: "简体中文",  sub: "Chinese (Simplified)"  },
    { code: "zh-TW", flag: "🇭🇰", name: "繁體中文",  sub: "Chinese (Traditional)" },
    { code: "en-US", flag: "🇺🇸", name: "English",   sub: "English (US)"          },
    { code: "ja",    flag: "🇯🇵", name: "日本語",    sub: "Japanese"              },
    { code: "ko",    flag: "🇰🇷", name: "한국어",    sub: "Korean"                },
  ];

  // 通用 Toggle 开关组件（内联）
  const Toggle = ({
    checked, onChange,
  }: { checked: boolean; onChange: () => void }) => (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="relative inline-flex flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200"
      style={{
        width: 38, height: 22,
        background: checked ? "#9b30ff" : "rgba(128,128,128,0.35)",
        border: "none", padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute", top: 3, left: 3,
          width: 16, height: 16, borderRadius: "50%",
          background: "#fff",
          transform: checked ? "translateX(16px)" : "translateX(0)",
          transition: "transform 0.2s",
        }}
      />
    </button>
  );

  // 通用输入框样式
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(128,128,128,0.08)",
    border: "0.5px solid rgba(128,128,128,0.25)",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 14,
    color: "inherit",
    fontFamily: "inherit",
    outline: "none",
  };

  // 卡片容器样式
  const cardStyle: React.CSSProperties = {
    background: "var(--color-background-primary, rgba(255,255,255,0.05))",
    border: "0.5px solid rgba(128,128,128,0.18)",
    borderRadius: 12,
    padding: "20px 24px",
    marginBottom: 14,
  };

  // 小节标题样式
  const sectionTitle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 500,
    color: "rgba(128,128,128,0.7)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    marginBottom: 10,
  };

  // 行分隔线
  const rowDivider: React.CSSProperties = {
    borderTop: "0.5px solid rgba(128,128,128,0.15)",
    marginTop: 14,
    paddingTop: 14,
  };

  // 通知行
  const NotifRow = ({
    label, desc, checked, onChange,
  }: { label: string; desc: string; checked: boolean; onChange: () => void }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: "0.5px solid rgba(128,128,128,0.12)" }}>
      <div>
        <div style={{ fontSize: 14 }}>{label}</div>
        <div style={{ fontSize: 12, color: "rgba(128,128,128,0.7)", marginTop: 2 }}>{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );

  // 按钮样式
  const btn: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "7px 14px", borderRadius: 8,
    border: "0.5px solid rgba(128,128,128,0.25)",
    background: "transparent", fontSize: 13,
    cursor: "pointer", fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
  };
  const btnPurple: React.CSSProperties = { ...btn, background: "#9b30ff", color: "#fff", border: "none" };
  const btnDanger: React.CSSProperties  = { ...btn, color: "#e24b4a", border: "0.5px solid rgba(226,75,74,0.4)" };

  // ── 各面板内容 ─────────────────────────────────────────────────

  const panels: Record<NavKey, React.ReactNode> = {

    // 编辑个人资料（已去除个人主页链接）
    profile: (
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>编辑个人资料</h2>
        <p style={{ fontSize: 13, color: "rgba(128,128,128,0.7)", marginBottom: 24 }}>管理你在 Artvista 上的公开信息</p>

        <div style={cardStyle}>
          {/* 头像行 */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "linear-gradient(135deg,#7b10e0,#c060ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 500, color: "#fff", flexShrink: 0,
            }}>AV</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>艺术家昵称</div>
              <div style={{ fontSize: 13, color: "rgba(128,128,128,0.7)" }}>artvista.user@example.com</div>
            </div>
            <button style={{ ...btn, marginLeft: "auto" }}>
              <i className="ti ti-upload" aria-hidden="true" />更换头像
            </button>
          </div>

          {/* 昵称 + 账号 ID */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "rgba(128,128,128,0.7)", marginBottom: 5 }}>昵称</label>
              <input type="text" defaultValue="艺术家昵称" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "rgba(128,128,128,0.7)", marginBottom: 5 }}>账号 ID</label>
              <input type="text" defaultValue="artvista_user" readOnly style={{ ...inputStyle, opacity: 0.5 }} />
            </div>
          </div>

          {/* 个人简介 */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 12, color: "rgba(128,128,128,0.7)", marginBottom: 5 }}>个人简介</label>
            <textarea rows={3} placeholder="介绍一下自己..." style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {/* 操作按钮 */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button style={btn}>取消</button>
            <button style={btnPurple}>保存更改</button>
          </div>
        </div>
      </div>
    ),

    // 账户管理
    account: (
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>账户管理</h2>
        <p style={{ fontSize: 13, color: "rgba(128,128,128,0.7)", marginBottom: 24 }}>管理你的账户信息与绑定状态</p>

        <div style={cardStyle}>
          <div style={sectionTitle}>基本信息</div>
          {[
            { label: "邮箱地址", val: "artvista@example.com" },
            { label: "手机号码", val: "+86 138 **** 8888" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", ...(i > 0 ? rowDivider : {}) }}>
              <div>
                <div style={{ fontSize: 13, color: "rgba(128,128,128,0.7)" }}>{row.label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{row.val}</div>
              </div>
              <button style={btn}><i className="ti ti-edit" aria-hidden="true" />修改</button>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", ...rowDivider }}>
            <div style={{ fontSize: 13, color: "rgba(128,128,128,0.7)" }}>账号状态</div>
            <span style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", padding: "2px 10px", borderRadius: 99, fontSize: 12, fontWeight: 500 }}>正常</span>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={sectionTitle}>第三方绑定</div>
          {[
            { icon: "ti-brand-google", label: "Google 账号" },
            { icon: "ti-brand-github", label: "GitHub 账号" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", ...(i > 0 ? rowDivider : {}) }}>
              <div style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <i className={`ti ${row.icon}`} aria-hidden="true" style={{ fontSize: 17 }} />{row.label}
                <span style={{ fontSize: 12, color: "rgba(128,128,128,0.5)" }}>未绑定</span>
              </div>
              <button style={btn}>绑定</button>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <div style={{ ...sectionTitle, color: "#e24b4a" }}>危险操作</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, color: "rgba(128,128,128,0.7)" }}>注销账号</div>
              <div style={{ fontSize: 13, marginTop: 2 }}>永久删除你的账号与所有数据</div>
            </div>
            <button style={btnDanger}><i className="ti ti-trash" aria-hidden="true" />注销</button>
          </div>
        </div>
      </div>
    ),

    // 通知服务
    notifications: (
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>通知服务</h2>
        <p style={{ fontSize: 13, color: "rgba(128,128,128,0.7)", marginBottom: 24 }}>选择你希望接收的通知类型</p>

        <div style={cardStyle}>
          <div style={sectionTitle}>站内通知</div>
          <NotifRow label="新作品评论" desc="有人评论了你的作品时通知你" checked={notif.comment} onChange={() => setNotif(n => ({ ...n, comment: !n.comment }))} />
          <NotifRow label="新粉丝关注" desc="有新用户关注你时通知你"       checked={notif.follow}  onChange={() => setNotif(n => ({ ...n, follow:  !n.follow  }))} />
          <NotifRow label="作品获得点赞" desc="你的作品被点赞时通知你"     checked={notif.like}    onChange={() => setNotif(n => ({ ...n, like:    !n.like    }))} />
        </div>

        <div style={cardStyle}>
          <div style={sectionTitle}>邮件通知</div>
          <NotifRow label="活动与公告"   desc="Artvista 最新活动和平台公告" checked={notif.event}  onChange={() => setNotif(n => ({ ...n, event:  !n.event  }))} />
          <NotifRow label="每周创作报告" desc="每周发送你的创作数据摘要"     checked={notif.weekly} onChange={() => setNotif(n => ({ ...n, weekly: !n.weekly }))} />
        </div>
      </div>
    ),

    // 隐私与数据
    privacy: (
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>隐私与数据</h2>
        <p style={{ fontSize: 13, color: "rgba(128,128,128,0.7)", marginBottom: 24 }}>控制你的内容可见范围与数据使用方式</p>

        <div style={cardStyle}>
          <div style={sectionTitle}>内容可见性</div>
          <NotifRow label="公开个人主页"   desc="所有人均可查看你的主页与作品"     checked={priv.publicProfile} onChange={() => setPriv(p => ({ ...p, publicProfile: !p.publicProfile }))} />
          <NotifRow label="允许作品转载"   desc="其他用户可转载你标注允许的作品"   checked={priv.repost}       onChange={() => setPriv(p => ({ ...p, repost:       !p.repost       }))} />
          <NotifRow label="显示在推荐列表" desc="你的作品可能出现在平台推荐位"     checked={priv.recommend}    onChange={() => setPriv(p => ({ ...p, recommend:    !p.recommend    }))} />
        </div>

        <div style={cardStyle}>
          <div style={sectionTitle}>数据与隐私</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, color: "rgba(128,128,128,0.7)" }}>下载我的数据</div>
              <div style={{ fontSize: 13, marginTop: 2 }}>导出你的账号数据和作品</div>
            </div>
            <button style={btn}><i className="ti ti-download" aria-hidden="true" />申请导出</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", ...rowDivider }}>
            <div>
              <div style={{ fontSize: 13, color: "rgba(128,128,128,0.7)" }}>数据分析收集</div>
              <div style={{ fontSize: 13, marginTop: 2 }}>帮助我们改进产品体验</div>
            </div>
            <Toggle checked={priv.analytics} onChange={() => setPriv(p => ({ ...p, analytics: !p.analytics }))} />
          </div>
        </div>
      </div>
    ),

    // 安全
    security: (
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>安全</h2>
        <p style={{ fontSize: 13, color: "rgba(128,128,128,0.7)", marginBottom: 24 }}>保护你的账号安全</p>

        <div style={cardStyle}>
          <div style={sectionTitle}>登录安全</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, color: "rgba(128,128,128,0.7)" }}>登录密码</div>
              <div style={{ fontSize: 13, marginTop: 2 }}>上次修改：30 天前</div>
            </div>
            <button style={btn}><i className="ti ti-lock" aria-hidden="true" />修改密码</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", ...rowDivider }}>
            <div>
              <div style={{ fontSize: 13, color: "rgba(128,128,128,0.7)" }}>双重验证（2FA）</div>
              <div style={{ fontSize: 13, marginTop: 2 }}>使用验证器 App 或短信验证</div>
            </div>
            <span style={{ background: "rgba(234,179,8,0.12)", color: "#ca8a04", padding: "2px 10px", borderRadius: 99, fontSize: 12, fontWeight: 500 }}>未开启</span>
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "0.5px solid rgba(128,128,128,0.15)" }}>
            <button style={{ ...btnPurple, width: "100%", justifyContent: "center" }}>
              <i className="ti ti-shield-check" aria-hidden="true" />开启双重验证
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={sectionTitle}>登录设备</div>
          {[
            { icon: "ti-device-laptop", name: "MacBook Pro · Chrome", loc: "中国·上海 · 当前设备", current: true  },
            { icon: "ti-device-mobile", name: "iPhone 15 · Safari",   loc: "中国·北京 · 2 天前",  current: false },
          ].map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", ...(i > 0 ? rowDivider : {}) }}>
              <div>
                <div style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                  <i className={`ti ${d.icon}`} aria-hidden="true" />{d.name}
                </div>
                <div style={{ fontSize: 12, color: "rgba(128,128,128,0.6)", marginTop: 2 }}>{d.loc}</div>
              </div>
              {d.current
                ? <span style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", padding: "2px 10px", borderRadius: 99, fontSize: 12, fontWeight: 500 }}>在线</span>
                : <button style={{ ...btnDanger, fontSize: 12, padding: "5px 10px" }}>退出</button>
              }
            </div>
          ))}
        </div>
      </div>
    ),

    // 语言设置
    language: (
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>语言设置</h2>
        <p style={{ fontSize: 13, color: "rgba(128,128,128,0.7)", marginBottom: 24 }}>选择你偏好的显示语言</p>

        <div style={cardStyle}>
          {languages.map(l => (
            <div key={l.code}
              onClick={() => setLang(l.code)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 8,
                cursor: "pointer", marginBottom: 8,
                border: lang === l.code ? "0.5px solid #9b30ff" : "0.5px solid transparent",
                background: lang === l.code ? "rgba(155,48,255,0.06)" : "transparent",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 22 }}>{l.flag}</span>
              <div>
                <div style={{ fontSize: 14 }}>{l.name}</div>
                <div style={{ fontSize: 12, color: "rgba(128,128,128,0.6)" }}>{l.sub}</div>
              </div>
              {lang === l.code && (
                <i className="ti ti-check" aria-hidden="true" style={{ marginLeft: "auto", color: "#9b30ff", fontSize: 17 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    ),

    // 服务条款
    terms: (
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>服务条款</h2>
        <p style={{ fontSize: 13, color: "rgba(128,128,128,0.7)", marginBottom: 24 }}>了解 Artvista 平台的使用规则与协议</p>

        {[
          { title: "用户协议",   body: "使用 Artvista 即表示你同意遵守本平台的用户协议。协议规定了用户的权利与义务，包括内容发布规范、知识产权保护及账号使用限制等。",    link: "查看完整用户协议" },
          { title: "隐私政策",   body: "我们重视你的隐私。本政策说明 Artvista 收集、使用和保护你的个人信息的方式，以及你对自己数据所享有的权利。",                         link: "查看隐私政策"     },
          { title: "版权声明",   body: "Artvista 尊重创作者的知识产权。用户上传的作品版权归原作者所有，平台仅获得展示授权。如发现侵权内容，可通过官方渠道举报。",         link: "查看版权声明"     },
        ].map(t => (
          <div key={t.title} style={cardStyle}>
            <div style={sectionTitle}>{t.title}</div>
            <p style={{ fontSize: 14, color: "rgba(128,128,128,0.75)", lineHeight: 1.7, marginBottom: 10 }}>{t.body}</p>
            <a href="#" style={{ color: "#9b30ff", textDecoration: "none", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <i className="ti ti-external-link" aria-hidden="true" />{t.link}
            </a>
          </div>
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0" }}>
          <i className="ti ti-info-circle" aria-hidden="true" style={{ fontSize: 15, color: "rgba(128,128,128,0.6)" }} />
          <span style={{ fontSize: 13, color: "rgba(128,128,128,0.6)" }}>协议最后更新：2026 年 1 月 1 日</span>
        </div>
      </div>
    ),
  };

  return (
    // Tabler 图标字体引入（若项目中已有可删除此行）
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />

      <div style={{
  display: "flex",
  minHeight: "100vh",
  background: "#06010f",
  fontFamily: "system-ui, -apple-system, sans-serif",
  color: "rgba(255,255,255,0.88)",

  marginTop: "64px",
}}>

        {/* ── 左侧导航栏（可伸缩） ── */}
        <motion.aside
          animate={{ width: isNavExpanded ? 220 : 64 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          onMouseEnter={() => setIsNavExpanded(true)}
          onMouseLeave={() => setIsNavExpanded(false)}
          style={{
            flexShrink: 0,
            background: "rgba(255,255,255,0.03)",
            borderRight: "0.5px solid rgba(255,255,255,0.08)",
            padding: "28px 0",
            overflow: "hidden",
          }}
        >
          <motion.div 
            style={{ fontSize: 16, fontWeight: 500, padding: "0 20px 18px", whiteSpace: "nowrap" }}
          >
            {isNavExpanded && "设置"}
          </motion.div>

          {navItems.map(item => {
            const isActive = active === item.key;
            return (
              <div key={item.key}>
                <motion.div
                  onClick={() => setActive(item.key)}
                  animate={{
                    justifyContent: isNavExpanded ? "flex-start" : "center",
                    paddingLeft: isNavExpanded ? 20 : 0,
                    paddingRight: isNavExpanded ? 20 : 0,
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 20px", cursor: "pointer", fontSize: 14,
                    color: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)",
                    borderLeft: isActive ? "2px solid #9b30ff" : "2px solid transparent",
                    background: isActive ? "rgba(155,48,255,0.08)" : "transparent",
                    transition: "all 0.15s",
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  <i className={`ti ${item.icon}`} aria-hidden="true"
                    style={{ fontSize: 17, color: isActive ? "#9b30ff" : "inherit", flexShrink: 0 }} />
                  <motion.span
                    animate={{ opacity: isNavExpanded ? 1 : 0, width: isNavExpanded ? "auto" : 0 }}
                    style={{ whiteSpace: "nowrap", overflow: "hidden" }}
                  >
                    {item.label}
                  </motion.span>
                </motion.div>
                {/* 分隔线 */}
                {dividersAfter.includes(item.key) && (
                  <motion.div 
                    style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", margin: "8px 20px" }}
                    animate={{ opacity: isNavExpanded ? 1 : 0 }}
                  />
                )}
              </div>
            );
          })}
        </motion.aside>

        {/* ── 右侧内容区 ── */}
        <main style={{ flex: 1, padding: "100px 48px 36px", overflowY: "auto" }}>
          {panels[active]}
        </main>
      </div>
    </>
  );
}
