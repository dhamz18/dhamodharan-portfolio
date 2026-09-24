import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Linkedin, Github, Lock } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';

const links = ['Home', 'About', 'Skills', 'Experience', 'Projects', 'Certifications', 'Contact'];

export default function Navbar() {
  const { content } = useSiteContent();
  const profile = content.profile!;
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

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-red-900/40 py-2 md:py-3' : 'py-3 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <a href="#home" className="font-royal text-xl md:text-2xl font-black gradient-text tracking-widest">
          DA
        </a>

        {/* Desktop Menu */}
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

        {/* Desktop Icons */}
        <div className="hidden lg:flex items-center gap-3">
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-white/70 hover:text-yellow-400 transition p-2"
            >
              <Linkedin size={18} />
            </a>
          )}
          {profile.github && profile.github !== '#' && (
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="text-white/70 hover:text-yellow-400 transition p-2"
            >
              <Github size={18} />
            </a>
          )}
          <a
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/50 text-yellow-400 text-sm hover:bg-yellow-500/10 transition"
          >
            <Lock size={14} /> Admin
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white p-2"
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-black/98 backdrop-blur-xl overflow-hidden fixed top-[60px] left-0 right-0 bottom-0"
          >
            <div className="flex flex-col p-6 gap-5">
              {links.map((l, i) => (
                <motion.a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-white/80 hover:text-red-500 text-xl font-medium transition border-b border-red-900/20 pb-3"
                >
                  {l}
                </motion.a>
              ))}

              <motion.a
                href="/admin"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: links.length * 0.05 }}
                className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-xl font-medium transition mt-2 pt-4"
              >
                <Lock size={20} /> Admin Panel
              </motion.a>

              <div className="flex gap-4 mt-4">
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 rounded-full border border-red-900/50 flex items-center justify-center text-red-500"
                  >
                    <Linkedin size={20} />
                  </a>
                )}
                {profile.github && profile.github !== '#' && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 rounded-full border border-yellow-900/50 flex items-center justify-center text-yellow-400"
                  >
                    <Github size={20} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}