'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  X,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProjects();
        setDeleteConfirm(null);
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-camel border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-khaki-beige-900 font-comfortaa mb-2">
            Projects
          </h1>
          <p className="text-dry-sage-600">
            Manage your portfolio projects
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-toffee-brown to-saddle-brown hover:from-saddle-brown hover:to-toffee-brown text-khaki-beige-900 px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Plus size={20} />
          Add New Project
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dry-sage-600" size={20} />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-charcoal-brown/50 border border-dusty-olive/30 rounded-lg text-khaki-beige-900 focus:outline-none focus:ring-2 focus:ring-camel/50 focus:border-camel transition placeholder-dry-sage-600"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-ebony/60 backdrop-blur-sm rounded-xl border border-dusty-olive/30">
          <p className="text-dry-sage-600 mb-4">
            {searchTerm ? 'No projects found matching your search.' : 'No projects yet.'}
          </p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 text-camel hover:text-toffee-brown transition"
          >
            <Plus size={20} />
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-ebony/60 backdrop-blur-sm rounded-xl border border-dusty-olive/30 overflow-hidden hover:border-camel/50 transition-all duration-300"
            >
              {project.images && project.images.length > 0 && (
                <div className="h-48 bg-charcoal-brown/50 flex items-center justify-center overflow-hidden">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-khaki-beige-900 flex-1">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="px-2 py-1 bg-toffee-brown/20 text-toffee-brown text-xs rounded-full ml-2">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-dry-sage-600 text-sm mb-4 line-clamp-2">
                  {project.solution || project.description}
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-ebony/50 hover:bg-ebony border border-dusty-olive/30 rounded-lg text-dry-sage-600 hover:text-khaki-beige transition text-sm font-medium"
                  >
                    <Edit size={16} />
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(project.id)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition text-sm font-medium"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-ebony/95 backdrop-blur-sm p-6 rounded-xl border border-dusty-olive/30 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-khaki-beige-900 mb-2">
                Delete Project?
              </h3>
              <p className="text-dry-sage-600 mb-6">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-ebony/50 hover:bg-ebony border border-dusty-olive/30 rounded-lg text-dry-sage-600 hover:text-khaki-beige transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
