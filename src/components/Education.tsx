import { motion } from 'framer-motion';
import { GraduationCap, Briefcase } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';

export default function Education() {
  const { content } = useSiteContent();
  const timeline = content.timeline!;

  return (
    <section id="experience" className="relative py-16 md:py-32 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12 md:mb-20"
      >
        <p className="text-red-500 tracking-[0.3em] text-xs md:text-sm mb-3 uppercase">
          Journey
        </p>
        <h2 className="font-royal text-2xl md:text-4xl lg:text-5xl text-white">
          Education & <span className="gradient-text">Experience</span>
        </h2>
      </motion.div>

      <div className="max-w-3xl mx-auto relative">
        {/* Vertical line */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          style={{ transformOrigin: 'top' }}
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-600 via-red-500 to-yellow-500"
        />

        {timeline.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.15 }}
            className={`relative mb-8 md:mb-12 md:w-1/2 ${
              i % 2 === 0 ? 'md:pr-12' : 'md:ml-auto md:pl-12'
            } pl-12 md:pl-0`}
          >
            <div
              className={`absolute top-3 ${
                i % 2 === 0 ? 'md:-right-[9px]' : 'md:-left-[9px]'
              } left-[9px] md:left-auto w-4 h-4 rounded-full bg-red-600 border-2 border-black`}
              style={{ boxShadow: '0 0 20px rgba(220,38,38,0.9)' }}
            />
            <div className="royal-card p-4 md:p-6">
              <div className="flex items-center gap-2 mb-2">
                {item.type === 'edu' ? (
                  <GraduationCap size={14} className="text-yellow-400" />
                ) : (
                  <Briefcase size={14} className="text-yellow-400" />
                )}
                <span className="text-yellow-400 text-[10px] md:text-xs tracking-widest uppercase">
                  {item.year}
                </span>
              </div>
              <h3 className="font-royal text-base md:text-xl text-white mb-1">
                {item.title}
              </h3>
              <p className="text-red-400 text-xs md:text-sm mb-2">{item.place}</p>
              <p className="text-white/50 text-xs md:text-sm">{item.meta}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}