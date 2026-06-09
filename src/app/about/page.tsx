import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <main className={styles.main}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.heroLabel}>关于 Artvista</p>
            <h1 className={styles.heroTitle}>
              交互艺术、<br />
              生成艺术与<br />
              <span className={styles.accent}>实时视觉</span>
            </h1>
            <p className={styles.heroSub}>
              数字艺术的专业展示与轻交易平台
            </p>
            <a href="#mission" className={styles.heroBtn}>
              了解我们的使命
            </a>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.statBlock}>
              <span className={styles.statNum}>2026<span className={styles.statPlus}>+</span></span>
              <span className={styles.statDesc}>平台启航年份，面向未来持续演进</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBlock}>
              <span className={styles.statNum}>∞</span>
              <span className={styles.statDesc}>每一段代码都能创造独特的艺术体验</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section id="mission" className={styles.mission}>
        <div className={styles.sectionLabel}>
          <span className={styles.labelNum}>[01]</span>
          <span>我们的使命</span>
        </div>
        <div className={styles.missionGrid}>
          <div className={styles.missionVisual}>
            <div className={styles.orb} />
            <div className={styles.orbRing} />
          </div>
          <div className={styles.missionContent}>
            <h2 className={styles.sectionTitle}>
              让每一个<br />
              <span className={styles.accent}>创意</span>值得<br />
              被看见
            </h2>
            <p className={styles.bodyText}>
              打造一个专注于交互艺术、生成艺术、实时视觉作品的专业展示与轻交易平台。我们相信，每一段代码都能创造独特的艺术体验，每一个创意都值得被看见。
            </p>
            <p className={styles.bodyText}>
              在这里，艺术家们可以展示他们的作品，与志同道合的人交流，甚至将创意转化为价值。我们致力于降低艺术与技术的边界，让更多人能够接触到这门独特的艺术形式。
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className={styles.why}>
        <div className={styles.whyHeader}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelNum}>[02]</span>
            <span>为什么选择我们</span>
          </div>
          <p className={styles.whySub}>专注于交互艺术，只为创作者而生</p>
        </div>
        <div className={styles.whyCards}>
          {[
            {
              num: "01",
              title: "专业聚焦",
              desc: "专注于交互艺术领域，深入了解创作者的独特需求，提供精准的服务和支持。",
            },
            {
              num: "02",
              title: "极简体验",
              desc: "去繁就简，专注于内容本身。简洁的界面设计，让作品成为唯一的焦点。",
            },
            {
              num: "03",
              title: "艺术优先",
              desc: "作品始终是展览焦点。精心设计的展示环境，让每一件作品都能充分展现其魅力。",
            },
          ].map((card) => (
            <div key={card.num} className={styles.card}>
              <span className={styles.cardNum}>[{card.num}]</span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDesc}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Future ── */}
      <section className={styles.future}>
        <div className={styles.futureLeft}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelNum}>[03]</span>
            <span>未来方向</span>
          </div>
          <h2 className={styles.sectionTitle}>
            在交互艺术<br />
            领域，<span className={styles.accent}>不可</span><br />
            或缺的一部分
          </h2>
          <p className={styles.bodyText}>
            我们有远大的愿景，Artvista 将不断演进，成为交互艺术领域不可或缺的一部分。
          </p>
        </div>
        <div className={styles.futureRight}>
          {[
            "构建交互艺术资产库，为创作者提供可复用的组件和模板",
            "支持艺术家与委托方的直接连接，简化定制流程",
            "探索区块链确权与数字收藏可能性，保护创作者权益",
            "举办线上艺术展览与活动，促进艺术交流",
          ].map((item, i) => (
            <div key={i} className={styles.futureItem}>
              <span className={styles.futureNum}>0{i + 1}</span>
              <p className={styles.futureText}>{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <p className={styles.ctaLabel}>准备好开始了吗？</p>
          <h2 className={styles.ctaTitle}>
            与全球的交互艺术家<br />
            一起探索<span className={styles.accent}>数字艺术</span>的无限可能
          </h2>
          <div className={styles.ctaBtns}>
            <a href="/upload" className={styles.btnPrimary}>
              ✦ 上传作品
            </a>
            <a href="/discover" className={styles.btnSecondary}>
              探索作品
            </a>
          </div>
        </div>
        <div className={styles.ctaBg} />
      </section>
    </main>
  );
}
