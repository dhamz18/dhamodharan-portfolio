import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail, Linkedin, Github } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const item = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero() {
  const { content } = useSiteContent();
  const profile = content.profile!;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 pt-24"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl text-center"
      >
        <motion.p
          variants={item}
          className="text-yellow-400 tracking-[0.4em] text-sm mb-6 uppercase"
        >
          — Hi, I'm —
        </motion.p>

        <motion.h1
          variants={item}
          className="font-royal text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-4"
          style={{ textShadow: '0 0 60px rgba(220,38,38,0.5)' }}
        >
          {profile.name?.split(' ')[0] || 'DHAMODHARAN'}{' '}
          <span className="gradient-text">
            {profile.name?.split(' ').slice(1).join(' ') || 'A'}
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-xl md:text-2xl gradient-text font-semibold mb-6"
        >
          {profile.role}
        </motion.p>

        <motion.p
          variants={item}
          className="text-white/60 max-w-2xl mx-auto text-lg mb-12"
        >
          Building intelligent solutions with <span className="text-red-500">Data</span>,{' '}
          <span className="text-yellow-400">AI</span> & Technology.
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <a
            href="#projects"
            className="group flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-red-700 to-red-600 text-white font-medium hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all hover:scale-105"
          >
            View My Work
            <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
          </a>
          <a
            href={profile.resumeUrl || '/resume.pdf'}
            download
            className="flex items-center gap-2 px-7 py-3 rounded-full border border-yellow-500/60 text-yellow-400 hover:bg-yellow-500/10 transition-all"
          >
            <Download size={18} /> Download Resume
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 px-7 py-3 rounded-full border border-white/20 text-white/80 hover:border-white/50 transition"
          >
            <Mail size={18} /> Contact Me
          </a>
        </motion.div>

        <motion.div variants={item} className="flex justify-center gap-6">
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-full border border-red-900/50 flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white hover:scale-110 transition-all"
            >
              <Linkedin size={20} />
            </a>
          )}
          {profile.github && profile.github !== '#' && (
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-full border border-yellow-900/50 flex items-center justify-center text-yellow-400 hover:bg-yellow-500 hover:text-black hover:scale-110 transition-all"
            >
              <Github size={20} />
            </a>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest"
      >
        SCROLL ↓
      </motion.div>
    </section>
  );
}