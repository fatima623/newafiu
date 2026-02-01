'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, BookOpen, Upload } from 'lucide-react';
import { fetchJson } from '@/lib/fetchJson';

interface PatientEducation {
  id: number;
  title: string;
  description: string | null;
  pdfUrl: string | null;
  createdAt: string;
}

const DEFAULT_CONSENT_FORMS = [
  {
    title: 'Informed consent for TURP',
    pdfUrl: encodeURI('/Informed consent for TURP.pdf'),
  },
  {
    title: 'Informed consent for SPC',
    pdfUrl: encodeURI('/Informed consent for SPC.pdf'),
  },
  {
    title: 'Informed consent for Cystolitholapaxy',
    pdfUrl: encodeURI('/Informed consent for Cystolitholapaxy.pdf'),
  },
  {
    title: 'Informed consent for TRUS Biopsy',
    pdfUrl: encodeURI('/Informed consent for TRUS Biopsy.pdf'),
  },
  {
    title: 'Informed consent for Radical Cystectomy and Ileal Conduit',
    pdfUrl: encodeURI('/Informed consent for Radical Cystectomy and Ileal Conduit.pdf'),
  },
  {
    title: 'Informed consent for Cystoscopy and Biopsy',
    pdfUrl: encodeURI('/Informed consent for Cystoscopy and Biopsy.pdf'),
  },
];

function titleFromFilename(filename: string) {
  const base = filename.replace(/\.[^/.]+$/, '');
  return base
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function PatientEducationListPage() {
  const [items, setItems] = useState<PatientEducation[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [addingDefaults, setAddingDefaults] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await fetchJson('/api/patient-education');
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setActionError('');
    setActionSuccess('');
    setBulkUploading(true);

    try {
      const createdItems: PatientEducation[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const upload = await fetchJson<{ url: string }>('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const title = titleFromFilename(file.name) || file.name;
        const created = await fetchJson<PatientEducation>('/api/patient-education', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description: '', pdfUrl: upload.url }),
        });
        createdItems.push(created);
      }

      if (createdItems.length > 0) {
        setItems((prev) => [...createdItems.reverse(), ...prev]);
        setActionSuccess(`Added ${createdItems.length} form(s) successfully`);
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to upload one or more files');
    } finally {
      setBulkUploading(false);
      e.target.value = '';
    }
  };

  const handleAddDefaultForms = async () => {
    setActionError('');
    setActionSuccess('');
    setAddingDefaults(true);

    try {
      const existing = new Set(items.map((x) => x.title.trim().toLowerCase()));
      const createdItems: PatientEducation[] = [];

      for (const item of DEFAULT_CONSENT_FORMS) {
        const title = item.title;
        const key = title.trim().toLowerCase();
        if (existing.has(key)) continue;

        const created = await fetchJson<PatientEducation>('/api/patient-education', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description: '', pdfUrl: item.pdfUrl }),
        });

        createdItems.push(created);
        existing.add(key);
      }

      if (createdItems.length > 0) {
        setItems((prev) => [...createdItems.reverse(), ...prev]);
        setActionSuccess(`Added ${createdItems.length} default form(s)`);
      } else {
        setActionSuccess('All default forms already exist');
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to add default forms');
    } finally {
      setAddingDefaults(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setActionError('');
    setActionSuccess('');

    try {
      await fetchJson(`/api/patient-education/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((item) => item.id !== id));
      setActionSuccess('Item deleted successfully');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to delete item');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Patient Education</h1>
        <div className="flex items-center gap-3">
         

          <div>
            <input
              id="patient-education-bulk-upload"
              type="file"
              accept=".pdf"
              multiple
              onChange={handleBulkUpload}
              className="hidden"
              disabled={bulkUploading || addingDefaults}
            />
          
          </div>

          <Link
            href="/admin/dashboard/patient-education/new"
            className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus size={20} />
            Add Item
          </Link>
        </div>
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
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No patient education items yet</p>
          <Link
            href="/admin/dashboard/patient-education/new"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            Create your first item
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
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PDF
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                    {item.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {item.pdfUrl ? (
                      <a
                        href={item.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View PDF
                      </a>
                    ) : (
                      <span className="text-gray-400">No PDF</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/dashboard/patient-education/${item.id}`}
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
