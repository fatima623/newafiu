'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Users, Filter } from 'lucide-react';
import { fetchJson } from '@/lib/fetchJson';

const SPECIALIZATION_CATEGORIES = [
  { value: '', label: 'All Doctors' },
  { value: 'UROLOGIST', label: 'Urologist' },
  { value: 'NEPHROLOGIST', label: 'Nephrologist' },
  { value: 'ANAESTHETIC', label: 'Anaesthetic' },
  { value: 'RADIOLOGIST', label: 'Radiologist' },
];

interface Faculty {
  id: number;
  name: string;
  designation: string;
  qualifications: string;
  specializationCategory: string | null;
  image: string | null;
}

export default function FacultyListPage() {
  const [items, setItems] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await fetchJson('/api/faculty');
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;

    try {
      setActionError('');
      setActionSuccess('');

      await fetchJson(`/api/faculty/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((item) => item.id !== id));
      setActionSuccess('Faculty member deleted successfully');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to delete faculty member');
    }
  };

  // Filter items by selected category
  const filteredItems = selectedCategory
    ? items.filter(item => item.specializationCategory === selectedCategory)
    : items;

  // Get category label
  const getCategoryLabel = (category: string | null) => {
    if (!category) return '-';
    const found = SPECIALIZATION_CATEGORIES.find(c => c.value === category);
    return found ? found.label : category;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Faculty Members</h1>
        <div className="flex items-center gap-3">
          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {SPECIALIZATION_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <Link
            href="/admin/dashboard/faculty/new"
            className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus size={20} />
            Add Faculty
          </Link>
        </div>
      </div>

      {actionError ? (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">{actionError}</div>
      ) : null}
      {actionSuccess ? (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-6">{actionSuccess}</div>
      ) : null}

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950 mx-auto"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No faculty members yet</p>
          <Link
            href="/admin/dashboard/faculty/new"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            Add your first faculty member
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">Photo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">Designation</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[250px]">Qualifications</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={item.image || '/person.png'}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 text-sm">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm" title={item.designation}>
                      <div className="max-w-xs truncate">{item.designation}</div>
                    </td>
                    <td className="px-4 py-3">
                      {item.specializationCategory ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                          {getCategoryLabel(item.specializationCategory)}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm" title={item.qualifications}>
                      <div className="max-w-sm truncate">{item.qualifications}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/dashboard/faculty/${item.id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
