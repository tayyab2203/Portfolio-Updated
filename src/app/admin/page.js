'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Code, Building2, TrendingUp, Eye, Plus } from 'lucide-react';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { skills } from '@/data/skills';
import { companyInfo } from '@/data/company';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    featuredProjects: 0,
    skills: 0,
    categories: 0,
  });

  useEffect(() => {
    const totalSkills = Object.values(skills).reduce((acc, cat) => acc + cat.skills.length, 0);
    setStats({
      projects: projects.length,
      featuredProjects: projects.filter(p => p.featured).length,
      skills: totalSkills,
      categories: Object.keys(skills).length,
    });
  }, []);

  const quickActions = [
    {
      title: 'Add New Project',
      description: 'Create a new project to showcase',
      href: '/admin/projects/new',
      icon: Plus,
      color: 'from-toffee-brown to-saddle-brown',
    },
    {
      title: 'Manage Projects',
      description: 'View and edit all projects',
      href: '/admin/projects',
      icon: FolderKanban,
      color: 'from-camel to-khaki-beige',
    },
    {
      title: 'Manage Skills',
      description: 'Update your skills and expertise',
      href: '/admin/skills',
      icon: Code,
      color: 'from-dry-sage to-dusty-olive',
    },
    {
      title: 'Company Info',
      description: 'Update company information',
      href: '/admin/company',
      icon: Building2,
      color: 'from-ebony to-charcoal-brown',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-khaki-beige-900 font-comfortaa mb-2">
          Dashboard
        </h1>
        <p className="text-dry-sage-600">
          Welcome to your portfolio admin panel. Manage your content from here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-ebony/60 backdrop-blur-sm p-6 rounded-xl border border-dusty-olive/30"
        >
          <div className="flex items-center justify-between mb-4">
            <FolderKanban className="text-toffee-brown" size={32} />
            <TrendingUp className="text-dry-sage-600" size={20} />
          </div>
          <h3 className="text-3xl font-bold text-khaki-beige-900 mb-1">{stats.projects}</h3>
          <p className="text-dry-sage-600 text-sm">Total Projects</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-ebony/60 backdrop-blur-sm p-6 rounded-xl border border-dusty-olive/30"
        >
          <div className="flex items-center justify-between mb-4">
            <Eye className="text-camel" size={32} />
            <TrendingUp className="text-dry-sage-600" size={20} />
          </div>
          <h3 className="text-3xl font-bold text-khaki-beige-900 mb-1">{stats.featuredProjects}</h3>
          <p className="text-dry-sage-600 text-sm">Featured Projects</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-ebony/60 backdrop-blur-sm p-6 rounded-xl border border-dusty-olive/30"
        >
          <div className="flex items-center justify-between mb-4">
            <Code className="text-dry-sage" size={32} />
            <TrendingUp className="text-dry-sage-600" size={20} />
          </div>
          <h3 className="text-3xl font-bold text-khaki-beige-900 mb-1">{stats.skills}</h3>
          <p className="text-dry-sage-600 text-sm">Total Skills</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-ebony/60 backdrop-blur-sm p-6 rounded-xl border border-dusty-olive/30"
        >
          <div className="flex items-center justify-between mb-4">
            <Building2 className="text-ebony-600" size={32} />
            <TrendingUp className="text-dry-sage-600" size={20} />
          </div>
          <h3 className="text-3xl font-bold text-khaki-beige-900 mb-1">{stats.categories}</h3>
          <p className="text-dry-sage-600 text-sm">Skill Categories</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-khaki-beige-900 mb-6 font-comfortaa">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Link
                  href={action.href}
                  className="block bg-ebony/60 backdrop-blur-sm p-6 rounded-xl border border-dusty-olive/30 hover:border-camel/50 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`bg-gradient-to-br ${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="text-khaki-beige-900" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-khaki-beige-900 mb-1 group-hover:text-camel transition">
                        {action.title}
                      </h3>
                      <p className="text-dry-sage-600 text-sm">{action.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Projects Preview */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-khaki-beige-900 font-comfortaa">Recent Projects</h2>
          <Link
            href="/admin/projects"
            className="text-camel hover:text-toffee-brown transition text-sm font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.slice(0, 3).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-ebony/60 backdrop-blur-sm p-6 rounded-xl border border-dusty-olive/30"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-khaki-beige-900">{project.title}</h3>
                {project.featured && (
                  <span className="px-2 py-1 bg-toffee-brown/20 text-toffee-brown text-xs rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-dry-sage-600 text-sm mb-4 line-clamp-2">{project.solution}</p>
              <Link
                href={`/admin/projects/${project.id}`}
                className="text-camel hover:text-toffee-brown transition text-sm font-medium"
              >
                Edit Project →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
