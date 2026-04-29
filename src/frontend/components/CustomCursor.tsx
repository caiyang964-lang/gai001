import { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Smooth springs for tracking mouse position
  const cursorX = useSpring(0, { stiffness: 800, damping: 40 });
  const cursorY = useSpring(0, { stiffness: 800, damping: 40 });

  useEffect(() => {
    // Detect touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const updateMousePosition = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      // Identify interactive elements
      const clickable = target.closest('a, button, input, textarea, select, [role="button"], label');
      setIsHovering(!!clickable);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updateMousePosition);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouchDevice) return null;

  return (
    <motion.div
       style={{
         x: cursorX,
         y: cursorY,
         translateX: '-50%',
         translateY: '-50%',
         opacity: isVisible ? 1 : 0
       }}
       animate={{
         width: isHovering ? 64 : 12,
         height: isHovering ? 64 : 12,
         backgroundColor: isHovering ? 'rgba(225, 29, 72, 0.03)' : 'var(--color-text)',
         border: isHovering ? '1px solid var(--color-accent)' : '0px solid transparent',
       }}
       transition={{ duration: 0.15, ease: 'easeOut' }}
       className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center backdrop-blur-[1px]"
    >
       <motion.div 
         animate={{ scale: isHovering ? 1 : 0, opacity: isHovering ? 1 : 0 }} 
         transition={{ duration: 0.2 }}
         className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" 
       />
    </motion.div>
  );
}
