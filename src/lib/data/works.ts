import { Work, Artist, Category } from '@/lib/types';

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'TouchDesigner',
    slug: 'touchdesigner',
    icon: 'layers',
    count: 24,
    color: '#9933B3',
    description: '实时节点可视化编程，创造沉浸式互动装置与视觉表演体验',
  },
  {
    id: '2',
    name: '音画互动',
    slug: 'audio-visual',
    icon: 'music',
    count: 18,
    color: '#B34DE6',
    description: '声音驱动视觉生成，音频响应与可视化的艺术融合',
  },
  {
    id: '3',
    name: '生成式设计',
    slug: 'generative-design',
    icon: 'sparkles',
    count: 32,
    color: '#CC66FF',
    description: '算法驱动形态生成，探索规则与随机之间的无限可能',
  },
  {
    id: '4',
    name: '代码交互',
    slug: 'code-art',
    icon: 'code',
    count: 12,
    color: '#F59E0B',
    description: '以代码为笔触，构建可触摸、可回应的数字艺术装置',
  },
  {
    id: '5',
    name: '场馆动态',
    slug: 'venue',
    icon: 'building',
    count: 15,
    color: '#10B981',
    description: '沉浸式空间投影映射与大型场馆互动艺术现场记录',
  },
  {
    id: '6',
    name: '现场视觉',
    slug: 'live-vj',
    icon: 'video',
    count: 20,
    color: '#6366F1',
    description: '演出现场实时视觉表演，VJ艺术与现场视觉混合创作',
  },
];

export const categories = mockCategories;

const mockArtists: Artist[] = [
  {
    id: 'a1',
    name: '林墨白',
    username: 'linmobai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    bio: '专注于交互艺术与生成视觉创作',
    location: '上海',
    website: 'https://linmobai.art',
    skills: ['TouchDesigner', 'WebGL', 'Three.js'],
    stats: {
      worksCount: 12,
      followers: 2340,
      views: 45600,
    },
  },
  {
    id: 'a2',
    name: '苏紫晴',
    username: 'suziqing',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    bio: '探索声音与视觉的无限可能',
    location: '北京',
    skills: ['Max/MSP', 'Processing', '音频可视化'],
    stats: {
      worksCount: 8,
      followers: 1560,
      views: 28900,
    },
  },
  {
    id: 'a3',
    name: '陈星河',
    username: 'chenxinghe',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    bio: '数字艺术创作者与装置艺术家',
    location: '深圳',
    website: 'https://chenxinghe.io',
    skills: ['WebGL', 'GLSL', '物理模拟'],
    stats: {
      worksCount: 15,
      followers: 3200,
      views: 67800,
    },
  },
];

export const mockWorks: Work[] = [
  {
    id: 'w2',
    title: '声光交织',
    slug: 'sound-light-weave',
    description: '将音频频谱转化为动态几何图案，创造沉浸式视听体验',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=450&fit=crop',
    mediaUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&h=1080&fit=crop',
    mediaType: 'image',
    category: mockCategories[1],
    tags: ['音频响应', '几何', '沉浸式'],
    author: mockArtists[1],
    useCases: ['音乐会', '酒吧', '艺术装置'],
    featured: true,
    createdAt: '2024-02-20',
    views: 8900,
    likes: 654,
  },
];

export function getWorkById(id: string): Work | undefined {
  return mockWorks.find((work) => work.id === id);
}

export function getWorkBySlug(slug: string): Work | undefined {
  return mockWorks.find((work) => work.slug === slug);
}

export function getFeaturedWorks(): Work[] {
  return mockWorks.filter((work) => work.featured);
}

export function getWorksByCategory(categorySlug: string): Work[] {
  return mockWorks.filter((work) => work.category.slug === categorySlug);
}

export function getWorksByAuthor(authorId: string): Work[] {
  return mockWorks.filter((work) => work.author.id === authorId);
}

export function getRelatedWorks(workId: string, limit: number = 4): Work[] {
  const currentWork = getWorkById(workId);
  if (!currentWork) return [];
  
  return mockWorks
    .filter((work) => work.id !== workId && work.category.id === currentWork.category.id)
    .slice(0, limit);
}

export function getAllWorks(): Work[] {
  return mockWorks;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getAllCategories(): Category[] {
  return categories;
}
