export interface Artist {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location?: string;
  website?: string;
  social?: {
    twitter?: string;
    instagram?: string;
    behance?: string;
  };
  skills: string[];
  stats: {
    worksCount: number;
    followers: number;
    views: number;
  };
}

export interface Work {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  mediaUrl: string;
  mediaType: 'video' | 'gif' | 'image';
  category: Category;
  tags: string[];
  author: Artist;
  useCases: string[];
  featured: boolean;
  createdAt: string;
  views: number;
  likes: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
  color: string;
}

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  workId?: string;
  type: 'buy' | 'hire';
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'default' | 'outline' | 'tech';
