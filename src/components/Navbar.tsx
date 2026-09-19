import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Linkedin, Github, Download } from 'lucide-react';
import { profile } from '../data/content';

const links = ['Home', 'About', 'Skills', 'Experience', 'Projects', 'Certifications', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('Home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      links.forEach((id) => {
        const el = document.getElementById(id.toLowerCase());
        if (el && el.getBoundingClientRect().top < 200) setActive(id);
      });
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/70 backdrop-blur-xl border-b border-red-900/40 py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#home" className="font-royal text-2xl font-black gradient-text tracking-widest">
          DA
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className={`text-sm tracking-wide transition-all relative ${
                active === l ? 'text-red-500' : 'text-white/70 hover:text-white'
              }`}
            >
              {l}
              {active === l && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 to-yellow-500"
                />
              )}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <a href={profile.linkedin} target="_blank" rel="noreferrer"
             className="text-white/70 hover:text-yellow-400 transition">
            <Linkedin size={18} />
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer"
             className="text-white/70 hover:text-yellow-400 transition">
            <Github size={18} />
          </a>
          <a href={profile.resumeUrl} download
             className="flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/50 text-yellow-400 text-sm hover:bg-yellow-500/10 transition">
            <Download size={14} /> Resume
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden text-white" aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {links.map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="text-white/80 hover:text-red-500 text-lg font-medium transition"
                >
                  {l}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}