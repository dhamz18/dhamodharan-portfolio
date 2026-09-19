import { Linkedin, Github, Mail } from 'lucide-react';
import { profile } from '../data/content';

export default function Footer() {
  return (
    <footer className="relative border-t border-red-900/40 py-12 px-6 mt-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-royal text-2xl gradient-text font-black mb-2">DHAMODHARAN A</h3>
          <p className="text-white/50 text-sm">AI & Data Science Student</p>
        </div>
        <div>
          <p className="text-yellow-400 text-xs uppercase tracking-widest mb-4">Quick Links</p>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>
              <a href="#about" className="hover:text-red-500 transition">
                About
              </a>
            </li>
            <li>
              <a href="#projects" className="hover:text-red-500 transition">
                Projects
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-red-500 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-yellow-400 text-xs uppercase tracking-widest mb-4">Connect</p>
          <div className="flex gap-4">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-red-500 transition"
            >
              <Linkedin size={20} />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-red-500 transition"
            >
              <Github size={20} />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="text-white/60 hover:text-red-500 transition"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-red-900/30 text-center text-white/40 text-xs">
        © 2026 Dhamodharan A. All rights reserved.
      </div>
    </footer>
  );
}