import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, Trash2 } from 'lucide-react';
import BackButton from '../components/BackButton';
import { api, Work } from '../lib/api';

export default function WorkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState<Work | null>(null);

  useEffect(() => {
    if (id) {
      api.getWork(id).then(data => setWork(data));
    }
  }, [id]);

  const handleDelete = async () => {
    if (id && window.confirm('确定要删除这个作品吗？')) {
      try {
        await api.deleteWork(id);
        navigate(-1);
      } catch (err) {
        console.error('Failed to delete work', err);
      }
    }
  };

  if (!work) return <div className="h-screen flex items-center justify-center font-serif text-white/50">Loading...</div>;

  return (
    <article className="w-full pb-32 pt-28 px-6 md:px-20">
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <BackButton />
          <button 
             onClick={handleDelete}
             className="flex items-center gap-2 text-rose-500/50 hover:text-rose-500 transition-colors mb-8 group"
             title="删除作品"
          >
             <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
             <span className="text-sm tracking-widest font-medium">删除作品</span>
          </button>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
           <span className="text-[var(--color-accent)] tracking-[0.2em] text-xs mb-6 block">
              {work.type === 'ai_drama' ? 'AI短剧项目' : '摄影展览'}
           </span>
           <h1 className="font-serif text-5xl md:text-8xl font-light uppercase tracking-tight leading-[0.9] text-[var(--color-text)] max-w-5xl">
             {work.title}
           </h1>
        </motion.div>
        
        <div className="w-full h-[60vh] relative overflow-hidden mt-8 rounded-xl shadow-2xl shadow-rose-900/5 bg-stone-100">
           <img src={work.coverImage} alt={work.title} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-0 mt-20 grid grid-cols-1 md:grid-cols-12 gap-16">
         {/* Details Sidebar */}
         <div className="col-span-1 md:col-span-4 border-t border-black/10 pt-6">
            <h3 className="text-xs tracking-[0.1em] text-black/40 mb-4">关于项目</h3>
            <p className="font-light text-[15px] leading-relaxed text-black/80">
              {work.description}
            </p>
            
            <h3 className="text-xs tracking-[0.1em] text-black/40 mt-12 mb-4">创作日期</h3>
            <p className="font-serif italic text-black/60">{new Date(work.createdAt).toLocaleDateString()}</p>
         </div>

         {/* Content Area */}
         <div className="col-span-1 md:col-span-8 flex flex-col gap-24 border-t border-black/10 pt-6">
            
            {/* Video / Media section */}
            {work.mediaUrl && work.mediaUrl.length > 0 && (
              <section>
                 <h2 className="text-xl font-sans tracking-widest mb-8 text-[var(--color-text)]">作品展示</h2>
                 <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden border border-black/5 rounded-xl shadow-xl shadow-rose-900/10">
                    <video 
                       controls 
                       className="w-full h-full object-cover"
                       poster={work.coverImage}
                    >
                       <source src={work.mediaUrl[0]} type="video/mp4" />
                    </video>
                 </div>
              </section>
            )}

            {/* Script Section */}
            {work.script && (
              <section>
                 <h2 className="text-xl font-sans tracking-widest mb-8 text-[var(--color-text)]">原始剧本</h2>
                 <div className="bg-white/60 backdrop-blur-md border border-black/5 p-10 font-mono text-xs text-black/70 leading-loose whitespace-pre-wrap rounded-xl shadow-lg shadow-rose-900/5 max-h-[500px] overflow-y-auto">
                    {work.script}
                 </div>
              </section>
            )}

            {/* Assets Section */}
            {work.assets && work.assets.length > 0 && (
              <section>
                 <h2 className="text-xl font-sans tracking-widest mb-8 text-[var(--color-text)]">数字资产与笔记</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {work.assets.map((asset, i) => (
                      <div key={i} className="bg-white/40 backdrop-blur-sm border border-black/5 rounded-xl p-6 flex items-start gap-4 hover:bg-white transition-colors cursor-pointer group shadow-sm hover:shadow-md">
                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[var(--color-accent)] flex-shrink-0 group-hover:bg-[var(--color-accent)] group-hover:text-white transition-colors">
                           {i + 1}
                        </div>
                        <p className="text-sm font-light text-black/80 pt-1 uppercase tracking-wider">{asset}</p>
                      </div>
                    ))}
                 </div>
              </section>
            )}
         </div>
      </div>
    </article>
  );
}
