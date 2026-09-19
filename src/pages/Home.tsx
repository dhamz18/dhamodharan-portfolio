import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Education from '../components/Education';
import Projects from '../components/Projects';
import Certifications from '../components/Certifications';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';

export default function Home() {
  return (
    <main className="relative">
      <ParticleBackground />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Education />
      <Projects />
      <Certifications />
      <Contact />
      <Footer />
    </main>
  );
}