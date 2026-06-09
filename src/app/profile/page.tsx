'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './profile.module.css';

// ============================================
// 接口定义 - 未来数据库预留
// ============================================

interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  role: string;
  skills: string[];
  stats: {
    worksCount: number;
    followers: number;
    views: number;
  };
}

interface Artwork {
  id: string;
  title: string;
  cover: string;
  author: string;
  category: string;
  tags: string[];
}

interface CollaborationType {
  id: number;
  icon: string;
  iconClass: string;
  title: string;
  description: string;
  tags: { label: string; className: string }[];
}

interface CollaborationState {
  isOpen: boolean;
  selected: boolean[];
  customEnabled: boolean;
  customText: string;
}

// ============================================
// 类型常量
// ============================================

const PRESET_COLLABORATIONS: CollaborationType[] = [
  {
    id: 0,
    icon: '🎬',
    iconClass: styles.iconPurple,
    title: '演出 & 现场视觉',
    description: '音乐节，品牌活动，沉浸式装置的实时视觉演出',
    tags: [
      { label: 'VJ', className: styles.tagPurple },
      { label: 'Live AV', className: styles.tagPurple },
      { label: '装置', className: styles.tagPurple },
    ],
  },
  {
    id: 1,
    icon: '🎵',
    iconClass: styles.iconTeal,
    title: '音乐可视化定制',
    description: '为音乐人、厂牌制作专属音频反应视觉内容',
    tags: [
      { label: 'MV', className: styles.tagTeal },
      { label: '可视化', className: styles.tagTeal },
      { label: '定制', className: styles.tagTeal },
    ],
  },
  {
    id: 2,
    icon: '🏛',
    iconClass: styles.iconAmber,
    title: '展览 & 艺术驻留',
    description: '参与群展、个展邀约及国内外艺术驻留项目',
    tags: [
      { label: '群展', className: styles.tagAmber },
      { label: '驻留', className: styles.tagAmber },
      { label: '跨媒体', className: styles.tagAmber },
    ],
  },
  {
    id: 3,
    icon: '💡',
    iconClass: styles.iconBlue,
    title: '教学 & 工作坊',
    description: 'TouchDesigner、GLSL 生成艺术方向的授课与培训',
    tags: [
      { label: '工作坊', className: styles.tagBlue },
      { label: '授课', className: styles.tagBlue },
    ],
  },
];

// ============================================
// 模拟数据 - 未来从数据库获取
// ============================================

const MOCK_USER: UserProfile = {
  id: 'artist-1',
  name: '林默',
  username: '@linmo',
  avatar: '',
  bio: '实时视觉与生成艺术创作者，专注于声音与图像的即时互动表达。作品曾在 MAMA 音乐节、UFO 媒体艺术节等活动中展出。',
  location: '上海',
  website: 'linmo.studio',
  role: '艺术家',
  skills: ['TouchDesigner', 'GLSL', 'MAX/MSP', 'Audio Reactive'],
  stats: {
    worksCount: 12,
    followers: 2847,
    views: 45600,
  },
};

const MOCK_ARTWORKS: Artwork[] = [];

// ============================================
// 主组件
// ============================================

