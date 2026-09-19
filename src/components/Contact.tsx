import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { profile } from '../data/content';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="relative py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <p className="text-red-500 tracking-[0.3em] text-sm mb-3 uppercase">Get In Touch</p>
        <h2 className="font-royal text-4xl md:text-5xl text-white mb-4">
          Let's Build Something <span className="gradient-text">Meaningful</span>
        </h2>
        <p className="text-white/50 max-w-xl mx-auto">
          Interested in working together, discussing a project, or just connecting? Drop me a
          message.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {[
            { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
            { icon: Phone, label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
            { icon: MapPin, label: 'Location', value: profile.location, href: '#' },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="royal-card p-5 flex items-center gap-4 hover:border-yellow-500/50 transition"
            >
              <div className="w-12 h-12 rounded-full bg-red-950/50 flex items-center justify-center border border-red-800/50">
                <c.icon className="text-red-500" size={20} />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest">{c.label}</p>
                <p className="text-white">{c.value}</p>
              </div>
            </a>
          ))}
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="royal-card p-8 space-y-5"
        >
          <div>
            <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">
              Name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-3 text-white focus:border-yellow-500/60 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-3 text-white focus:border-yellow-500/60 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">
              Message
            </label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-black/60 border border-red-900/50 rounded-lg px-4 py-3 text-white focus:border-yellow-500/60 focus:outline-none transition resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-700 to-red-600 text-white font-medium hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition"
          >
            <Send size={16} /> {sent ? 'Message Sent!' : 'Send Message'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}