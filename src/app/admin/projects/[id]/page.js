'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, X, Upload, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    problem: '',
    solution: '',
    impact: '',
    techStack: [],
    images: [],
    liveLink: '',
    githubLink: '',
    featured: false,
    metrics: {
      users: '',
      revenue: '',
      growth: '',
      retention: '',
    },
  });
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        const project = data.project || {};
        
        // Ensure images and techStack are always arrays
        setFormData({
          ...project,
          images: Array.isArray(project.images) ? project.images : [],
          techStack: Array.isArray(project.techStack) ? project.techStack : [],
          metrics: project.metrics || {
            users: '',
            revenue: '',
            growth: '',
            retention: '',
          },
        });
      } else {
        alert('Failed to load project');
        router.push('/admin/projects');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      alert('Error loading project');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('metrics.')) {
      const metricKey = name.split('.')[1];
      setFormData({
        ...formData,
        metrics: {
          ...formData.metrics,
          [metricKey]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        // Ensure images is an array before spreading
        const currentImages = Array.isArray(formData.images) ? formData.images : [];
        setFormData({
          ...formData,
          images: [...currentImages, data.url],
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const currentImages = Array.isArray(formData.images) ? formData.images : [];
    setFormData({
      ...formData,
      images: currentImages.filter((_, i) => i !== index),
    });
  };

  const addTechStack = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const removeTechStack = (index) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/projects');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project');
    } finally {
      setSaving(false);
    }
  };

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-khaki-beige-900 font-comfortaa mb-2">
            Edit Project
          </h1>
          <p className="text-dry-sage-600">Update project details</p>
        </div>
        <Link
          href="/admin/projects"
          className="px-4 py-2 bg-ebony/50 hover:bg-ebony border border-dusty-olive/30 rounded-lg text-dry-sage-600 hover:text-khaki-beige transition"
        >
          <X size={20} />
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-ebony/60 backdrop-blur-sm p-6 rounded-xl border border-dusty-olive/30 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-khaki-beige-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-khaki-beige-900 mb-2 font-medium">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-charcoal-brown/50 border border-dusty-olive/30 rounded-lg text-khaki-beige-900 focus:outline-none focus:ring-2 focus:ring-camel/50 focus:border-camel transition"
                />
              </div>

              <div>
                <label className="block text-khaki-beige-900 mb-2 font-medium">Problem *</label>
                <textarea
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 bg-charcoal-brown/50 border border-dusty-olive/30 rounded-lg text-khaki-beige-900 focus:outline-none focus:ring-2 focus:ring-camel/50 focus:border-camel transition resize-none"
                />
              </div>

              <div>
                <label className="block text-khaki-beige-900 mb-2 font-medium">Solution *</label>
                <textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 bg-charcoal-brown/50 border border-dusty-olive/30 rounded-lg text-khaki-beige-900 focus:outline-none focus:ring-2 focus:ring-camel/50 focus:border-camel transition resize-none"
                />
              </div>

              <div>
                <label className="block text-khaki-beige-900 mb-2 font-medium">Impact</label>
                <textarea
                  name="impact"
                  value={formData.impact}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-charcoal-brown/50 border border-dusty-olive/30 rounded-lg text-khaki-beige-900 focus:outline-none focus:ring-2 focus:ring-camel/50 focus:border-camel transition resize-none"
                />
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-xl font-semibold text-khaki-beige-900 mb-4">Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-khaki-beige-900 mb-2 font-medium">Live Link</label>
                <input
                  type="url"
                  name="liveLink"
                  value={formData.liveLink}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-charcoal-brown/50 border border-dusty-olive/30 rounded-lg text-khaki-beige-900 focus:outline-none focus:ring-2 focus:ring-camel/50 focus:border-camel transition"
                />
              </div>
              <div>
                <label className="block text-khaki-beige-900 mb-2 font-medium">GitHub Link</label>
                <input
                  type="url"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-charcoal-brown/50 border border-dusty-olive/30 rounded-lg text-khaki-beige-900 focus:outline-none focus:ring-2 focus:ring-camel/50 focus:border-camel transition"
                />
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h2 className="text-xl font-semibold text-khaki-beige-900 mb-4">Tech Stack</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                placeholder="Add technology..."
                className="flex-1 px-4 py-2 bg-charcoal-brown/50 border border-dusty-olive/30 rounded-lg text-khaki-beige-900 focus:outline-none focus:ring-2 focus:ring-camel/50 focus:border-camel transition"
              />
              <button
                type="button"
                onClick={addTechStack}
                className="px-4 py-2 bg-camel hover:bg-khaki-beige text-charcoal-brown rounded-lg transition"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-toffee-brown/20 text-toffee-brown rounded-lg text-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechStack(index)}
                    className="hover:text-red-400 transition"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-xl font-semibold text-khaki-beige-900 mb-4">Project Images</h2>
            <div className="space-y-4">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-dusty-olive/30 rounded-lg p-8 text-center cursor-pointer hover:border-camel/50 transition">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-8 h-8 border-2 border-camel border-t-transparent rounded-full"
                      />
                      <span className="text-dry-sage-600">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="text-dry-sage-600" size={32} />
                      <span className="text-dry-sage-600">Click to upload image</span>
                    </div>
                  )}
                </div>
              </label>
              {Array.isArray(formData.images) && formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Project image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Metrics */}
          <div>
            <h2 className="text-xl font-semibold text-khaki-beige-900 mb-4">Metrics (Optional)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-khaki-beige-900 mb-2 font-medium text-sm">Users</label>
                <input
                  type="text"
                  name="metrics.users"
                  value={formData.metrics.users}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-charcoal-brown/50 border border-dusty-olive/30 rounded-lg text-khaki-beige-900 focus:outline-none focus:ring-2 focus:ring-camel/50 focus:border-camel transition"
                />
              </div>
              <div>
                <label className="block text-khaki-beige-900 mb-2 font-medium text-sm">Revenue</label>
                <input
                  type="text"
                  name="metrics.revenue"
                  value={formData.metrics.revenue}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-charcoal-brown/50 border border-dusty-olive/30 rounded-lg text-khaki-beige-900 focus:outline-none focus:ring-2 focus:ring-camel/50 focus:border-camel transition"
                />
              </div>
              <div>
                <label className="block text-khaki-beige-900 mb-2 font-medium text-sm">Growth</label>
                <input
                  type="text"
                  name="metrics.growth"
                  value={formData.metrics.growth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-charcoal-brown/50 border border-dusty-olive/30 rounded-lg text-khaki-beige-900 focus:outline-none focus:ring-2 focus:ring-camel/50 focus:border-camel transition"
                />
              </div>
              <div>
                <label className="block text-khaki-beige-900 mb-2 font-medium text-sm">Retention</label>
                <input
                  type="text"
                  name="metrics.retention"
                  value={formData.metrics.retention}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-charcoal-brown/50 border border-dusty-olive/30 rounded-lg text-khaki-beige-900 focus:outline-none focus:ring-2 focus:ring-camel/50 focus:border-camel transition"
                />
              </div>
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-5 h-5 rounded border-dusty-olive/30 text-toffee-brown focus:ring-camel"
            />
            <label className="text-khaki-beige-900 font-medium">Feature this project on homepage</label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-toffee-brown to-saddle-brown hover:from-saddle-brown hover:to-toffee-brown text-khaki-beige-900 px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-khaki-beige-900 border-t-transparent rounded-full"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
          <Link
            href="/admin/projects"
            className="px-6 py-3 bg-ebony/50 hover:bg-ebony border border-dusty-olive/30 rounded-lg text-dry-sage-600 hover:text-khaki-beige transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
