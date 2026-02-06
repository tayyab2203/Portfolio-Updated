'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/public/projects');
        if (!res.ok) return;
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Failed to load projects from API:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-black text-almond_cream">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {loading && (
          <div className="flex items-center justify-center min-h-[200px] mb-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-camel border-t-transparent rounded-full"
            />
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-almond_cream font-comfortaa">
            My Projects
          </h1>
          <p className="text-xl text-almond_cream/70 mb-4">
            Case studies showcasing problem-solving, innovation, and impact
          </p>
          <p className="text-almond_cream/60">
            Each project represents a unique challenge and solution, demonstrating my approach to
            building scalable, user-focused applications.
          </p>
        </motion.div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-khaki-beige font-comfortaa">
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-khaki-beige font-comfortaa">
              Other Projects
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 text-center bg-jet_black/50 p-8 md:p-12 rounded-lg border border-stone_brown/20"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-almond_cream font-comfortaa">
            Interested in Working Together?
          </h2>
          <p className="text-almond_cream/70 mb-6">
            Let's discuss how we can bring your next project to life.
          </p>
          <a
            href="/contact"
            className="inline-block bg-stone_brown hover:bg-stone_brown-300 text-almond_cream px-8 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Get In Touch
          </a>
        </motion.div>
      </div>
    </div>
  );
}
