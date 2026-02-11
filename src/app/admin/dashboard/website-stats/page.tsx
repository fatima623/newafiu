'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, GripVertical, BarChart3 } from 'lucide-react';
import { fetchJson } from '@/lib/fetchJson';

interface SiteStat {
  id?: number;
  key?: string;
  label: string;
  value: string;
  sortOrder?: number;
}

export default function WebsiteStatsPage() {
  const [stats, setStats] = useState<SiteStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await fetchJson<SiteStat[]>('/api/site-stats');
      setStats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStat = () => {
    setStats(prev => [...prev, { label: '', value: '' }]);
  };

  const handleRemoveStat = (index: number) => {
    setStats(prev => prev.filter((_, i) => i !== index));
  };

  const handleStatChange = (index: number, field: 'label' | 'value', newValue: string) => {
    setStats(prev => prev.map((stat, i) => i === index ? { ...stat, [field]: newValue } : stat));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setStats(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === stats.length - 1) return;
    setStats(prev => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    // Validate
    for (let i = 0; i < stats.length; i++) {
      if (!stats[i].label.trim()) {
        setError(`Stat #${i + 1}: Label is required`);
        return;
      }
      if (!stats[i].value.trim()) {
        setError(`Stat #${i + 1}: Value is required`);
        return;
      }
    }

    setSaving(true);

    try {
      const result = await fetchJson<SiteStat[]>('/api/site-stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats }),
      });
      setStats(Array.isArray(result) ? result : []);
      setSuccess('Statistics updated successfully! Changes will be reflected on the website.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save stats');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            Website Statistics
          </h1>
          <p className="text-gray-600 mt-2">
            Manage the statistics displayed on the homepage. These numbers animate from 0 to the target value when visitors scroll to them.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6 border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm mb-6 border border-green-200">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Homepage Counter Stats</h2>
          <p className="text-sm text-gray-500">
            Each stat will be shown on the homepage with an animated counter. Use values like &ldquo;37+&rdquo;, &ldquo;140,249+&rdquo;, etc.
            The number part will animate from 0 and the suffix (like +) will be appended.
          </p>
        </div>

        <div className="space-y-4">
          {stats.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No statistics added yet. Click &ldquo;Add Stat&rdquo; to get started.</p>
            </div>
          )}

          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 group"
            >
              {/* Reorder buttons */}
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                </button>
                <GripVertical size={16} className="text-gray-300 mx-auto" />
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === stats.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>
              </div>

              {/* Order number */}
              <div className="w-8 h-8 rounded-full bg-blue-950 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>

              {/* Label input */}
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Label</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                  placeholder="e.g., Years of Excellence"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Value input */}
              <div className="w-48">
                <label className="block text-xs text-gray-500 mb-1">Value</label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                  placeholder="e.g., 37+ or 140,249+"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleRemoveStat(index)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                title="Remove stat"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-6 pt-6 border-t">
          <button
            type="button"
            onClick={handleAddStat}
            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
          >
            <Plus size={18} />
            Add Stat
          </button>

          <div className="flex-1" />

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || stats.length === 0}
            className="flex items-center gap-2 bg-blue-950 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Preview Section */}
      {stats.length > 0 && (
        <div className="mt-8 bg-blue-950 rounded-xl p-8 text-white">
          <h3 className="text-center text-sm font-medium text-blue-300 mb-6 uppercase tracking-wider">
            Preview (as it appears on the homepage)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.value || '0'}</div>
                <div className="text-lg text-white">{stat.label || 'Label'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
