'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { categories } from '@/lib/data/categories';
import { CategoryCard } from '@/components/ui/CategoryCard';

export function CategorySection() {
  return (
    <section className="py-24 bg-background-primary">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary tracking-tight mb-3">
            浏览分类
          </h2>
          <p className="text-text-secondary text-sm max-w-md mx-auto">
            从 TouchDesigner 到生成艺术，探索不同风格的交互视觉作品
          </p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link href={`/discover?category=${category.slug}`}>
                <CategoryCard category={category} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