export default function ProfilePage() {
  // 用户数据状态
  const [user] = useState<UserProfile>(MOCK_USER);
  const [artworks] = useState<Artwork[]>(MOCK_ARTWORKS);
  const [isOnline, setIsOnline] = useState(true);

  // 合作意向状态
  const [collab, setCollab] = useState<CollaborationState>({
    isOpen: true,
    selected: [true, true, true, true],
    customEnabled: false,
    customText: '',
  });

  // 临时状态（弹窗编辑用）
  const [tempCollab, setTempCollab] = useState<CollaborationState>({
    isOpen: true,
    selected: [true, true, true, true],
    customEnabled: false,
    customText: '',
  });

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 打开弹窗
  const openModal = () => {
    setTempCollab({ ...collab });
    setIsModalOpen(true);
  };

  // 关闭弹窗
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 设置接单状态
  const setStatus = (status: 'open' | 'closed') => {
    setTempCollab((prev) => ({
      ...prev,
      isOpen: status === 'open',
    }));
  };

  // 切换合作选项
  const toggleOpt = (index: number) => {
    setTempCollab((prev) => {
      const newSelected = [...prev.selected];
      newSelected[index] = !newSelected[index];
      return { ...prev, selected: newSelected };
    });
  };

  // 切换自定义
  const toggleCustom = () => {
    setTempCollab((prev) => ({
      ...prev,
      customEnabled: !prev.customEnabled,
    }));
  };

  // 保存设置
  const saveSettings = () => {
    setCollab({ ...tempCollab });
    setIsModalOpen(false);
  };

  // 渲染合作卡片
  const renderCollaborationCards = () => {
    const activePresets = PRESET_COLLABORATIONS.filter((_, i) => collab.selected[i]);
    const hasCustom = collab.customEnabled && collab.customText.trim().length > 0;

    if (activePresets.length === 0 && !hasCustom) {
      return (
        <div className={styles.collabEmpty}>
          <div className={styles.collabEmptyText}>暂未设置合作意向</div>
        </div>
      );
    }

    return (
      <div className={styles.collabGrid}>
        {activePresets.map((item) => (
          <motion.div
            key={item.id}
            className={styles.collabCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`${styles.cardIcon} ${item.iconClass}`}>{item.icon}</div>
            <div className={styles.cardTitle}>{item.title}</div>
            <div className={styles.cardDesc}>{item.description}</div>
            <div className={styles.cardTags}>
              {item.tags.map((tag, idx) => (
                <span key={idx} className={`${styles.cardTag} ${tag.className}`}>
                  {tag.label}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
        {hasCustom && (
          <motion.div
            className={styles.collabCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`${styles.cardIcon} ${styles.iconGray}`}>✦</div>
            <div className={styles.cardTitle}>{collab.customText.trim()}</div>
            <div className={styles.cardDesc}>自定义合作类型</div>
            <div className={styles.cardTags}>
              <span className={`${styles.cardTag} ${styles.tagGray}`}>自定义</span>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* 背景光晕 */}
      <div className={`${styles.glowBlob} ${styles.blob1}`} />
      <div className={`${styles.glowBlob} ${styles.blob2}`} />

      <div className={styles.wrapper}>
        {/* 个人信息区域 */}
        <div className={styles.profileHero}>
          <div className={styles.profileIdentity}>
            <div className={styles.avatarRing}>
              <div className={styles.avatarImg}>{user.name.slice(0, 2)}</div>
              <div
                className={styles.onlineDot}
                style={{ background: isOnline ? '#00d084' : 'rgba(255,255,255,0.2)' }}
              />
            </div>
            <div>
              <div className={styles.username}>{user.username}</div>
              <div className={styles.displayName}>{user.name}</div>
              <span className={styles.roleBadge}>{user.role}</span>
            </div>
          </div>
          <p className={styles.bio}>{user.bio}</p>
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21s-8-5.5-8-11a8 8 0 0116 0c0 5.5-8 11-8 11z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {user.location}
            </span>
            <span className={styles.metaItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
              <a className={styles.metaLink} href={`https://${user.website}`} target="_blank" rel="noopener noreferrer">
                {user.website}
              </a>
            </span>
          </div>
          <div className={styles.tags}>
            {user.skills.map((skill) => (
              <span key={skill} className={styles.tag}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 滚动字幕 */}
        <div className={styles.marqueeStrip}>
          <div className={styles.marqueeInner}>
            <span className={styles.marqueeItem}>
              REAL-TIME VISUALS <span className={styles.marqueeDot}>✦</span>
            </span>
            <span className={styles.marqueeItem}>
              GENERATIVE ART <span className={styles.marqueeDot}>✦</span>
            </span>
            <span className={styles.marqueeItem}>
              AUDIO REACTIVE <span className={styles.marqueeDot}>✦</span>
            </span>
            <span className={styles.marqueeItem}>
              LIVE PERFORMANCE <span className={styles.marqueeDot}>✦</span>
            </span>
            <span className={styles.marqueeItem}>
              INTERACTIVE MEDIA <span className={styles.marqueeDot}>✦</span>
            </span>
            <span className={styles.marqueeItem}>
              REAL-TIME VISUALS <span className={styles.marqueeDot}>✦</span>
            </span>
            <span className={styles.marqueeItem}>
              GENERATIVE ART <span className={styles.marqueeDot}>✦</span>
            </span>
            <span className={styles.marqueeItem}>
              AUDIO REACTIVE <span className={styles.marqueeDot}>✦</span>
            </span>
            <span className={styles.marqueeItem}>
              LIVE PERFORMANCE <span className={styles.marqueeDot}>✦</span>
            </span>
            <span className={styles.marqueeItem}>
              INTERACTIVE MEDIA <span className={styles.marqueeDot}>✦</span>
            </span>
          </div>
        </div>

        {/* 统计数据 */}
        <div className={styles.statsBar}>
          <div className={styles.stat}>
            <div className={styles.statNum}>{user.stats.worksCount}</div>
            <div className={styles.statLabel}>作品</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>
              <span>{(user.stats.followers / 1000).toFixed(1)}</span>k
            </div>
            <div className={styles.statLabel}>关注者</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>
              <span>{(user.stats.views / 1000).toFixed(1)}</span>k
            </div>
            <div className={styles.statLabel}>浏览</div>
          </div>
        </div>

        {/* 作品区域 */}
        <div className={styles.worksSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>我的作品</span>
            <Link href="/upload">
              <button className={styles.uploadBtn}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                上传新作品
              </button>
            </Link>
          </div>
          {artworks.length === 0 ? (
            <div className={styles.worksEmpty}>
              <svg
                width="48"
                height="48"
                style={{ margin: '0 auto 16px', display: 'block', opacity: 0.2 }}
                viewBox="0 0 48 48"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
              >
                <rect x="8" y="8" width="32" height="32" rx="4" />
                <path d="M8 28l10-10 8 8 6-6 8 8" />
                <circle cx="18" cy="18" r="3" />
              </svg>
              <div className={styles.emptyText}>暂无作品 · 上传你的第一件作品</div>
            </div>
          ) : (
            <div className={styles.worksGrid}>
              {artworks.map((artwork) => (
                <Link key={artwork.id} href={`/artwork/${artwork.id}`}>
                  <div className={styles.workCard}>
                    <div className={styles.workCover} style={{ background: artwork.cover }} />
                    <div className={styles.workInfo}>
                      <div className={styles.workTitle}>{artwork.title}</div>
                      <div className={styles.workMeta}>{artwork.category}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 合作意向区域 */}
        <div className={styles.collabSection}>
          <div className={styles.collabTop}>
            <span className={styles.sectionTitle}>合作意向</span>
            <div
              className={`${styles.statusPill} ${!collab.isOpen ? styles.closed : ''}`}
              onClick={openModal}
            >
              <div
                className={styles.statusDot}
                style={{ background: collab.isOpen ? '#00d084' : 'rgba(255,255,255,0.25)' }}
              />
              <span
                className={styles.statusText}
                style={{ color: collab.isOpen ? 'rgba(0,208,132,.85)' : 'rgba(255,255,255,.3)' }}
              >
                {collab.isOpen ? '当前开放接单' : '暂不接单'}
              </span>
              <span className={styles.statusEdit}>· 修改</span>
            </div>
          </div>
          {renderCollaborationCards()}
        </div>
      </div>

      {/* 弹窗 */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>
              ✕
            </button>
            <div className={styles.modalTitle}>修改合作意向</div>
            <div className={styles.modalSub}>设置你的接单状态，并选择愿意接受的合作类型。</div>

            {/* 接单状态 */}
            <div className={styles.modalSectionLabel}>接单状态</div>
            <div className={styles.statusOptions}>
              <div
                className={`${styles.statusOpt} ${tempCollab.isOpen ? styles.activeOpen : ''}`}
                onClick={() => setStatus('open')}
              >
                <div
                  className={styles.statusOptDot}
                  style={{ background: tempCollab.isOpen ? '#00d084' : 'rgba(255,255,255,.2)' }}
                />
                <div className={styles.statusOptLabel}>开放接单</div>
              </div>
              <div
                className={`${styles.statusOpt} ${!tempCollab.isOpen ? styles.activeClosed : ''}`}
                onClick={() => setStatus('closed')}
              >
                <div
                  className={styles.statusOptDot}
                  style={{ background: !tempCollab.isOpen ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.2)' }}
                />
                <div className={styles.statusOptLabel}>暂不接单</div>
              </div>
            </div>

            {/* 合作类型 */}
            <div className={styles.modalSectionLabel}>合作类型（可多选）</div>
            <div className={styles.collabOpts}>
              {PRESET_COLLABORATIONS.map((item, index) => (
                <div
                  key={item.id}
                  className={`${styles.collabOpt} ${tempCollab.selected[index] ? styles.selected : ''}`}
                  onClick={() => toggleOpt(index)}
                >
                  <div className={styles.checkBox}>
                    {tempCollab.selected[index] && '✓'}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', marginBottom: '4px' }}>{item.icon}</div>
                    <div className={styles.optLabel}>{item.title}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 自定义输入 */}
            <div className={styles.customRow}>
              <div
                className={`${styles.customCheck} ${tempCollab.customEnabled ? styles.on : ''}`}
                onClick={toggleCustom}
              >
                {tempCollab.customEnabled && '✓'}
              </div>
              <span className={styles.customLabel}>其他</span>
              <div className={styles.customInputWrap}>
                <input
                  className={styles.customInput}
                  type="text"
                  placeholder="填写自定义合作类型…"
                  disabled={!tempCollab.customEnabled}
                  maxLength={30}
                  value={tempCollab.customText}
                  onChange={(e) =>
                    setTempCollab((prev) => ({ ...prev, customText: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* 底部按钮 */}
            <div className={styles.modalFooter}>
              <button className={styles.btnCancel} onClick={closeModal}>
                取消
              </button>
              <button className={styles.btnSave} onClick={saveSettings}>
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
