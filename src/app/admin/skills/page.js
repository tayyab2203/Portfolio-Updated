'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Plus, Trash2, Save } from 'lucide-react';

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSkills() {
      try {
        const res = await fetch('/api/admin/skills');
        if (!res.ok) {
          throw new Error('Failed to load skills');
        }
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error(error);
        alert('Failed to load skills data');
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, []);

  const handleCategoryNameChange = (index, value) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === index ? { ...cat, category: value } : cat
      )
    );
  };

  const handleSkillChange = (catIndex, skillIndex, field, value) => {
    setCategories((prev) =>
      prev.map((cat, i) => {
        if (i !== catIndex) return cat;
        const skills = cat.skills || [];
        const updatedSkills = skills.map((skill, j) =>
          j === skillIndex ? { ...skill, [field]: value } : skill
        );
        return { ...cat, skills: updatedSkills };
      })
    );
  };

  const addSkill = (catIndex) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === catIndex
          ? {
              ...cat,
              skills: [
                ...(cat.skills || []),
                { name: 'New Skill', level: 80, years: 1, iconKey: cat.skills?.[0]?.iconKey || 'Code' },
              ],
            }
          : cat
      )
    );
  };

  const removeSkill = (catIndex, skillIndex) => {
    setCategories((prev) =>
      prev.map((cat, i) => {
        if (i !== catIndex) return cat;
        return {
          ...cat,
          skills: (cat.skills || []).filter((_, j) => j !== skillIndex),
        };
      })
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save skills');
      }

      alert('Skills updated successfully');
    } catch (error) {
      console.error(error);
      alert(error.message || 'Failed to save skills');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-khaki-beige-900 font-comfortaa mb-2">
            Skills
          </h1>
          <p className="text-dry-sage-600">
            Manage the skill categories and skills shown on the public site.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-camel text-ebony font-semibold hover:bg-toffee-brown transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="space-y-6">
        {categories.map((category, catIndex) => (
          <div
            key={category.key || catIndex}
            className="bg-ebony/60 backdrop-blur-sm p-6 rounded-xl border border-dusty-olive/30 space-y-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-toffee-brown/20 flex items-center justify-center">
                  <Code size={20} className="text-toffee-brown" />
                </div>
                <div>
                  <label className="block text-xs text-dry-sage-500 uppercase tracking-wide mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={category.category || ''}
                    onChange={(e) => handleCategoryNameChange(catIndex, e.target.value)}
                    className="px-3 py-2 rounded-lg bg-charcoal-brown/50 border border-dusty-olive/30 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => addSkill(catIndex)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-ebony/70 border border-dusty-olive/40 text-dry-sage-600 hover:text-khaki-beige hover:border-camel/60 hover:bg-ebony transition text-sm"
              >
                <Plus size={16} />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="grid gap-3">
              {(category.skills || []).map((skill, skillIndex) => (
                <div
                  key={`${skill.name}-${skillIndex}`}
                  className="grid grid-cols-1 md:grid-cols-[2fr_repeat(2,minmax(0,1fr))_auto] gap-3 items-center bg-charcoal-brown/40 border border-dusty-olive/30 rounded-lg px-3 py-2"
                >
                  <div>
                    <label className="block text-[11px] text-dry-sage-500 uppercase tracking-wide mb-1">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      value={skill.name || ''}
                      onChange={(e) => handleSkillChange(catIndex, skillIndex, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-ebony/60 border border-dusty-olive/40 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-dry-sage-500 uppercase tracking-wide mb-1">
                      Level (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={skill.level ?? ''}
                      onChange={(e) =>
                        handleSkillChange(catIndex, skillIndex, 'level', Number(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 rounded-md bg-ebony/60 border border-dusty-olive/40 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-dry-sage-500 uppercase tracking-wide mb-1">
                      Years
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={skill.years ?? ''}
                      onChange={(e) =>
                        handleSkillChange(catIndex, skillIndex, 'years', Number(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 rounded-md bg-ebony/60 border border-dusty-olive/40 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
                    />
                  </div>
                  <div className="flex justify-end items-end">
                    <button
                      type="button"
                      onClick={() => removeSkill(catIndex, skillIndex)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {(!category.skills || category.skills.length === 0) && (
                <p className="text-xs text-dry-sage-600 italic">
                  No skills in this category yet. Click &quot;Add Skill&quot; to create one.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

