import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { GraduationCap, BarChart3, Code2, MapPin } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';

export default function About() {
  const { content } = useSiteContent();
  const profile = content.profile!;

  const cards = [
    { icon: GraduationCap, label: 'Education', value: 'B.Tech AI & DS' },
    { icon: BarChart3, label: 'Focus', value: 'Data Analytics & AI' },
    { icon: Code2, label: 'Programming', value: 'Python • Java • SQL' },
    { icon: MapPin, label: 'Location', value: profile.location || 'Erode, India' },
  ];

  return (
    <section id="about" className="relative py-16 md:py-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="max-w-sm md:max-w-none mx-auto w-full"
        >
          <Tilt
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            glareEnable
            glareColor="#dc2626"
            glareMaxOpacity={0.2}
          >
            <div
              className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-red-900/50"
              style={{ boxShadow: '0 0 60px rgba(220,38,38,0.25)' }}
            >
              <img
                src={profile.profileImage || '/profile.jpg'}
                alt={profile.name}
                className="w-full aspect-[4/5] object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/600x750/1a1a1a/dc2626?text=Profile+Photo';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>
          </Tilt>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center lg:text-left"
        >
          <p className="text-red-500 tracking-[0.3em] text-xs md:text-sm mb-3 uppercase">
            About Me
          </p>
          <h2 className="font-royal text-2xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-6">
            Turning Data Into <span className="gradient-text">Intelligence</span>
          </h2>
          <p className="text-white/60 leading-relaxed mb-6 md:mb-8 text-sm md:text-lg">
            {profile.bio}
          </p>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {cards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="royal-card p-3 md:p-5 text-left"
              >
                <c.icon className="text-yellow-400 mb-2" size={20} />
                <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest">
                  {c.label}
                </p>
                <p className="text-white text-xs md:text-sm font-medium mt-1">
                  {c.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}