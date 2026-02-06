'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SkillBar from '@/components/SkillBar';
import { useInView } from '@/hooks/useInView';
import { Award, CheckCircle, Code, Database, Smartphone, Cloud, Settings, Palette, GitBranch, Server } from 'lucide-react';

const iconMap = {
  Code,
  Database,
  Smartphone,
  Cloud,
  Settings,
  Palette,
  GitBranch,
  Server,
};

export default function Skills() {
  const { ref: certRef, inView: certInView } = useInView({ threshold: 0.3 });
  const [skillCategories, setSkillCategories] = useState([]);

  useEffect(() => {
    async function loadSkills() {
      try {
        const res = await fetch('/api/public/skills');
        if (!res.ok) return;
        const data = await res.json();
        const categoriesWithIcons = (data.categories || []).map((category) => ({
          ...category,
          skills: (category.skills || []).map((skill) => ({
            ...skill,
            icon: iconMap[skill.iconKey] || Code,
          })),
        }));
        setSkillCategories(categoriesWithIcons);
      } catch (error) {
        console.error('Failed to load skills from API:', error);
      }
    }

    loadSkills();
  }, []);

  return (
    <div className="min-h-screen bg-black text-khaki-beige-900">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-khaki-beige-900 font-comfortaa">
            My Skills
          </h1>
          <p className="text-xl text-dry-sage-700 mb-12">
            Technologies and tools I work with
          </p>
        </motion.div>

        {/* Skill Bars by Category */}
        <div className="space-y-16 mb-20">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-camel font-comfortaa">
                {category.category}
              </h2>
              <div className="bg-ebony/50 p-6 md:p-8 rounded-lg border border-dusty-olive/30 hover:border-camel/50 transition-all duration-300">
                {category.skills.map((skill, index) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    years={skill.years}
                    icon={skill.icon}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-khaki-beige-900 font-comfortaa">
            Tech Stack Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {skillCategories.flatMap((category) =>
              category.skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  className="bg-ebony/50 p-4 rounded-lg border border-dusty-olive/30 text-center hover:border-camel/50 transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  {skill.icon && (
                    <skill.icon className="text-toffee-brown mx-auto mb-2" size={32} />
                  )}
                  <p className="text-khaki-beige-900 text-sm font-semibold">{skill.name}</p>
                  {skill.years && (
                    <p className="text-dry-sage-600 text-xs mt-1">{skill.years} years</p>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Certifications */}
        {/* <motion.div
          ref={certRef}
          initial={{ opacity: 0, y: 30 }}
          animate={certInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-khaki-beige-900 font-comfortaa flex items-center gap-3">
            <Award className="text-toffee-brown" size={32} />
            Certifications
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, x: -30 }}
                animate={certInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-ebony/50 p-6 rounded-lg border border-dusty-olive/30 hover:border-camel/50 transition-all duration-300 hover:scale-105"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-toffee-brown/20 p-3 rounded-lg">
                    <CheckCircle className="text-toffee-brown" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-khaki-beige-900 mb-1">
                      {cert.name}
                    </h3>
                    <p className="text-camel mb-2">{cert.issuer}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-dry-sage-600 text-sm">{cert.year}</span>
                      <span className="text-dry-sage-600/60 text-xs font-mono">
                        {cert.credential}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}

        {/* Years of Experience Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 bg-linear-to-r from-ebony/80 to-charcoal-brown/80 p-8 md:p-12 rounded-lg border border-dusty-olive/40 hover:border-camel/50 transition-all duration-300"
        >
          <h2 className="text-3xl font-bold mb-6 text-camel font-comfortaa">
            Experience Summary
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-toffee-brown mb-2">3+</div>
              <p className="text-dry-sage-700">Years in Web Development</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-toffee-brown mb-2">20+</div>
              <p className="text-dry-sage-700">Projects Completed</p>
            </div>
            {/* <div className="text-center">
              <div className="text-5xl font-bold text-toffee-brown mb-2">4</div>
              <p className="text-dry-sage-700">Certifications Earned</p>
            </div> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
