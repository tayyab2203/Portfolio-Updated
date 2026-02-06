'use client';
import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Code, Users, Briefcase, Award, TrendingUp, ExternalLink, CheckCircle } from 'lucide-react';
import { Code as CodeIcon, Database, Smartphone, Cloud, Settings, Palette, GitBranch, Server } from 'lucide-react';

const iconMap = {
  Code: CodeIcon,
  Database,
  Smartphone,
  Cloud,
  Settings,
  Palette,
  GitBranch,
  Server,
};

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    async function loadData() {
      try {
        const [projectsRes, skillsRes] = await Promise.all([
          fetch('/api/public/projects'),
          fetch('/api/public/skills'),
        ]);

        if (projectsRes.ok) {
          const { projects } = await projectsRes.json();
          const all = projects || [];
          setAllProjects(all);
          const featured = all.filter((p) => p.featured);
          // If no featured projects, show all projects (up to 3)
          // Otherwise, show only featured (up to 3)
          setFeaturedProjects(featured.length > 0 ? featured.slice(0, 3) : all.slice(0, 3));
        }

        if (skillsRes.ok) {
          const { categories } = await skillsRes.json();
          const withIcons = (categories || []).flatMap((category) =>
            (category.skills || []).map((skill) => ({
              ...skill,
              icon: iconMap[skill.iconKey] || CodeIcon,
            }))
          );
          setTopSkills(withIcons.slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to load home data from API:', error);
      } finally {
        setLoadingProjects(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="bg-black">
      <Hero />
      
      {/* About Preview Section */}
      <section className="py-20 bg-linear-to-b from-black to-charcoal-brown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-khaki-beige-900 font-comfortaa">
              About Me
            </h2>
            <p className="text-dry-sage-700 text-lg max-w-3xl mx-auto">
              Passionate developer with a track record of delivering innovative solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Code, title: 'Full-Stack Expertise', desc: '5+ years building scalable applications' },
              { icon: Users, title: 'Client-Focused', desc: '100+ satisfied clients worldwide' },
              { icon: Award, title: 'Award Winner', desc: 'Recognized for innovation and excellence' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-ebony/50 p-6 rounded-xl border border-dusty-olive/30 hover:border-camel/50 transition-all duration-300"
              >
                <div className="bg-linear-to-br from-toffee-brown/20 to-camel/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="text-toffee-brown" size={32} />
                </div>
                <h3 className="text-xl font-bold text-khaki-beige-900 mb-2">{item.title}</h3>
                <p className="text-dry-sage-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-camel hover:text-khaki-beige font-semibold transition-colors duration-300 group"
            >
              Learn More About Me
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Skills Preview Section */}
      <section className="py-20 bg-linear-to-b from-charcoal-brown to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-khaki-beige-900 font-comfortaa">
              Core Skills
            </h2>
            <p className="text-dry-sage-700 text-lg max-w-3xl mx-auto">
              Technologies I work with to bring your vision to life
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {topSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="bg-ebony/50 p-4 rounded-xl border border-dusty-olive/30 hover:border-camel/50 transition-all duration-300 text-center group cursor-pointer"
              >
                {skill.icon && (
                  <skill.icon className="text-toffee-brown mx-auto mb-2 group-hover:scale-110 transition-transform" size={32} />
                )}
                <p className="text-khaki-beige-900 font-semibold text-sm">{skill.name}</p>
                <p className="text-dry-sage-600 text-xs mt-1">{skill.level}%</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 text-camel hover:text-khaki-beige font-semibold transition-colors duration-300 group"
            >
              View All Skills
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Projects Preview Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-khaki-beige-900 font-comfortaa">
              Featured Projects
            </h2>
            <p className="text-dry-sage-700 text-lg max-w-3xl mx-auto">
              Showcasing innovative solutions and real-world impact
            </p>
          </motion.div>

          {loadingProjects ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-camel border-t-transparent rounded-full"
              />
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-12 bg-ebony/30 rounded-xl border border-dusty-olive/20">
              <Briefcase className="text-dry-sage-600 mx-auto mb-4" size={48} />
              <p className="text-dry-sage-600 mb-2">No projects to display yet.</p>
              <p className="text-dry-sage-500 text-sm">Projects will appear here once they are added.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-ebony/50 rounded-xl border border-dusty-olive/30 hover:border-camel/50 transition-all duration-300 overflow-hidden group"
                >
                  {project.images && project.images.length > 0 && !imageErrors[project.id] ? (
                    <div className="h-48 bg-charcoal-brown/50 flex items-center justify-center overflow-hidden relative">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={() => {
                          setImageErrors((prev) => ({ ...prev, [project.id]: true }));
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-linear-to-br from-toffee-brown/20 to-camel/20 flex items-center justify-center">
                      <Briefcase className="text-toffee-brown" size={48} />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-khaki-beige-900">{project.title}</h3>
                      <ExternalLink className="text-dry-sage-600 group-hover:text-camel transition-colors" size={20} />
                    </div>
                    <p className="text-dry-sage-600 text-sm mb-4 line-clamp-2">{project.problem || project.solution || 'No description available'}</p>
                    {project.metrics && (
                      <div className="flex gap-4 mb-4">
                        {project.metrics.users && (
                          <div>
                            <p className="text-camel font-bold">{typeof project.metrics.users === 'number' ? project.metrics.users.toLocaleString() : project.metrics.users}</p>
                            <p className="text-dry-sage-600 text-xs">Users</p>
                          </div>
                        )}
                        {project.metrics.growth && (
                          <div>
                            <p className="text-camel font-bold">{project.metrics.growth}</p>
                            <p className="text-dry-sage-600 text-xs">Growth</p>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack?.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-charcoal-brown/50 text-dry-sage-600 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link
                      href="/projects"
                      className="text-camel hover:text-khaki-beige text-sm font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      View Project
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-linear-to-r from-toffee-brown to-saddle-brown hover:from-saddle-brown hover:to-toffee-brown text-khaki-beige-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              View All Projects
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Decision Helper Section */}
      <section className="py-20 bg-linear-to-b from-black to-charcoal-brown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-linear-to-br from-ebony/80 to-charcoal-brown/80 rounded-2xl border border-camel/30 p-8 md:p-12 overflow-hidden relative"
          >
              <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-toffee-brown/10 to-camel/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ebony/50 border border-camel/30 mb-4">
                    <Code className="text-camel" size={16} />
                    <span className="text-dry-sage-600 text-sm font-medium">AI Decision Assistant</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-khaki-beige-900 font-comfortaa">
                    Make Smart Project Decisions
                  </h2>
                  <p className="text-dry-sage-700 mb-6 text-lg">
                    Not sure whether to build or buy? MVP or full product? Web or mobile first? 
                    Get AI-powered recommendations to avoid costly mistakes and build the right solution.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {[
                      'Build vs Buy analysis',
                      'MVP vs Full Product guidance',
                      'Platform selection (Web/Mobile)',
                      'AI integration recommendations'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-dry-sage-700">
                        <CheckCircle className="text-camel" size={18} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/decision-helper"
                    className="inline-flex items-center gap-2 bg-linear-to-r from-toffee-brown to-saddle-brown hover:from-saddle-brown hover:to-toffee-brown text-khaki-beige-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Try Decision Helper
                    <ArrowRight size={20} />
                  </Link>
                </div>
                <div className="shrink-0">
                  <div className="w-64 h-64 bg-linear-to-br from-toffee-brown/20 to-camel/20 rounded-2xl flex items-center justify-center border border-camel/30">
                    <Code className="text-camel" size={80} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-charcoal-brown to-ebony">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-khaki-beige-900 font-comfortaa">
              Ready to Start Your Project?
            </h2>
            <p className="text-dry-sage-700 text-lg mb-8 max-w-2xl mx-auto">
              Let's collaborate to turn your ideas into exceptional digital experiences
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-linear-to-r from-toffee-brown to-saddle-brown hover:from-saddle-brown hover:to-toffee-brown text-khaki-beige-900 px-10 py-5 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
            >
              Get In Touch
              <ArrowRight size={24} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
