'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Edit, Plus, Trash2, Upload, X } from 'lucide-react';
import { fetchJson } from '@/lib/fetchJson';

export default function GalleryListPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  type CategoryOption = { value: string; label: string; slug: string };
  type GalleryItem = {
    id: number;
    category: string;
    title: string | null;
    originalName: string;
    mimeType: string;
    sortOrder: number;
    createdAt: string;
  };

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const [showForm, setShowForm] = useState(false);

  const [formCategory, setFormCategory] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formSortOrder, setFormSortOrder] = useState<string>('');
  const [formFile, setFormFile] = useState<File | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const fetchData = async () => {
    try {
      setActionError('');
      const data = await fetchJson<{ categories: CategoryOption[]; items: GalleryItem[] }>(
        '/api/gallery-items'
      );

      const catList = Array.isArray(data?.categories) ? data.categories : [];
      const itemList = Array.isArray(data?.items) ? data.items : [];

      setCategories(catList);
      setItems(itemList);

      setFormCategory((prev) => prev || catList[0]?.value || '');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const grouped = useMemo(() => {
    const m = new Map<string, GalleryItem[]>();
    for (const c of categories) m.set(c.value, []);
    for (const item of items) {
      if (!m.has(item.category)) m.set(item.category, []);
      m.get(item.category)!.push(item);
    }
    return m;
  }, [categories, items]);

  const selectedCategoryLabel = useMemo(() => {
    return categories.find((c) => c.value === formCategory)?.label || '';
  }, [categories, formCategory]);

  const resetForm = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormSortOrder('');
    setFormFile(null);
    fileInputRef.current && (fileInputRef.current.value = '');
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const isAllowedImageFile = (file: File) => {
    const name = file.name.toLowerCase();
    const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')) : '';
    const allowedExt = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
    const allowedByExt = allowedExt.has(ext);
    const allowedByMime = file.type ? file.type.startsWith('image/') : false;
    return allowedByExt && (allowedByMime || file.type === '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (!f) {
      setFormFile(null);
      return;
    }

    if (!isAllowedImageFile(f)) {
      setActionError('Only image files are allowed (.jpg, .jpeg, .png, .webp, .gif)');
      setFormFile(null);
      e.target.value = '';
      return;
    }

    setFormFile(f);
  };

  const fetchJsonForm = async <T,>(input: RequestInfo | URL, init: RequestInit): Promise<T> => {
    const res = await fetch(input, init);
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const message =
        isJson && body && (body.error || body.message)
          ? body.error || body.message
          : `Request failed with status ${res.status}`;
      throw new Error(message);
    }

    if (!isJson) {
      throw new Error('Expected JSON response');
    }

    return body as T;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategory) return;

    setBusy(true);
    setActionError('');
    setActionSuccess('');

    try {
      const fd = new FormData();
      fd.append('category', formCategory);
      fd.append('title', formTitle);
      if (formSortOrder.trim() !== '') fd.append('sortOrder', formSortOrder);
      if (formFile) {
        if (!isAllowedImageFile(formFile)) {
          throw new Error('Only image files are allowed (.jpg, .jpeg, .png, .webp, .gif)');
        }
        fd.append('file', formFile);
      }

      if (editingItem) {
        await fetchJsonForm(`/api/gallery-items/${editingItem.id}`, {
          method: 'PUT',
          body: fd,
        });
        setActionSuccess('Photo updated successfully');
      } else {
        if (!formFile) {
          throw new Error('Please select a photo');
        }
        await fetchJsonForm('/api/gallery-items', {
          method: 'POST',
          body: fd,
        });
        setActionSuccess('Photo added successfully');
      }

      closeForm();
      await fetchData();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to save photo');
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setShowForm(true);
    setEditingItem(item);
    setFormCategory(item.category);
    setFormTitle(item.title || '');
    setFormSortOrder(String(item.sortOrder));
    setFormFile(null);
    fileInputRef.current && (fileInputRef.current.value = '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      setBusy(true);
      setActionError('');
      setActionSuccess('');

      await fetchJson(`/api/gallery-items/${id}`, { method: 'DELETE' });
      await fetchData();
      setActionSuccess('Photo deleted successfully');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to delete photo');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
        <button
          type="button"
          onClick={() => {
            setActionError('');
            setActionSuccess('');
            resetForm();
            setShowForm(true);
          }}
          disabled={busy || loading}
          className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          Add Photo
        </button>
      </div>

      {actionError ? (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">{actionError}</div>
      ) : null}
      {actionSuccess ? (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-6">{actionSuccess}</div>
      ) : null}

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingItem ? 'Edit Photo' : 'Add Photo'}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              disabled={busy}
            >
              <X size={16} />
              Close
            </button>
          </div>

          {selectedCategoryLabel ? (
            <div className="text-sm text-gray-600 mb-4">Selected category: {selectedCategoryLabel}</div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={busy}
                required
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (optional)</label>
              <input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={busy}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order (optional)</label>
              <input
                value={formSortOrder}
                onChange={(e) => setFormSortOrder(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={busy}
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {editingItem ? 'Replace Photo (optional)' : 'Photo *'}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif"
                onChange={handleFileChange}
                className="hidden"
                disabled={busy}
                required={!editingItem}
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={busy}
                  className="inline-flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={18} />
                  Choose Picture
                </button>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-gray-700 truncate" title={formFile?.name || ''}>
                    {formFile ? formFile.name : 'No file chosen'}
                  </div>
                  <div className="text-xs text-gray-500">Allowed: JPG, PNG, WEBP, GIF</div>
                </div>
                {formFile ? (
                  <button
                    type="button"
                    onClick={() => {
                      setFormFile(null);
                      fileInputRef.current && (fileInputRef.current.value = '');
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                    title="Remove selected file"
                    disabled={busy}
                  >
                    <X size={18} />
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={busy || !formCategory}
              className="inline-flex items-center gap-2 bg-blue-950 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={18} />
              {editingItem ? 'Save Changes' : 'Upload Photo'}
            </button>
            {editingItem ? (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={busy}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      ) : null}

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => {
            const list = grouped.get(cat.value) || [];
            return (
              <div key={cat.value} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{cat.label}</h2>
                  <div className="text-sm text-gray-500">{list.length} photo(s)</div>
                </div>

                {list.length === 0 ? (
                  <div className="text-sm text-gray-500">No photos in this category yet.</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {list.map((p) => (
                      <div key={p.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="relative">
                          <img
                            src={`/api/gallery-photos/${p.id}`}
                            alt={p.originalName}
                            className="w-full h-40 object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(p)}
                              disabled={busy}
                              className="p-2 bg-white/90 text-blue-700 rounded-lg disabled:opacity-50"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(p.id)}
                              disabled={busy}
                              className="p-2 bg-white/90 text-red-600 rounded-lg disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="p-2">
                          <div className="text-sm font-medium text-gray-900 truncate" title={p.title || ''}>
                            {p.title || 'Untitled'}
                          </div>
                          <div className="text-xs text-gray-600 truncate" title={p.originalName}>
                            {p.originalName}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
