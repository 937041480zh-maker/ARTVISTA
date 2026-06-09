'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FilterBar, WorkGrid } from '@/components/discover';
import { getAllWorks, getCategoryBySlug, categories } from '@/lib/data/works';
import Link from 'next/link';

interface CategoryPageClientProps {
  slug: string;
}

export default function CategoryPageClient({ slug }: CategoryPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const category = getCategoryBySlug(slug);

  const filteredWorks = useMemo(() => {
    let works = getAllWorks();

    if (slug !== 'all') {
      works = works.filter((work) => work.category.slug === slug);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      works = works.filter(
        (work) =>
          work.title.toLowerCase().includes(query) ||
          work.description.toLowerCase().includes(query) ||
          work.author.name.toLowerCase().includes(query) ||
          work.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return works;
  }, [slug, searchQuery]);

  if (!category) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">分类不存在</h1>
          <Link href="/discover" className="text-purple-400 hover:text-purple-300">
            返回发现页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <FilterBar
        selectedCategory={slug}
        onCategoryChange={() => {}}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{category.name}</h1>
            <p className="text-white/60">{category.description}</p>
            <p className="text-white/40 text-sm mt-2">{filteredWorks.length} 件作品</p>
          </div>
        </div>
        <WorkGrid works={filteredWorks} />
      </motion.div>
    </div>
  );
}
