'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Trash2, Upload, Image as ImageIcon, X } from 'lucide-react';
import { fetchJson } from '@/lib/fetchJson';

type CategoryPhoto = {
  id: number;
  code: string;
  originalName: string;
  mimeType: string;
  sortOrder: number;
};

type Category = {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  photos: CategoryPhoto[];
};

export default function CategorizedGalleryAdminPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const selectedCategory = useMemo(() => {
    if (selectedCategoryId == null) return null;
    return categories.find((c) => c.id === selectedCategoryId) ?? null;
  }, [categories, selectedCategoryId]);

  const fetchCategories = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await fetchJson<Category[]>('/api/admin/categorized-gallery/categories');
      const list = Array.isArray(data) ? data : [];
      setCategories(list);

      if (list.length > 0) {
        setSelectedCategoryId((prev) => {
          if (prev != null && list.some((c) => c.id === prev)) return prev;
          return list[0].id;
        });
      } else {
        setSelectedCategoryId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    setBusy(true);
    setError('');

    try {
      const created = await fetchJson<Category>('/api/admin/categorized-gallery/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      await fetchCategories();
      if (created?.id) setSelectedCategoryId(created.id);
      setNewCategoryName('');
      setShowAddCategory(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setBusy(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const catId = selectedCategoryId;
    const files = e.target.files;

    if (!catId || !files || files.length === 0) return;

    setBusy(true);
    setError('');

    try {
      const formData = new FormData();
      for (const file of Array.from(files)) {
        formData.append('files', file);
      }

      await fetchJson(`/api/admin/categorized-gallery/categories/${catId}/photos`, {
        method: 'POST',
        body: formData,
      });

      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo(s)');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    const catId = selectedCategoryId;
    if (!catId) return;

    if (!confirm('Are you sure you want to delete this photo?')) return;

    setBusy(true);
    setError('');

    try {
      await fetchJson(`/api/admin/categorized-gallery/photos/${photoId}?categoryId=${catId}`, {
        method: 'DELETE',
      });

      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete photo');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddCategory((v) => !v)}
            className="flex items-center gap-2 border border-gray-300 bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus size={18} />
            Add Category
          </button>
          <button
            onClick={handleUploadClick}
            disabled={busy || selectedCategoryId == null}
            className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={18} />
            Add Photos
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUploadFiles}
            className="hidden"
            disabled={busy || selectedCategoryId == null}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">{error}</div>
      )}

      {showAddCategory && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">New Category</h2>
            <button
              onClick={() => setShowAddCategory(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={busy}
            />
            <button
              onClick={handleCreateCategory}
              disabled={busy || !newCategoryName.trim()}
              className="bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950 mx-auto"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No categories yet</p>
          <p className="text-gray-400 text-sm mt-2">Use “Add Category” to create your first one.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = c.id === selectedCategoryId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryId(c.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    active
                      ? 'bg-blue-950 text-white border-blue-950'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedCategory?.name ?? 'Category'}
              </h2>
              <div className="text-sm text-gray-500">
                {(selectedCategory?.photos?.length ?? 0).toString()} photo(s)
              </div>
            </div>

            {!selectedCategory || selectedCategory.photos.length === 0 ? (
              <div className="text-center py-10">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No photos in this category yet</p>
                <button
                  onClick={handleUploadClick}
                  disabled={busy}
                  className="inline-flex items-center gap-2 mt-4 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={18} />
                  Add Photos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedCategory.photos.map((p) => (
                  <div key={p.id} className="relative group">
                    <img
                      src={`/api/gallery-photos/${p.id}`}
                      alt={p.originalName}
                      className="w-full h-40 object-cover rounded-lg border border-gray-200"
                      loading="lazy"
                    />
                    <button
                      onClick={() => handleDeletePhoto(p.id)}
                      disabled={busy}
                      className="absolute top-2 right-2 p-2 bg-white/90 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="mt-2 text-xs text-gray-600 truncate" title={p.originalName}>
                      {p.originalName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
