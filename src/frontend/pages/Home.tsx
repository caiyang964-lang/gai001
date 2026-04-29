import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full flex flex-col pt-10 pb-32">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center px-6 md:px-20">
        <div className="overflow-hidden mb-4">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="font-serif text-[12vw] sm:text-[10vw] leading-[0.8] font-light tracking-[-0.02em] uppercase"
          >
            Visual
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-12">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            className="font-serif text-[12vw] sm:text-[10vw] leading-[0.8] font-light tracking-[-0.02em] text-[var(--color-accent)] uppercase italic drop-shadow-sm"
          >
            Storytelling
          </motion.h1>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="max-w-xl text-black/60 font-sans font-light leading-relaxed text-sm md:text-base tracking-wide"
        >
          <p>
            Bridging the gap between artificial intelligence and human emotion. 
            Exploring narratives through AI short dramas and capturing raw reality through photography.
          </p>
        </motion.div>
      </section>

      {/* Featured Categories Editorial Layout */}
      <section className="w-full px-6 md:px-20 mt-32 lg:mt-40 max-w-7xl mx-auto">
        <div className="flex flex-col gap-32 lg:gap-48">
          {/* AI Drama Section */}
          <Link to="/ai-dramas" className="group flex flex-col md:flex-row items-center gap-12 md:gap-20 cursor-pointer">
             <div className="w-full md:w-3/5 overflow-hidden rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative aspect-[4/3] bg-stone-100">
                <img 
                  src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=3000&auto=format&fit=crop" 
                  alt="AI短剧" 
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1.5s] ease-[0.25,1,0.5,1]"
                />
             </div>
             <div className="w-full md:w-2/5 flex flex-col">
                <span className="text-[var(--color-accent)] tracking-[0.2em] text-xs mb-4 uppercase inline-block font-medium">01 • Generated Realities</span>
                <h2 className="text-4xl md:text-5xl font-light tracking-wide text-[var(--color-text)] mb-6 group-hover:text-[var(--color-accent)] transition-colors">
                  AI短剧
                </h2>
                <p className="text-black/60 font-light leading-relaxed mb-10 max-w-sm text-[15px]">
                  Explore the surreal & generated narratives exploring the meaning of consciousness in an AI-driven society.
                </p>
                <div className="flex items-center gap-3 text-sm tracking-[0.15em] font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  <span className="border-b border-black/20 pb-1 group-hover:border-[var(--color-accent)] transition-colors">进入放映厅</span>
                  <span className="group-hover:translate-x-2 transition-transform duration-500 ease-out">→</span>
                </div>
             </div>
          </Link>

          {/* Photography Section */}
          <Link to="/photography" className="group flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20 cursor-pointer">
             <div className="w-full md:w-1/2 overflow-hidden rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative aspect-[3/4] bg-stone-100">
                <img 
                  src="https://images.unsplash.com/photo-1621570074981-ee6a0145c8b5?q=80&w=3000&auto=format&fit=crop" 
                  alt="摄影作品" 
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1.5s] ease-[0.25,1,0.5,1]"
                />
             </div>
             <div className="w-full md:w-1/2 flex flex-col items-start md:items-end md:text-right">
                <span className="text-[var(--color-accent)] tracking-[0.2em] text-xs mb-4 uppercase inline-block font-medium">02 • Frozen Time</span>
                <h2 className="text-4xl md:text-5xl font-light tracking-wide text-[var(--color-text)] mb-6 group-hover:text-[var(--color-accent)] transition-colors">
                  摄影作品
                </h2>
                <p className="text-black/60 font-light leading-relaxed mb-10 max-w-sm text-[15px]">
                  Moments frozen in time and space. Capturing raw human emotion and architectural poetry through the analog lens.
                </p>
                <div className="flex items-center justify-end gap-3 text-sm tracking-[0.15em] font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                   <span className="group-hover:-translate-x-2 transition-transform duration-500 ease-out">←</span>
                   <span className="border-b border-black/20 pb-1 group-hover:border-[var(--color-accent)] transition-colors">浏览画廊</span>
                </div>
             </div>
          </Link>
        </div>
      </section>
      
      {/* Marquee Banner */}
      <div className="w-full overflow-hidden mt-40 border-y border-black/10 py-6 bg-white/20 backdrop-blur-sm">
         <div className="flex whitespace-nowrap opacity-30 text-black">
            <motion.div 
               animate={{ x: [0, -1000] }} 
               transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
               className="font-serif text-[10vw] uppercase leading-none tracking-tight flex items-center gap-12"
            >
               <span>• ARTIFICIAL INTELLIGENCE</span>
               <span className="italic">CINEMATOGRAPHY</span>
               <span>• CREATIVE DIRECTION</span>
               <span className="italic">PHOTOGRAPHY</span>
               <span>• ARTIFICIAL INTELLIGENCE</span>
               <span className="italic">CINEMATOGRAPHY</span>
            </motion.div>
         </div>
      </div>
    </div>
  );
}
