import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UploadCloud, FileImage, FileVideo, AlertCircle } from 'lucide-react';
import { MediaItem } from '../AdminApp';

interface UploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { file?: File; name: string }) => Promise<void>;
  initialData?: MediaItem | null;
}

export default function Upload({ isOpen, onClose, onSave, initialData }: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'video' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setPreviewUrl(initialData.url);
        setPreviewType(initialData.type);
        setFile(null);
        setError(null);
      } else {
        resetForm();
      }
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setFile(null);
    setName('');
    setPreviewUrl(null);
    setPreviewType(null);
    setError(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile) return;
    
    // Validation: Check file type
    const isImage = selectedFile.type.startsWith('image/');
    const isVideo = selectedFile.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      setError('仅支持图片和视频文件上传');
      return;
    }
    
    // Validation: Check file size (e.g., max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('文件大小不能超过 50MB');
      return;
    }

    setFile(selectedFile);
    setName(selectedFile.name);
    setError(null);

    // Create preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setPreviewType(isVideo ? 'video' : 'image');
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setError('资源名称不能为空');
      return;
    }
    if (!initialData && !file) {
      setError('请选择要上传的文件');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({ file: file || undefined, name: name.trim() });
      handleClose();
    } catch (err: any) {
      setError(err.message || '操作失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          onClick={handleClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              {initialData ? '编辑资源' : '上传新资源'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl flex items-start gap-2 border border-red-100">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {!initialData && !previewUrl && (
              <div
                className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 flex flex-col items-center justify-center cursor-pointer transition-colors group relative"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
              >
                <div className="p-4 bg-white shadow-sm rounded-full mb-3 group-hover:scale-110 transition-transform text-blue-600">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-gray-700">点击或将文件拖动到这里</p>
                <p className="text-xs text-gray-500 mt-1">支持 JPG, PNG, GIF, MP4 (最大 50MB)</p>
              </div>
            )}

            {previewUrl && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  预览
                </label>
                <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden group">
                  {previewType === 'image' ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <video src={previewUrl} controls className="w-full h-full object-contain" />
                  )}
                  {/* Allow changing file when editing as well */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/40 px-4 py-2 rounded-lg font-medium backdrop-blur-md transition-colors"
                    >
                      重新选择文件
                    </button>
                  </div>
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,video/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileChange(f);
                // Reset input so selecting the same file again triggers change
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                资源名称
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                placeholder="请输入资源名称"
              />
            </div>
          </form>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || (!initialData && !file)}
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-full text-sm font-medium transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-md shadow-blue-600/20"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : null}
              {isSubmitting ? '保存中...' : '保存'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
