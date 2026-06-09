'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FilterBar, WorkGrid } from '@/components/discover';
import { getAllWorks } from '@/lib/data/works';
import { categories } from '@/lib/data/categories';

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorks = useMemo(() => {
    let works = getAllWorks();

    if (selectedCategory !== 'all') {
      works = works.filter((work) => work.category.slug === selectedCategory);
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
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-black">
      <FilterBar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <WorkGrid works={filteredWorks} />
      </motion.div>
    </div>
  );
}
