import { useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { UploadCloud } from 'lucide-react';
import CustomCursor from './CustomCursor';

export default function Layout() {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [location.pathname]);

  const navItems = [
    { name: '首页', path: '/' },
    { name: 'AI短剧', path: '/ai-dramas' },
    { name: '摄影作品', path: '/photography' },
    { name: '关于我', path: '/about' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative w-full font-sans bg-[var(--color-bg)] text-[var(--color-text)]">
      <CustomCursor />
      {/* Background Atmosphere - Vivid but not messy */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
           animate={{ x: [0, 30, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
           transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-rose-200/40 blur-[120px] mix-blend-multiply" 
        />
        <motion.div 
           animate={{ x: [0, -30, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
           transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
           className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 blur-[150px] mix-blend-multiply" 
        />
        <motion.div 
           animate={{ x: [20, -20, 20], y: [20, -20, 20], scale: [1, 1.05, 1] }}
           transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-[20%] left-[40%] w-[40%] h-[40%] rounded-full bg-amber-200/30 blur-[130px] mix-blend-multiply" 
        />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-8 flex justify-between items-center backdrop-blur-sm bg-white/10 border-b border-black/5">
        <Link to="/" className="text-2xl font-serif tracking-widest uppercase font-light text-[var(--color-text)]">
          Frame Zero
        </Link>
        <nav className="hidden md:flex items-center space-x-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "uppercase tracking-[0.15em] text-xs font-medium transition-colors hover:text-[var(--color-accent)] drop-shadow-sm",
                location.pathname === item.path ? "text-[var(--color-accent)]" : "text-black/60"
              )}
            >
              {item.name}
            </Link>
          ))}
          <a href="/admin" target="_blank" rel="noopener noreferrer" className="ml-8 w-10 h-10 rounded-full bg-white/50 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all text-black/60 shadow-sm" title="后台管理系统">
             <UploadCloud size={16} />
          </a>
        </nav>
      </header>

      {/* Main Content with Page Transitions */}
      <main className="flex-1 w-full mx-auto relative z-10 pt-[100px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-h-screen"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="w-full py-12 px-6 border-t border-black/5 flex flex-col md:flex-row items-center justify-between z-10 bg-white/40 backdrop-blur-md mt-auto">
        <p className="text-black/40 text-xs tracking-widest uppercase">© {new Date().getFullYear()} Frame Zero. Personal Portfolio.</p>
        <div className="flex space-x-6 mt-6 md:mt-0 text-black/40">
          <Link to="/ai-dramas" className="hover:text-black transition-colors text-[12px] tracking-widest font-medium">AI短剧</Link>
          <Link to="/photography" className="hover:text-black transition-colors text-[12px] tracking-widest font-medium">摄影作品</Link>
        </div>
      </footer>
    </div>
  );
}
