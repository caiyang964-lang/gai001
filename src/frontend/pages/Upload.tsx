import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { api } from '../lib/api';

export default function Upload() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'ai_drama' as 'ai_drama' | 'photography',
    title: '',
    description: '',
    coverImage: '',
    mediaUrl: '',
    script: '',
    assets: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      ...formData,
      mediaUrl: formData.mediaUrl ? [formData.mediaUrl] : [],
      assets: formData.assets ? formData.assets.split(',').map(s => s.trim()) : []
    };

    try {
      await api.createWork(body);
      navigate(formData.type === 'ai_drama' ? '/ai-dramas' : '/photography');
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/50 backdrop-blur-sm border border-black/10 rounded-lg p-4 text-black font-light focus:outline-none focus:border-[var(--color-accent)] focus:bg-white transition-all shadow-sm";

  return (
    <div className="max-w-3xl mx-auto px-6 py-32 pt-28">
      <BackButton />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-5xl font-light mb-16 text-center text-[var(--color-text)] tracking-wider">发布新作品</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex gap-8 border-b border-black/10 pb-4">
            <label className="flex items-center gap-2 cursor-pointer font-light tracking-wider uppercase text-sm text-[var(--color-text)]">
              <input 
                 type="radio" 
                 name="type" 
                 value="ai_drama"
                 checked={formData.type === 'ai_drama'}
                 onChange={e => setFormData({...formData, type: e.target.value})}
                 className="accent-[var(--color-accent)]"
              />
              AI短剧
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-light tracking-wider uppercase text-sm text-[var(--color-text)]">
              <input 
                 type="radio" 
                 name="type" 
                 value="photography"
                 checked={formData.type === 'photography'}
                 onChange={e => setFormData({...formData, type: e.target.value})}
                 className="accent-[var(--color-accent)]"
              />
              摄影作品
            </label>
          </div>

          <input 
            required placeholder="作品标题" className={inputClass}
            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
          />
          <textarea 
            required placeholder="作品描述" className={inputClass + " min-h-[100px] resize-y"}
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
          />
          <input 
            required placeholder="封面图片URL (例如 Unsplash 链接)" className={inputClass}
            value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})}
          />
          <input 
            placeholder="视频URL（可选）" className={inputClass}
            value={formData.mediaUrl} onChange={e => setFormData({...formData, mediaUrl: e.target.value})}
          />
          
          {formData.type === 'ai_drama' && (
             <textarea 
               placeholder="剧本 / 分镜（可选）" className={inputClass + " min-h-[150px] font-mono text-xs"}
               value={formData.script} onChange={e => setFormData({...formData, script: e.target.value})}
             />
          )}

          <input 
            placeholder="数字资产 (使用逗号分隔多个资产名称)" className={inputClass}
            value={formData.assets} onChange={e => setFormData({...formData, assets: e.target.value})}
          />

          <button 
            type="submit" 
            disabled={loading}
            className="mt-8 bg-black text-white rounded-lg py-4 tracking-[0.2em] text-[15px] font-medium hover:bg-[var(--color-accent)] transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? '发布中...' : '发布到作品集'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
