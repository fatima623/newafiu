'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Heart, Eye, EyeOff } from 'lucide-react';
import { fetchJson } from '@/lib/fetchJson';

interface SuccessStory {
  id: number;
  title: string;
  patientName: string;
  story: string;
  imageUrl: string | null;
  date: string;
  sortOrder: number;
  isPublished: boolean;
}

export default function SuccessStoriesListPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      // Fetch all stories (including unpublished) for admin view
      const data = await fetchJson('/api/success-stories');
      setStories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this success story?')) return;

    try {
      setActionError('');
      setActionSuccess('');

      await fetchJson(`/api/success-stories/${id}`, { method: 'DELETE' });
      setStories((prev) => prev.filter((s) => s.id !== id));
      setActionSuccess('Success story deleted');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to delete story');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Success Stories</h1>
        <Link
          href="/admin/dashboard/success-stories/new"
          className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Plus size={20} />
          Add Story
        </Link>
      </div>

      {actionError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">{actionError}</div>
      )}
      {actionSuccess && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-6">{actionSuccess}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950 mx-auto"></div>
        </div>
      ) : stories.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No success stories yet</p>
          <Link
            href="/admin/dashboard/success-stories/new"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            Add your first success story
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stories.map((story) => (
                <tr key={story.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{story.title}</td>
                  <td className="px-6 py-4 text-gray-500">{story.patientName}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(story.date)}</td>
                  <td className="px-6 py-4">
                    {story.isPublished ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                        <Eye size={16} />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400 text-sm">
                        <EyeOff size={16} />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/dashboard/success-stories/${story.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(story.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
