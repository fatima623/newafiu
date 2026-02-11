'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Newspaper, Bell } from 'lucide-react';
import { fetchJson } from '@/lib/fetchJson';

interface NewsEvent {
  id: number;
  title: string;
  date: string;
  category: 'news' | 'event';
  showInBanner: boolean;
  bannerExpiresAt: string | null;
}

export default function NewsEventsListPage() {
  const [items, setItems] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await fetchJson('/api/news-events');
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      setActionError('');
      setActionSuccess('');

      await fetchJson(`/api/news-events/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((item) => item.id !== id));
      setActionSuccess('Item deleted successfully');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to delete item');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isBannerActive = (item: NewsEvent) => {
    if (!item.showInBanner) return false;
    if (!item.bannerExpiresAt) return true;
    return new Date(item.bannerExpiresAt) > new Date();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">News & Events</h1>
        <Link
          href="/admin/dashboard/news-events/new"
          className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Plus size={20} />
          Add News/Event
        </Link>
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
          <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No news or events yet</p>
          <Link
            href="/admin/dashboard/news-events/new"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            Create your first news/event
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Banner</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        item.category === 'news'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {item.category === 'news' ? 'News' : 'Event'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(item.date)}</td>
                  <td className="px-6 py-4">
                    {isBannerActive(item) ? (
                      <span className="inline-flex items-center gap-1 text-orange-600">
                        <Bell size={16} />
                        Active
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/dashboard/news-events/${item.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
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
