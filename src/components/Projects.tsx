import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { Github, ExternalLink } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';

export default function Projects() {
  const { content } = useSiteContent();
  const projects = content.projects!;

  return (
    <section id="projects" className="relative py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <p className="text-red-500 tracking-[0.3em] text-sm mb-3 uppercase">
          Featured Work
        </p>
        <h2 className="font-royal text-4xl md:text-5xl text-white">
          Things I've <span className="gradient-text">Built</span>
        </h2>
      </motion.div>

      <div className="max-w-6xl mx-auto space-y-20">
        {projects.map((p, i) => (
          <motion.div
            key={p.title + i}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9 }}
            className={`grid lg:grid-cols-2 gap-10 items-center ${
              i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
            }`}
          >
            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5}>
              <div
                className="relative rounded-2xl overflow-hidden border border-red-900/50 group"
                style={{ boxShadow: '0 0 60px rgba(220,38,38,0.15)' }}
              >
                <img
                  src={p.image || '/projects/placeholder.jpg'}
                  alt={p.title}
                  className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x450/1a1a1a/dc2626?text=${encodeURIComponent(
                      p.title
                    )}`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
            </Tilt>

            <div>
              {p.date && (
                <p className="text-yellow-400 text-xs tracking-widest uppercase mb-3">
                  {p.date}
                </p>
              )}
              <h3 className="font-royal text-3xl text-white mb-4">{p.title}</h3>
              <p className="text-white/60 mb-6 leading-relaxed">{p.desc}</p>

              {p.tech && p.tech.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 text-xs rounded-full bg-red-950/40 border border-red-800/50 text-red-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {p.disclaimer && (
                <p className="text-white/30 text-xs italic mb-4">{p.disclaimer}</p>
              )}

              <div className="flex gap-4 flex-wrap">
                {p.live && p.live !== '#' && (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-700 hover:bg-red-600 text-white text-sm transition"
                  >
                    <ExternalLink size={16} /> View Project
                  </a>
                )}
                {p.github && p.github !== '#' && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 text-sm transition"
                  >
                    <Github size={16} /> GitHub
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}