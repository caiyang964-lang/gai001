import { motion } from 'motion/react';
import BackButton from '../components/BackButton';

export default function About() {
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row pb-20 pt-16">
      {/* Portrait Side */}
      <motion.div 
         initial={{ opacity: 0, x: -50 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
         className="w-full md:w-1/2 h-[60vh] md:h-screen relative p-6 md:p-12 md:pt-20"
      >
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-rose-900/5 relative">
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2776&auto=format&fit=crop" 
            alt="Artist Portrait" 
            className="w-full h-full object-cover filter brightness-[0.95]"
          />
        </div>
      </motion.div>

      {/* Content Side */}
      <div className="w-full md:w-1/2 flex flex-col items-start justify-center p-12 md:p-24 relative">
        <div className="mb-12"><BackButton /></div>
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.3 }}
           className="max-w-xl"
        >
           <h1 className="font-serif text-6xl uppercase tracking-tighter mb-12 leading-[0.9] text-black">
              The <br/><span className="italic text-[var(--color-accent)]">Director's</span><br/> Eye.
           </h1>
           
           <div className="space-y-6 font-light text-black/70 leading-relaxed text-sm md:text-base">
             <p>
               I blend traditional cinematography with AI generation. I believe images should breathe — imperfect, narrative-driven, alive. From AI-assisted commercials to editorial series like Ruins Botany, I direct neural networks as if they were analog film. My work doesn't chase perfection; it chases soul. Where latent space meets depth of field.
             </p>
             <p>
               我融合传统电影摄影与AI生成技术。我相信影像应有呼吸感——不完美、有叙事、鲜活。从AI辅助的广告到《废墟植物志》，我像操控模拟胶片一样驾驭神经网络。我的作品不追求完美，只追求灵魂。潜空间与景深在此交汇。
             </p>
             <p className="pt-8 border-t border-black/10">
               Based in Tokyo. Available for commissions and gallery exhibitions worldwide.
             </p>
             <div className="pt-8 flex flex-col gap-2">
                <span className="uppercase text-[10px] tracking-[0.2em] text-[var(--color-accent)]">Contact</span>
                <a href="mailto:hello@framezero.studio" className="font-serif italic text-2xl text-black hover:text-[var(--color-accent)] transition-colors">hello@framezero.studio</a>
             </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
