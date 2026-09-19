import { motion } from 'framer-motion';

export default function ParticleBackground() {
  const particles = Array.from({ length: 25 });

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-yellow-600/10 rounded-full blur-[120px] animate-pulse-slow" />

      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-red-500 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            y: [null, Math.random() * -300],
            opacity: [null, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}