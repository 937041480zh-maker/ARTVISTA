'use client';

import { motion } from 'framer-motion';
import { UploadForm } from '@/components/upload';

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 背景装饰层 */}
      <div className="absolute inset-0">
        {/* 中央巨型紫色渐变光晕 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]">
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, #7c3aed 0%, #a855f7 40%, #ec4899 70%, transparent 100%)',
              filter: 'blur(120px)',
              opacity: 0.5,
            }}
          />
        </div>
        
        {/* 粒子效果 */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
            animate={{ y: [0, -30, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ top: '20%', left: '15%' }}
          />
          <motion.div
            className="absolute w-1.5 h-1.5 bg-pink-400/50 rounded-full"
            animate={{ y: [0, 40, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{ top: '30%', right: '25%' }}
          />
          <motion.div
            className="absolute w-1 h-1 bg-purple-300/70 rounded-full"
            animate={{ y: [0, -50, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 6, repeat: Infinity }}
            style={{ bottom: '30%', left: '30%' }}
          />
          <motion.div
            className="absolute w-2 h-2 bg-fuchsia-400/40 rounded-full"
            animate={{ y: [0, 30, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 7, repeat: Infinity }}
            style={{ bottom: '25%', right: '15%' }}
          />
          <motion.div
            className="absolute w-1 h-1 bg-violet-400/50 rounded-full"
            animate={{ y: [0, -40, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 5.5, repeat: Infinity }}
            style={{ top: '60%', left: '60%' }}
          />
          <motion.div
            className="absolute w-1.5 h-1.5 bg-purple-500/40 rounded-full"
            animate={{ y: [0, 50, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6.5, repeat: Infinity }}
            style={{ top: '15%', right: '40%' }}
          />
        </div>
      </div>

      {/* 内容层 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto px-5 lg:px-20 py-20 relative z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            上传作品
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/70 text-lg"
          >
            分享您的交互艺术作品，让更多人看到
          </motion.p>
        </motion.div>

        {/* Form - 玻璃拟态卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="p-10 rounded-2xl 
            bg-[rgba(255,255,255,0.05)] 
            backdrop-blur-[20px]
            border border-[rgba(255,255,255,0.1)]
            shadow-[
              inset_0_1px_0_rgba(255,255,255,0.1),
              0_2px_4px_rgba(0,0,0,0.2),
              0_4px_8px_rgba(0,0,0,0.15),
              0_8px_16px_rgba(0,0,0,0.1),
              0_16px_32px_rgba(124,58,237,0.1),
              0_32px_64px_rgba(124,58,237,0.05)
            ]"
        >
          <UploadForm />
        </motion.div>

        {/* Guidelines - 玻璃拟态卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 p-8 rounded-xl 
            bg-[rgba(255,255,255,0.05)] 
            backdrop-blur-[20px]
            border border-[rgba(255,255,255,0.1)]
            shadow-[
              inset_0_1px_0_rgba(255,255,255,0.1),
              0_2px_4px_rgba(0,0,0,0.2),
              0_4px_8px_rgba(0,0,0,0.15),
              0_8px_16px_rgba(0,0,0,0.1),
              0_16px_32px_rgba(124,58,237,0.08)
            ]"
        >
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-display font-semibold text-white text-lg mb-6"
          >
            上传须知
          </motion.h3>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            {[
              '作品必须是原创的交互艺术、生成艺术或实时视觉作品',
              '封面图建议使用 16:9 或 4:3 比例的横版图片',
              '视频文件支持 MP4、MOV 格式，单个文件不超过 500MB',
              '请确保您拥有作品中使用的所有素材的版权',
              '上传后需要审核，审核结果将在 24 小时内通知您',
            ].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="flex items-start gap-3 text-white/70 text-sm leading-relaxed"
              >
                <span className="text-[#a855f7] mt-0.5 flex-shrink-0">•</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
