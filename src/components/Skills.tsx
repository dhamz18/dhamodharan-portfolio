import { motion } from 'framer-motion';
import { Code2, Database, Brain, Wrench } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Code2,
  Database,
  Brain,
  Wrench,
};

export default function Skills() {
  const { content } = useSiteContent();
  const skills = content.skills!;

  return (
    <section id="skills" className="relative py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <p className="text-red-500 tracking-[0.3em] text-sm mb-3 uppercase">
          My Arsenal
        </p>
        <h2 className="font-royal text-4xl md:text-5xl text-white">
          Skills & <span className="gradient-text">Expertise</span>
        </h2>
      </motion.div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skills.map((cat, i) => {
          const Icon = iconMap[cat.icon] || Code2;
          return (
            <motion.div
              key={cat.title + i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -10, boxShadow: '0 0 40px rgba(212,175,55,0.35)' }}
              className="royal-card p-6"
            >
              <Icon className="text-red-500 mb-4" size={32} />
              <h3 className="font-royal text-xl text-white mb-4">{cat.title}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 text-xs rounded-full bg-red-950/40 border border-red-800/40 text-red-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}