'use client';

import { useState, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { FileUploader, FileUploaderHandle } from './FileUploader';
import { categories } from '@/lib/data/categories';
import { Eye, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export function UploadForm() {
  const categoryOptions = categories.map((cat) => ({
    value: cat.slug,
    label: cat.name,
  }));

  // 表单数据状态
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [useCases, setUseCases] = useState('');
  const [contact, setContact] = useState('');

  // 文件引用（通过 ref 获取 FileUploader 中的文件）
  const coverRef = useRef<FileUploaderHandle>(null);
  const workRef = useRef<FileUploaderHandle>(null);

  // 提交状态
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [message, setMessage] = useState('');

  // 清理状态
  const resetStatus = () => {
    setStatus('idle');
    setMessage('');
  };

  // 提交处理
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('[UploadForm] handleSubmit called');

    // 1. 收集文件
    const coverFile = coverRef.current?.getFile() ?? null;
    const workFile = workRef.current?.getFile() ?? null;

    console.log('[UploadForm] Cover file:', coverFile);
    console.log('[UploadForm] Work file:', workFile);

    // 2. 基础验证
    if (!title.trim()) {
      setStatus('error');
      setMessage('请填写项目标题');
      return;
    }
    if (!coverFile) {
      setStatus('error');
      setMessage('请上传封面图片');
      return;
    }
    if (!workFile) {
      setStatus('error');
      setMessage('请上传作品文件');
      return;
    }
    if (!category) {
      setStatus('error');
      setMessage('请选择作品分类');
      return;
    }

    // 3. 开始上传
    setStatus('loading');
    setMessage('正在上传...');

    try {
      // 构建 FormData
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('tags', tags);
      formData.append('useCases', useCases);
      formData.append('contact', contact);
      formData.append('cover', coverFile);
      formData.append('work', workFile);

      console.log('[UploadForm] FormData prepared, sending request...');

      // 发送请求（请替换为真实 API 地址）
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('[UploadForm] Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[UploadForm] Upload success:', data);
        setStatus('success');
        setMessage(`作品「${title}」提交成功！审核结果将在 24 小时内通知您。`);

        // 3 秒后重置成功提示
        setTimeout(() => {
          resetStatus();
        }, 3000);
      } else {
        const errorText = await response.text();
        console.error('[UploadForm] Upload failed:', response.status, errorText);
        setStatus('error');
        setMessage(`上传失败 (${response.status})：${errorText || '请稍后重试'}`);
      }
    } catch (err) {
      // 网络错误或 fetch 异常
      console.error('[UploadForm] Upload error:', err);
      setStatus('error');
      setMessage(`上传失败：${err instanceof Error ? err.message : '请检查网络连接'}`);
    }
  };

  // 预览
  const handlePreview = () => {
    console.log('[UploadForm] Preview clicked - TODO: implement preview modal');
    alert('预览功能开发中...');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* 文件上传区 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUploader
          ref={coverRef}
          label="封面图片"
          accept="image/*"
          icon="image"
          hint="支持 JPG, PNG, WebP"
        />

        <FileUploader
          ref={workRef}
          label="作品文件"
          accept="video/*,image/gif"
          icon="video"
          hint="支持 MP4, MOV, GIF (最大500MB)"
        />
      </div>

      {/* 项目标题 */}
      <Input
        label="项目标题"
        placeholder="给你的作品起个名字"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 项目介绍 */}
      <Textarea
        label="项目介绍"
        placeholder="描述你的作品，包括创作理念、技术实现、使用场景等..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* 分类和标签 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="作品分类"
          placeholder="选择分类"
          options={categoryOptions}
          value={category}
          onChange={setCategory}
        />

        <Input
          label="技术标签"
          placeholder="TouchDesigner, GLSL, Audio (逗号分隔)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      {/* 使用场景 */}
      <Input
        label="使用场景"
        placeholder="音乐会视觉, 展览装置, 舞台设计 (逗号分隔)"
        value={useCases}
        onChange={(e) => setUseCases(e.target.value)}
      />

      {/* 联系方式 */}
      <Input
        label="联系方式"
        type="email"
        placeholder="your@email.com"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />

      {/* ── 反馈消息（AnimatePresence 动画） ── */}
      <AnimatePresence>
        {(status === 'success' || status === 'error') && message && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium
              ${status === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
              }
            `}
          >
            {status === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 提交按钮 */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 pt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          type="button"
          variant="secondary"
          icon={<Eye className="w-4 h-4" />}
          className="flex-1"
          onClick={handlePreview}
          disabled={status === 'loading'}
        >
          预览
        </Button>

        <Button
          type="submit"
          icon={
            status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )
          }
          className="flex-1"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? '提交中...' : '提交作品'}
        </Button>
      </motion.div>

      {/* 调试信息 */}
      <p className="text-white/30 text-xs text-center">
        所有操作已输出到浏览器 Console（F12），如遇问题请查看控制台
      </p>
    </form>
  );
}
