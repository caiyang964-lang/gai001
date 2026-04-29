import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload as UploadIcon, Image as ImageIcon, Settings, Trash2, Video, Server, Shield, LayoutDashboard, Database, RefreshCw, Plus, FileVideo, FileImage, Search, Bell, Copy, CheckCircle2, Edit2, GripVertical, Menu, X } from 'lucide-react';
import Upload from './components/Upload';

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  size: string;
  uploadTime: string;
}

const MOCK_MEDIA: MediaItem[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop', type: 'image', name: 'cyberpunk-city.jpg', size: '1.2 MB', uploadTime: '2023-10-25 14:30' },
  { id: '2', url: 'https://images.unsplash.com/photo-1621570074981-ee6a0145c8b5?q=80&w=600&auto=format&fit=crop', type: 'image', name: 'alps-winter.jpg', size: '2.5 MB', uploadTime: '2023-10-26 09:15' },
  { id: '3', url: 'https://www.w3schools.com/html/mov_bbb.mp4', type: 'video', name: 'demo-video.mp4', size: '15.4 MB', uploadTime: '2023-10-27 16:45' },
  { id: '4', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop', type: 'image', name: 'urban-shadows.jpg', size: '3.1 MB', uploadTime: '2023-10-28 10:20' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'media' | 'settings'>('dashboard');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(MOCK_MEDIA);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);

  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredMedia = mediaItems.filter(item => filterType === 'all' || item.type === filterType);

  // Upload or Edit handler
  const handleSave = async (data: { file?: File, name: string }) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (editingItem) {
          // Edit existing
          setMediaItems(mediaItems.map(item => 
            item.id === editingItem.id ? { ...item, name: data.name, url: data.file ? URL.createObjectURL(data.file) : item.url } : item
          ));
        } else if (data.file) {
          // Add new
          const isVideo = data.file.type.startsWith('video/');
          const newItem: MediaItem = {
            id: Date.now().toString(),
            url: isVideo ? 'https://www.w3schools.com/html/mov_bbb.mp4' : URL.createObjectURL(data.file), 
            type: isVideo ? 'video' : 'image',
            name: data.name,
            size: (data.file.size / (1024 * 1024)).toFixed(2) + ' MB',
            uploadTime: new Date().toLocaleDateString('zh-CN', { hour: '2-digit', minute: '2-digit' })
          };
          setMediaItems([newItem, ...mediaItems]);
        }
        resolve();
      }, 1000);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个文件吗？\n将在后台同步调用腾讯云COS删除接口。')) {
      setMediaItems(mediaItems.filter(item => item.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`确定要批量删除选中的 ${selectedIds.size} 个文件吗？\n将在后台同步调用腾讯云COS删除接口。`)) {
      setMediaItems(mediaItems.filter(item => !selectedIds.has(item.id)));
      setSelectedIds(new Set());
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredMedia.length && filteredMedia.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMedia.map(item => item.id)));
    }
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: React.ElementType }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
      >
        <span className="relative z-10 flex items-center gap-3">
          <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
          <span className="font-medium tracking-tight text-sm">{label}</span>
        </span>
        {isActive && (
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute inset-0 bg-white border border-gray-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-lg z-0"
            transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
          />
        )}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-[#FDFDFD] flex-col md:flex-row font-sans text-gray-900 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-[#F7F7F8] border-r border-gray-200/60 flex flex-col w-[260px] z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-500/20 shadow-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-gray-900 leading-none">Nexus Admin</h1>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest mt-1.5">Lighthouse OS</p>
            </div>
          </div>
          <button className="md:hidden text-gray-500 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-1.5 flex flex-col overflow-y-auto">
          <NavItem id="dashboard" label="系统概览" icon={LayoutDashboard} />
          <NavItem id="media" label="媒体资源库" icon={ImageIcon} />
          <NavItem id="settings" label="系统设置" icon={Settings} />
        </nav>
        
        {/* User Profile Snippet */}
        <div className="p-4 border-t border-gray-200/60">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-white shadow-sm flex items-center justify-center overflow-hidden">
               <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin" alt="User Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-gray-900">System Admin</p>
              <p className="text-xs text-gray-500 truncate">admin@nexus.local</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#FDFDFD]">
        
        {/* Header */}
        <header className="h-16 border-b border-gray-200/60 flex items-center justify-between px-4 sm:px-8 bg-white/50 backdrop-blur-sm z-10 shrink-0">
           <div className="flex items-center gap-3">
             <button className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
               <Menu className="w-5 h-5" />
             </button>
             <div className="flex items-center gap-2 text-sm text-gray-500 font-medium tracking-tight">
               <span className="hidden sm:inline">Home</span>
               <span className="hidden sm:inline text-gray-300">/</span>
               <span className="text-gray-900 capitalize">{activeTab}</span>
             </div>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="relative hidden sm:block">
               <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                  type="text" 
                  placeholder="搜索资源..." 
                  className="pl-9 pr-4 py-1.5 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-full text-sm w-48 transition-all outline-none"
               />
             </div>
             <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
           </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 lg:px-12">
          <div className="max-w-[1200px] mx-auto h-full">
            <AnimatePresence mode="wait">
              
              {/* === DASHBOARD TAB === */}
              {activeTab === 'dashboard' && (
                <motion.div 
                  key="dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8 pb-12"
                >
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900">概览</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Stat Card 1 */}
                    <div className="group bg-white p-6 rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 stroke-blue-600 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                         <Server className="w-32 h-32" />
                      </div>
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="p-2.5 bg-green-500/10 text-green-600 rounded-xl">
                          <Server className="w-5 h-5" />
                        </div>
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> 运行中</span>
                      </div>
                      <div className="relative z-10">
                        <p className="text-sm font-medium text-gray-500">后端服务器 (Lighthouse)</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">Status OK</h3>
                      </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="group bg-white p-6 rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5 stroke-indigo-600 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                         <Database className="w-32 h-32" />
                      </div>
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="p-2.5 bg-indigo-500/10 text-indigo-600 rounded-xl">
                          <Database className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="relative z-10">
                        <p className="text-sm font-medium text-gray-500">腾讯云 COS 存储量</p>
                        <div className="mt-1 flex items-baseline gap-2">
                           <h3 className="text-2xl font-bold text-gray-900">1.2<span className="text-sm font-semibold text-gray-500 ml-1">GB</span></h3>
                           <span className="text-sm text-gray-400 font-medium">/ 50 GB</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3 overflow-hidden">
                          <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '2.4%' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="group bg-white p-6 rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5 stroke-orange-600 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                         <ImageIcon className="w-32 h-32" />
                      </div>
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="p-2.5 bg-orange-500/10 text-orange-600 rounded-xl">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="relative z-10">
                        <p className="text-sm font-medium text-gray-500">资源总数</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{mediaItems.length} <span className="text-sm font-semibold text-gray-500">Items</span></h3>
                      </div>
                    </div>
                  </div>

                  {/* Info Banner */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 border border-gray-800 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-6 md:items-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
                    
                    <div className="p-4 bg-white/10 rounded-2xl shrink-0 backdrop-blur-md border border-white/10 relative z-10">
                      <Shield className="w-8 h-8 text-blue-200" />
                    </div>
                    
                    <div className="relative z-10 flex-1">
                       <h3 className="text-xl font-bold tracking-tight mb-2 text-white">架构与安全指南</h3>
                       <p className="text-blue-100 text-sm leading-relaxed max-w-3xl opacity-90">
                         您的媒体文件将直接客户端直传至 <strong>腾讯云 COS</strong>，实现零带宽损耗。
                         后台接口部署在 <strong>Lighthouse (轻量服务器)</strong>，仅负责下发加密的预签名凭证，绝不将 <code>SecretId/SecretKey</code> 暴露给前端。
                       </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* === MEDIA TAB === */}
              {activeTab === 'media' && (
                <motion.div 
                  key="media"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 pb-12"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight text-gray-900">资源库</h2>
                      <p className="text-sm text-gray-500 mt-1">管理并获取用于站点的媒体直链</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {selectedIds.size > 0 && (
                        <motion.button 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={handleBatchDelete}
                          className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 border border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          删除选中 ({selectedIds.size})
                        </motion.button>
                      )}
                      
                      <div className="bg-gray-100 p-1 flex items-center rounded-full border border-gray-200/60 hidden sm:flex">
                        <button 
                          onClick={() => { setFilterType('all'); setSelectedIds(new Set()); }}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterType === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                          全部
                        </button>
                        <button 
                          onClick={() => { setFilterType('image'); setSelectedIds(new Set()); }}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterType === 'image' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                          图片
                        </button>
                        <button 
                          onClick={() => { setFilterType('video'); setSelectedIds(new Set()); }}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterType === 'video' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                          视频
                        </button>
                      </div>

                      <button 
                        onClick={() => {
                          setEditingItem(null);
                          setIsUploadOpen(true);
                        }}
                        className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 px-5 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95 shadow-md shadow-gray-900/10"
                      >
                        <Plus className="w-4 h-4" />
                        上传新资源
                      </button>
                    </div>
                  </div>

                  {filteredMedia.length > 0 && (
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <button 
                        onClick={toggleSelectAll}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedIds.size === filteredMedia.length ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                          {selectedIds.size === filteredMedia.length && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        全选
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
                    <AnimatePresence>
                      {filteredMedia.map((item, i) => (
                        <motion.div 
                          key={item.id} 
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                          transition={{ delay: i * 0.05, duration: 0.4, type: 'spring', bounce: 0.2 }}
                          draggable={filterType === 'all'}
                          onDragStart={(e: any) => {
                            if (filterType !== 'all') return;
                            setDraggedId(item.id);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragOver={(e: any) => {
                            e.preventDefault();
                            if (filterType !== 'all' || !draggedId || draggedId === item.id) return;
                            
                            setMediaItems(prevItems => {
                              const draggedIndex = prevItems.findIndex(i => i.id === draggedId);
                              const overIndex = prevItems.findIndex(i => i.id === item.id);
                              if (draggedIndex === -1 || overIndex === -1) return prevItems;

                              const nextItems = [...prevItems];
                              const items = nextItems.splice(draggedIndex, 1);
                              nextItems.splice(overIndex, 0, items[0]);
                              return nextItems;
                            });
                          }}
                          onDragEnd={() => setDraggedId(null)}
                          className={`bg-white rounded-2xl border ${selectedIds.has(item.id) ? 'border-blue-500 shadow-md shadow-blue-500/10' : 'border-gray-200/60 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]'} overflow-hidden hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] hover:border-gray-300 transition-all group flex flex-col cursor-pointer relative ${draggedId === item.id ? 'opacity-50 scale-95' : ''}`}
                          onClick={() => toggleSelect(item.id)}
                        >
                          {/* Drag Handle Indicator */}
                          {filterType === 'all' && (
                            <div className="absolute top-3 left-3 z-20 w-7 h-7 rounded-md bg-black/20 backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-move hover:bg-black/40">
                              <GripVertical className="w-4 h-4 text-white" />
                            </div>
                          )}

                          {/* Selection Checkbox */}
                          <div 
                            className={`absolute top-3 right-3 z-20 w-5 h-5 rounded border ${selectedIds.has(item.id) ? 'bg-blue-600 border-blue-600' : 'backdrop-blur-md bg-black/20 border-white/50 opacity-0 group-hover:opacity-100'} flex items-center justify-center transition-all`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelect(item.id);
                            }}
                          >
                            {selectedIds.has(item.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </div>

                          {/* Thumbnail Area */}
                          <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden p-1">
                            <div className="w-full h-full relative rounded-xl overflow-hidden bg-gray-900 group-hover:shadow-inner transition-all">
                              {item.type === 'image' ? (
                                <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center relative bg-gradient-to-br from-indigo-900 to-black">
                                   <Video className="w-8 h-8 text-white/40 mb-2" />
                                </div>
                              )}
                              
                              {/* Type Badge */}
                              <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md border border-white/10 text-white/90 font-mono text-[10px] px-2 py-0.5 rounded shadow-sm flex items-center gap-1.5 uppercase font-semibold tracking-wider z-10">
                                {item.type === 'video' ? <FileVideo className="w-3 h-3" /> : <FileImage className="w-3 h-3" />}
                                {item.type}
                              </div>
                              
                              {/* Overlay Actions */}
                              <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                <button 
                                  className="w-10 h-10 bg-white/90 text-gray-900 rounded-full flex items-center justify-center hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-110 shadow-xl"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingItem(item);
                                    setIsUploadOpen(true);
                                  }}
                                  title="编辑"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-red-500 transition-all duration-300 hover:scale-110 shadow-xl"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item.id);
                                  }}
                                  title="删除"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <button 
                                  className="w-10 h-10 bg-white/90 text-gray-900 rounded-full flex items-center justify-center hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-110 shadow-xl"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(item.id, item.url);
                                  }}
                                  title="复制链接"
                                >
                                  {copiedId === item.id ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Details Area */}
                          <div className="p-4 flex flex-col gap-1 shrink-0 bg-white z-10">
                            <p className="text-sm font-semibold text-gray-900 truncate" title={item.name}>{item.name}</p>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100">{item.size}</span>
                              <span>{item.uploadTime}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  
                  {filteredMedia.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-300/80 mt-8"
                    >
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">空空如也</h3>
                      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{filterType !== 'all' ? `没有找到${filterType === 'image' ? '图片' : '视频'}资源` : '您的 COS 存储桶中暂无数据。将文件直传至云端以在网站上进行托管分发。'}</p>
                      <button 
                        onClick={() => {
                          setEditingItem(null);
                          setIsUploadOpen(true);
                        }}
                        className="text-sm text-white font-medium bg-gray-900 px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
                      >
                        上传文件
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* === SETTINGS TAB === */}
              {activeTab === 'settings' && (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8 max-w-3xl pb-12"
                >
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">系统配置</h2>
                    <p className="text-sm text-gray-500 mt-1">云服务提供商与接口绑定设置</p>
                  </div>
                  
                  <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] overflow-hidden">
                    
                    {/* Settings Group 1 */}
                    <div className="p-8 border-b border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <Server className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">API 端点 (Lighthouse)</h3>
                          <p className="text-xs text-gray-500 mt-0.5">指定提供 COS 临时鉴权密钥的自建服务地址</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <input 
                          type="text" 
                          defaultValue="https://api.your-lighthouse.com/sts"
                          className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono shadow-inner shadow-gray-200/20"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    {/* Settings Group 2 */}
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Database className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">腾讯云 COS 存储桶</h3>
                            <p className="text-xs text-gray-500 mt-0.5">目标上传位置及公网访问域名配置</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 mb-6 flex gap-3">
                        <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-semibold text-sm text-amber-900">请勿在此明文配置 SecretId 等账密信息</p>
                          <p className="text-xs text-amber-700/80 leading-relaxed">
                            为了防止您的云资产被盗刷，前端代码永远不应包含长期密钥。本后台采用临时凭证方案。长期密钥应存放在 Lighthouse 服务器的 <code>.env</code> 文件中。
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Bucket 名称</label>
                          <input 
                            type="text" 
                            defaultValue="my-media-bucket-1250000000"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">地域 (Region)</label>
                          <input 
                            type="text" 
                            defaultValue="ap-guangzhou"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                           <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">公网访问域名 (CDN)</label>
                          <input 
                            type="text" 
                            defaultValue="https://my-media-bucket-1250000000.cos.ap-guangzhou.myqcloud.com"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                      <button className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95 shadow-md shadow-gray-900/10">
                        保存配置
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Upload 
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        initialData={editingItem}
      />
    </div>
  );
}

