'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload } from 'lucide-react';
import { fetchJson } from '@/lib/fetchJson';

const SPECIALIZATION_CATEGORIES = [
  { value: '', label: 'Select Specialization Category' },
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
  bio: string | null;
}

export default function EditFacultyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [specializationCategory, setSpecializationCategory] = useState('');
  const [image, setImage] = useState('');
  const [bio, setBio] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFaculty();
  }, [id]);

  const fetchFaculty = async () => {
    try {
      const data = await fetchJson<Faculty>(`/api/faculty/${id}`);
      setName(data.name);
      setDesignation(data.designation);
      setQualifications(data.qualifications);
      setSpecializationCategory(data.specializationCategory || '');
      setImage(data.image || '');
      setBio(data.bio || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const data = await fetchJson<{ url: string }>('/api/upload', {
        method: 'POST',
        body: formData,
      });
      setImage(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await fetchJson(`/api/faculty/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          designation,
          qualifications,
          specializationCategory: specializationCategory || null,
          image,
          bio,
        }),
      });
      router.push('/admin/dashboard/faculty');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/dashboard/faculty"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Faculty Member</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 w-full">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Dr. John Smith"
              required
            />
          </div>

          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
              Designation *
            </label>
            <input
              id="designation"
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Consultant Urologist & Transplant Surgeon"
              required
            />
          </div>

          <div>
            <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-2">
              Qualifications *
            </label>
            <input
              id="qualifications"
              type="text"
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., MBBS, FCPS (Surgery), FCPS (Urology)"
              required
            />
          </div>

          <div>
            <label htmlFor="specializationCategory" className="block text-sm font-medium text-gray-700 mb-2">
              Specialization Category *
            </label>
            <select
              id="specializationCategory"
              value={specializationCategory}
              onChange={(e) => setSpecializationCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {SPECIALIZATION_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Select the primary specialization category for this faculty member</p>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Biography
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief biography about the faculty member..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo
            </label>
            {image ? (
              <div className="relative inline-block">
                <img
                  src={image}
                  alt="Faculty"
                  className="w-32 h-32 object-cover rounded-full"
                />
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={uploading}
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload photo'}
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-950 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Update Faculty Member'}
            </button>
            <Link
              href="/admin/dashboard/faculty"
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
