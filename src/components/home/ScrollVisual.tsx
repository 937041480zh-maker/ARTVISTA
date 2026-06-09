'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function ScrollVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="py-32 bg-background-secondary/30 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div style={{ y, opacity }} className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* 磨砂玻璃容器 */}
            <div className="relative px-8 py-12 rounded-3xl backdrop-blur-2xl bg-white/[0.03] border border-white/[0.08] shadow-2xl">
              {/* Quote */}
              <blockquote className="text-2xl md:text-4xl lg:text-5xl font-medium text-white leading-tight mb-8 tracking-tight">
              <blockquote className="text-2xl md:text-4xl lg:text-5xl font-medium text-white leading-tight mb-8 tracking-tight">
               &quot;在这里，代码化作艺术&quot;
              </blockquote>
              </blockquote>
              
              <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                我们相信每一个交互都是一次对话，
                <br />
                每一个视觉都是一种表达。
              </p>

              {/* Tags */}
              <div className="mt-10 flex items-center justify-center gap-3">
                {['TouchDesigner', '生成艺术', '交互视觉'].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-mono backdrop-blur-sm"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
