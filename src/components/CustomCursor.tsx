import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!t.closest('a, button, input, textarea'));
    };
    const leave = () => setVisible(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    window.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mouseleave', leave);
    };
  }, [visible]);

  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference hidden md:block"
      animate={{
        x: pos.x - (hovering ? 20 : 6),
        y: pos.y - (hovering ? 20 : 6),
        width: hovering ? 40 : 12,
        height: hovering ? 40 : 12,
        backgroundColor: hovering ? '#d4af37' : '#dc2626',
        opacity: visible ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    />
  );
}