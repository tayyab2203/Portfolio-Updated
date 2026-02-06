'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Save, Plus, Trash2 } from 'lucide-react';

export default function AdminCompanyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCompany() {
      try {
        const res = await fetch('/api/admin/company');
        if (!res.ok) {
          throw new Error('Failed to load company data');
        }
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error(error);
        alert('Failed to load company data');
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, []);

  const handleCompanyInfoChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      companyInfo: {
        ...(prev?.companyInfo || {}),
        [field]: value,
      },
    }));
  };

  const handleTeamDepartmentChange = (index, field, value) => {
    setData((prev) => {
      const departments = prev?.team?.departments || [];
      const updated = departments.map((dept, i) =>
        i === index ? { ...dept, [field]: value } : dept
      );
      return {
        ...prev,
        team: {
          ...(prev?.team || {}),
          departments: updated,
        },
      };
    });
  };

  const addDepartment = () => {
    setData((prev) => ({
      ...prev,
      team: {
        ...(prev?.team || {}),
        departments: [
          ...(prev?.team?.departments || []),
          { name: 'New Department', size: 1, description: '' },
        ],
      },
    }));
  };

  const removeDepartment = (index) => {
    setData((prev) => ({
      ...prev,
      team: {
        ...(prev?.team || {}),
        departments: (prev?.team?.departments || []).filter((_, i) => i !== index),
      },
    }));
  };

  const handleSimpleArrayChange = (key, index, field, value) => {
    setData((prev) => {
      const list = prev?.[key] || [];
      const updated = list.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return {
        ...prev,
        [key]: updated,
      };
    });
  };

  const addSimpleArrayItem = (key, template) => {
    setData((prev) => ({
      ...prev,
      [key]: [...(prev?.[key] || []), template],
    }));
  };

  const removeSimpleArrayItem = (key, index) => {
    setData((prev) => ({
      ...prev,
      [key]: (prev?.[key] || []).filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/company', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Failed to save company data');
      }

      alert('Company data updated successfully');
    } catch (error) {
      console.error(error);
      alert(error.message || 'Failed to save company data');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
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

  const { companyInfo, team, achievements, vision, mission, values, milestones } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-toffee-brown/20 flex items-center justify-center">
            <Building2 className="text-toffee-brown" size={26} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-khaki-beige-900 font-comfortaa mb-1">
              Company
            </h1>
            <p className="text-dry-sage-600">
              Edit the company details shown on the public &quot;Company&quot; page.
            </p>
          </div>
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

      {/* Company Info */}
      <section className="bg-ebony/60 backdrop-blur-sm p-6 rounded-xl border border-dusty-olive/30 space-y-4">
        <h2 className="text-2xl font-semibold text-khaki-beige-900 font-comfortaa flex items-center gap-2">
          <span>Company Info</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-dry-sage-500 uppercase tracking-wide mb-1">
              Name
            </label>
            <input
              type="text"
              value={companyInfo?.name || ''}
              onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-charcoal-brown/50 border border-dusty-olive/30 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
            />
          </div>
          <div>
            <label className="block text-xs text-dry-sage-500 uppercase tracking-wide mb-1">
              Industry
            </label>
            <input
              type="text"
              value={companyInfo?.industry || ''}
              onChange={(e) => handleCompanyInfoChange('industry', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-charcoal-brown/50 border border-dusty-olive/30 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
            />
          </div>
          <div>
            <label className="block text-xs text-dry-sage-500 uppercase tracking-wide mb-1">
              Founded
            </label>
            <input
              type="number"
              value={companyInfo?.founded ?? ''}
              onChange={(e) => handleCompanyInfoChange('founded', Number(e.target.value) || '')}
              className="w-full px-3 py-2 rounded-lg bg-charcoal-brown/50 border border-dusty-olive/30 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
            />
          </div>
          <div>
            <label className="block text-xs text-dry-sage-500 uppercase tracking-wide mb-1">
              Location
            </label>
            <input
              type="text"
              value={companyInfo?.location || ''}
              onChange={(e) => handleCompanyInfoChange('location', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-charcoal-brown/50 border border-dusty-olive/30 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
            />
          </div>
          <div>
            <label className="block text-xs text-dry-sage-500 uppercase tracking-wide mb-1">
              Website
            </label>
            <input
              type="url"
              value={companyInfo?.website || ''}
              onChange={(e) => handleCompanyInfoChange('website', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-charcoal-brown/50 border border-dusty-olive/30 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
            />
          </div>
          <div>
            <label className="block text-xs text-dry-sage-500 uppercase tracking-wide mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={companyInfo?.email || ''}
              onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-charcoal-brown/50 border border-dusty-olive/30 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-dry-sage-500 uppercase tracking-wide mb-1">
            Description
          </label>
          <textarea
            rows={4}
            value={companyInfo?.description || ''}
            onChange={(e) => handleCompanyInfoChange('description', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-charcoal-brown/50 border border-dusty-olive/30 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition resize-none"
          />
        </div>
      </section>

      {/* Team */}
      <section className="bg-ebony/60 backdrop-blur-sm p-6 rounded-xl border border-dusty-olive/30 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-khaki-beige-900 font-comfortaa">
              Team
            </h2>
            <p className="text-xs text-dry-sage-600">
              Configure team size and departments used on the public page.
            </p>
          </div>
          <button
            type="button"
            onClick={addDepartment}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-ebony/70 border border-dusty-olive/40 text-dry-sage-600 hover:text-khaki-beige hover:border-camel/60 hover:bg-ebony transition text-sm"
          >
            <Plus size={16} />
            <span>Add Department</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-dry-sage-500 uppercase tracking-wide mb-1">
              Total Team Members
            </label>
            <input
              type="number"
              min="0"
              value={team?.total ?? ''}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  team: {
                    ...(prev?.team || {}),
                    total: Number(e.target.value) || 0,
                  },
                }))
              }
              className="w-full px-3 py-2 rounded-lg bg-charcoal-brown/50 border border-dusty-olive/30 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
            />
          </div>
        </div>

        <div className="grid gap-3 mt-4">
          {(team?.departments || []).map((dept, index) => (
            <div
              key={dept.name || index}
              className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))_auto] gap-3 items-start bg-charcoal-brown/40 border border-dusty-olive/30 rounded-lg px-3 py-3"
            >
              <div>
                <label className="block text-[11px] text-dry-sage-500 uppercase tracking-wide mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={dept.name || ''}
                  onChange={(e) => handleTeamDepartmentChange(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-ebony/60 border border-dusty-olive/40 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
                />
              </div>
              <div>
                <label className="block text-[11px] text-dry-sage-500 uppercase tracking-wide mb-1">
                  Size
                </label>
                <input
                  type="number"
                  min="0"
                  value={dept.size ?? ''}
                  onChange={(e) => handleTeamDepartmentChange(index, 'size', Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-md bg-ebony/60 border border-dusty-olive/40 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
                />
              </div>
              <div>
                <label className="block text-[11px] text-dry-sage-500 uppercase tracking-wide mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={dept.description || ''}
                  onChange={(e) => handleTeamDepartmentChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-ebony/60 border border-dusty-olive/40 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
                />
              </div>
              <div className="flex justify-end items-end">
                <button
                  type="button"
                  onClick={() => removeDepartment(index)}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-ebony/60 backdrop-blur-sm p-6 rounded-xl border border-dusty-olive/30 space-y-3">
          <h2 className="text-xl font-semibold text-khaki-beige-900 font-comfortaa">
            Vision
          </h2>
          <input
            type="text"
            value={vision?.title || 'Our Vision'}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                vision: { ...(prev?.vision || {}), title: e.target.value },
              }))
            }
            className="w-full mb-2 px-3 py-2 rounded-lg bg-charcoal-brown/50 border border-dusty-olive/30 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
          />
          <textarea
            rows={4}
            value={vision?.content || ''}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                vision: { ...(prev?.vision || {}), content: e.target.value },
              }))
            }
            className="w-full px-3 py-2 rounded-lg bg-charcoal-brown/50 border border-dusty-olive/30 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition resize-none"
          />
        </div>
        <div className="bg-ebony/60 backdrop-blur-sm p-6 rounded-xl border border-dusty-olive/30 space-y-3">
          <h2 className="text-xl font-semibold text-khaki-beige-900 font-comfortaa">
            Mission
          </h2>
          <input
            type="text"
            value={mission?.title || 'Our Mission'}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                mission: { ...(prev?.mission || {}), title: e.target.value },
              }))
            }
            className="w-full mb-2 px-3 py-2 rounded-lg bg-charcoal-brown/50 border border-dusty-olive/30 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
          />
          <textarea
            rows={4}
            value={mission?.content || ''}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                mission: { ...(prev?.mission || {}), content: e.target.value },
              }))
            }
            className="w-full px-3 py-2 rounded-lg bg-charcoal-brown/50 border border-dusty-olive/30 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition resize-none"
          />
        </div>
      </section>

      {/* Values */}
      <section className="bg-ebony/60 backdrop-blur-sm p-6 rounded-xl border border-dusty-olive/30 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-khaki-beige-900 font-comfortaa">
            Values
          </h2>
          <button
            type="button"
            onClick={() =>
              addSimpleArrayItem('values', {
                title: 'New Value',
                description: '',
              })
            }
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-ebony/70 border border-dusty-olive/40 text-dry-sage-600 hover:text-khaki-beige hover:border-camel/60 hover:bg-ebony transition text-sm"
          >
            <Plus size={16} />
            <span>Add Value</span>
          </button>
        </div>

        <div className="grid gap-3">
          {(values || []).map((value, index) => (
            <div
              key={value.title || index}
              className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)_auto] gap-3 items-start bg-charcoal-brown/40 border border-dusty-olive/30 rounded-lg px-3 py-3"
            >
              <div>
                <label className="block text-[11px] text-dry-sage-500 uppercase tracking-wide mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={value.title || ''}
                  onChange={(e) => handleSimpleArrayChange('values', index, 'title', e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-ebony/60 border border-dusty-olive/40 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
                />
              </div>
              <div>
                <label className="block text-[11px] text-dry-sage-500 uppercase tracking-wide mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={value.description || ''}
                  onChange={(e) => handleSimpleArrayChange('values', index, 'description', e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-ebony/60 border border-dusty-olive/40 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
                />
              </div>
              <div className="flex justify-end items-end">
                <button
                  type="button"
                  onClick={() => removeSimpleArrayItem('values', index)}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones (lightweight editor) */}
      <section className="bg-ebony/60 backdrop-blur-sm p-6 rounded-xl border border-dusty-olive/30 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-khaki-beige-900 font-comfortaa">
            Milestones
          </h2>
          <button
            type="button"
            onClick={() =>
              addSimpleArrayItem('milestones', {
                date: '',
                title: 'New Milestone',
                description: '',
              })
            }
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-ebony/70 border border-dusty-olive/40 text-dry-sage-600 hover:text-khaki-beige hover:border-camel/60 hover:bg-ebony transition text-sm"
          >
            <Plus size={16} />
            <span>Add Milestone</span>
          </button>
        </div>

        <div className="grid gap-3">
          {(milestones || []).map((milestone, index) => (
            <div
              key={milestone.title || index}
              className="grid grid-cols-1 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,2fr)_auto] gap-3 items-start bg-charcoal-brown/40 border border-dusty-olive/30 rounded-lg px-3 py-3"
            >
              <div>
                <label className="block text-[11px] text-dry-sage-500 uppercase tracking-wide mb-1">
                  Date
                </label>
                <input
                  type="text"
                  value={milestone.date || ''}
                  onChange={(e) => handleSimpleArrayChange('milestones', index, 'date', e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-ebony/60 border border-dusty-olive/40 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
                />
              </div>
              <div>
                <label className="block text-[11px] text-dry-sage-500 uppercase tracking-wide mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={milestone.title || ''}
                  onChange={(e) => handleSimpleArrayChange('milestones', index, 'title', e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-ebony/60 border border-dusty-olive/40 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
                />
              </div>
              <div>
                <label className="block text-[11px] text-dry-sage-500 uppercase tracking-wide mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={milestone.description || ''}
                  onChange={(e) => handleSimpleArrayChange('milestones', index, 'description', e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-ebony/60 border border-dusty-olive/40 text-khaki-beige-900 text-sm focus:outline-none focus:ring-2 focus:ring-camel/40 focus:border-camel transition"
                />
              </div>
              <div className="flex justify-end items-end">
                <button
                  type="button"
                  onClick={() => removeSimpleArrayItem('milestones', index)}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

