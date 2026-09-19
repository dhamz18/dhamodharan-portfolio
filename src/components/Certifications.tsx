import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';

type Cert = {
  title: string;
  issuer: string;
  year: string;
  image_url?: string;
};

export default function Certifications() {
  const { content } = useSiteContent();
  const certifications = content.certifications!;
  const [selected, setSelected] = useState<Cert | null>(null);

  return (
    <section id="certifications" className="relative py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <p className="text-red-500 tracking-[0.3em] text-sm mb-3 uppercase">
          Achievements
        </p>
        <h2 className="font-royal text-4xl md:text-5xl text-white">
          Certifications & <span className="gradient-text">Recognition</span>
        </h2>
      </motion.div>

      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((c, i) => (
          <motion.button
            key={c.title + i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            onClick={() => setSelected(c)}
            className="royal-card p-6 text-left"
          >
            {c.image_url ? (
              <img
                src={c.image_url}
                alt={c.title}
                className="w-full h-32 object-cover rounded-lg mb-4 border border-red-900/40"
                onError={(e) =>
                  ((e.target as HTMLImageElement).style.display = 'none')
                }
              />
            ) : (
              <Award className="text-yellow-400 mb-4" size={28} />
            )}
            <h3 className="font-royal text-lg text-white mb-2">{c.title}</h3>
            <p className="text-red-400 text-sm">{c.issuer}</p>
            <p className="text-white/40 text-xs mt-1">{c.year}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="royal-card max-w-2xl w-full p-8 relative"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition"
                aria-label="Close"
              >
                <X />
              </button>
              <Award className="text-yellow-400 mb-4" size={40} />
              <h3 className="font-royal text-2xl text-white mb-2">
                {selected.title}
              </h3>
              <p className="text-red-400">{selected.issuer}</p>
              <p className="text-white/50 text-sm mt-2">{selected.year}</p>

              <div className="mt-6">
                {selected.image_url ? (
                  <img
                    src={selected.image_url}
                    alt={selected.title}
                    className="w-full rounded-lg border border-red-900/40"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).style.display = 'none')
                    }
                  />
                ) : (
                  <div className="aspect-video bg-black/60 border border-red-900/40 rounded-lg flex items-center justify-center text-white/30 text-sm">
                    No certificate image uploaded
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}