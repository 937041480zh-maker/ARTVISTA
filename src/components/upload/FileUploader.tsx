'use client';

import { useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Film, X, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileUploaderHandle {
  getFile: () => File | null;
}

interface FileUploaderProps {
  label: string;
  accept: string;
  icon: 'image' | 'video';
  hint: string;
  onFileChange?: (file: File | null) => void;
}

export const FileUploader = forwardRef<FileUploaderHandle, FileUploaderProps>(({
  label,
  accept,
  icon,
  hint,
  onFileChange,
}, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const fileRef = useRef<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  // 暴露 getFile 方法给父组件调用
  useImperativeHandle(ref, () => ({
    getFile: () => fileRef.current,
  }));

  // 核心：读取文件并生成预览
  const handleFile = useCallback((file: File) => {
    console.log('[FileUploader] handleFile called:', file.name, file.type, file.size);

    // 清理旧预览 URL
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    fileRef.current = file;
    setFileName(file.name);
    setError(null);
    setIsVideo(file.type.startsWith('video/'));

    // 生成预览 URL
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // 通知父组件
    if (onFileChange) {
      onFileChange(file);
    }

    console.log('[FileUploader] Preview URL created:', objectUrl);
  }, [preview, onFileChange]);

  // input[type=file] 的 onChange - 之前完全缺失
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  // 拖拽悬停
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    console.log('[FileUploader] dragover');
  }, []);

  // 拖拽离开
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // 拖拽放下 - 之前没有提取文件
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    console.log('[FileUploader] drop - files count:', files.length);

    if (files.length > 0) {
      const file = files[0];
      handleFile(file);
    }
  }, [handleFile]);

  // 移除已选文件
  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    fileRef.current = null;
    setPreview(null);
    setFileName(null);
    setError(null);
    setIsVideo(false);

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    if (onFileChange) {
      onFileChange(null);
    }

    console.log('[FileUploader] File removed');
  }, [preview, onFileChange]);

  const Icon = icon === 'image' ? ImageIcon : Film;

  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-3">
        {label}
      </label>

      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          borderColor: isDragging ? '#a855f7' : preview ? '#a855f7' : 'rgba(255, 255, 255, 0.1)',
          backgroundColor: isDragging ? 'rgba(168, 85, 247, 0.1)' : 'rgba(255, 255, 255, 0.03)',
          boxShadow: isDragging ? '0 0 30px rgba(168, 85, 247, 0.3)' : 'none',
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          'relative aspect-video rounded-xl border-2 border-dashed',
          'flex flex-col items-center justify-center gap-4 transition-all duration-300',
          preview ? 'cursor-default' : 'cursor-pointer',
        )}
      >
        {/* 隐藏的 file input - 之前缺少 onChange */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          style={{ zIndex: preview ? -1 : 10 }}
        />

        {/* ── 预览模式 ── */}
        {preview && (
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            {isVideo ? (
              /* 视频预览 */
              <video
                ref={videoPreviewRef}
                src={preview}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
            ) : (
              /* 图片预览 */
              <img
                src={preview}
                alt={fileName ?? 'preview'}
                className="w-full h-full object-cover"
              />
            )}

            {/* 覆盖层 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* 文件信息 */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="w-4 h-4 text-white/80 flex-shrink-0" />
                <span className="text-white/90 text-xs truncate">{fileName}</span>
              </div>

              {/* 移除按钮 */}
              <button
                onClick={handleRemove}
                className="flex-shrink-0 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm
                  flex items-center justify-center hover:bg-red-500/80 transition-colors"
                title="移除"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* ── 空状态 ── */}
        {!preview && (
          <>
            <motion.div
              animate={{
                backgroundColor: isDragging ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
                color: isDragging ? '#a855f7' : 'rgba(255,255,255,0.4)',
              }}
              transition={{ duration: 0.2 }}
              className="w-14 h-14 rounded-xl flex items-center justify-center"
            >
              {isDragging ? (
                <UploadCloud className="w-6 h-6" />
              ) : (
                <Icon className="w-6 h-6" />
              )}
            </motion.div>

            <div className="text-center">
              <p className="text-white/80 text-sm font-medium mb-1">
                {isDragging ? '释放以上传' : '点击或拖拽上传'}
              </p>
              <p className="text-white/50 text-xs">
                {hint}
              </p>
            </div>
          </>
        )}
      </motion.div>

      {/* 错误提示 */}
      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
});

FileUploader.displayName = 'FileUploader';
