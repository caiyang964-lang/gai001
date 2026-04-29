import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import BackButton from '../components/BackButton';
import { api, Work } from '../lib/api';

export default function Gallery({ type }: { type: 'ai_drama' | 'photography' }) {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWorks(type).then(data => {
      setWorks(data);
      setLoading(false);
    });
  }, [type]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center font-serif italic text-black/40">Loading...</div>;

  return (
    <div className="w-full px-6 md:px-12 lg:px-20 py-12 pt-28">
      <BackButton />
      <motion.div 
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8 }}
         className="mb-12 md:mb-16"
      >
        <span className="text-[var(--color-accent)] text-xs tracking-[0.2em] mb-3 block font-medium">档案库</span>
        <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-[var(--color-text)]">
          {type === 'ai_drama' ? 'AI短剧' : '摄影作品'}
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-12">
        {works.map((work, idx) => (
          <GalleryItem key={`${work.id}-${idx}`} work={work} index={idx} />
        ))}
        {works.length > 0 && works.length < 8 && Array(8 - works.length).fill(null).map((_, i) => {
          const mockImages = [
            "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1485160497022-3e09382fb310?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1627885065099-014adfb828ee?q=80&w=800&auto=format&fit=crop"
          ];
          return (
            <GalleryItem 
              key={`mock-${i}`} 
              work={{
                ...works[0], 
                id: 999 + i, 
                title: `${works[0].title} - Version ${i + 2}`,
                coverImage: type === 'ai_drama' 
                  ? mockImages[i % mockImages.length] 
                  : mockImages[(i + 3) % mockImages.length]
              }} 
              index={works.length + i} 
            />
          );
        })}
      </div>
    </div>
  );
}

function GalleryItem({ work, index }: { work: Work; index: number }) {
  return (
    <Link to={`/work/${work.id}`} className="group w-full flex flex-col gap-4 cursor-pointer">
      <div className="w-full aspect-video overflow-hidden relative rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-stone-100">
         <motion.div 
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
            className="w-full h-full"
         >
           <img src={work.coverImage} alt={work.title} className="w-full h-full object-cover filter brightness-[0.95] group-hover:brightness-100 transition-all duration-700" />
         </motion.div>
      </div>
      
      <div className="flex flex-col px-1">
         <div className="flex items-center justify-between mb-2 mt-2">
            <div className="text-[10px] text-black/40 tracking-[0.3em] uppercase">No. {(index + 1).toString().padStart(2, '0')}</div>
         </div>
         <h2 className="font-serif text-xl font-medium mb-2 group-hover:text-[var(--color-accent)] text-[var(--color-text)] transition-colors duration-500">{work.title}</h2>
         <p className="text-black/60 font-light text-[13px] leading-relaxed line-clamp-2 mb-4">
           {work.description}
         </p>
         <span className="text-[11px] tracking-[0.1em] text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors font-medium flex items-center gap-1">
            查看详情 <span className="group-hover:translate-x-1 transition-transform">→</span>
         </span>
      </div>
    </Link>
  );
}
