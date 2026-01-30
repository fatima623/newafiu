'use client';

import { useEffect, useRef, useState } from 'react';
import { Trash2, FileText, Plus, Pencil, X, Save } from 'lucide-react';
import { fetchJson } from '@/lib/fetchJson';

interface CareersForm {
  id: number;
  code: string;
  title: string;
  fileUrl: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
  sortOrder: number;
}

interface CareersJob {
  id: number;
  code: string;
  title: string;
  department: string;
  type: string;
  location: string | null;
  description: string | null;
  applyBy: string | null;
  isPublished: boolean;
  createdAt: string;
}

export default function CareersAdminPage() {
  const [items, setItems] = useState<CareersForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formsError, setFormsError] = useState('');
  const [formsSuccess, setFormsSuccess] = useState('');

  const [showAddJobForm, setShowAddJobForm] = useState(false);
  const addJobFormRef = useRef<HTMLDivElement | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const addFormRef = useRef<HTMLDivElement | null>(null);

  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSortOrder, setNewSortOrder] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editSortOrder, setEditSortOrder] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);

  const [jobs, setJobs] = useState<CareersJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsSaving, setJobsSaving] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [jobsSuccess, setJobsSuccess] = useState('');

  const [newJobCode, setNewJobCode] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDepartment, setNewJobDepartment] = useState('');
  const [newJobType, setNewJobType] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('');
  const [newJobApplyBy, setNewJobApplyBy] = useState('');
  const [newJobIsPublished, setNewJobIsPublished] = useState(true);
  const [newJobDescription, setNewJobDescription] = useState('');

  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editJobCode, setEditJobCode] = useState('');
  const [editJobTitle, setEditJobTitle] = useState('');
  const [editJobDepartment, setEditJobDepartment] = useState('');
  const [editJobType, setEditJobType] = useState('');
  const [editJobLocation, setEditJobLocation] = useState('');
  const [editJobApplyBy, setEditJobApplyBy] = useState('');
  const [editJobIsPublished, setEditJobIsPublished] = useState(true);
  const [editJobDescription, setEditJobDescription] = useState('');

  useEffect(() => {
    fetchItems();
    fetchJobs();
  }, []);

  useEffect(() => {
    if (showAddJobForm) {
      addJobFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showAddJobForm]);

  useEffect(() => {
    if (showAddForm) {
      addFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showAddForm]);

  const fetchItems = async () => {
    try {
      const data = await fetchJson('/api/careers-forms');
      setItems(Array.isArray(data) ? (data as CareersForm[]) : []);
    } catch (err) {
      console.error('Error fetching careers forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const data = await fetchJson('/api/careers-jobs?all=1');
      setJobs(Array.isArray(data) ? (data as CareersJob[]) : []);
    } catch (err) {
      console.error('Error fetching careers jobs:', err);
    } finally {
      setJobsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormsError('');
    setFormsSuccess('');

    if (!newCode.trim() || !newTitle.trim()) {
      setFormsError('Code and title are required');
      return;
    }

    if (!newFile) {
      setFormsError('Please select a file to upload');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('code', newCode.trim());
      formData.append('title', newTitle.trim());
      if (newSortOrder.trim()) {
        formData.append('sortOrder', newSortOrder.trim());
      }
      formData.append('file', newFile);

      const created = await fetchJson<CareersForm>('/api/careers-forms', {
        method: 'POST',
        body: formData,
      });

      setItems((prev) => [created, ...prev]);
      setNewCode('');
      setNewTitle('');
      setNewSortOrder('');
      setNewFile(null);
      setFormsSuccess('Form created successfully');

      const input = document.getElementById('careers-new-file') as HTMLInputElement | null;
      if (input) input.value = '';
    } catch (err) {
      setFormsError(err instanceof Error ? err.message : 'Failed to create form');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item: CareersForm) => {
    setEditingId(item.id);
    setEditCode(item.code);
    setEditTitle(item.title);
    setEditSortOrder(String(item.sortOrder ?? 0));
    setEditFile(null);
    setFormsError('');
    setFormsSuccess('');
    const input = document.getElementById('careers-edit-file') as HTMLInputElement | null;
    if (input) input.value = '';
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditCode('');
    setEditTitle('');
    setEditSortOrder('');
    setEditFile(null);
    setFormsError('');
    const input = document.getElementById('careers-edit-file') as HTMLInputElement | null;
    if (input) input.value = '';
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormsError('');
    setFormsSuccess('');

    if (!editingId) return;

    if (!editCode.trim() || !editTitle.trim()) {
      setFormsError('Code and title are required');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('code', editCode.trim());
      formData.append('title', editTitle.trim());
      if (editSortOrder.trim()) {
        formData.append('sortOrder', editSortOrder.trim());
      }
      if (editFile) {
        formData.append('file', editFile);
      }

      const updated = await fetchJson<CareersForm>(`/api/careers-forms/${editingId}`, {
        method: 'PUT',
        body: formData,
      });

      setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setFormsSuccess('Form updated successfully');
      setEditingId(null);
      setEditCode('');
      setEditTitle('');
      setEditSortOrder('');
      setEditFile(null);
      const input = document.getElementById('careers-edit-file') as HTMLInputElement | null;
      if (input) input.value = '';
    } catch (err) {
      setFormsError(err instanceof Error ? err.message : 'Failed to update form');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setJobsError('');
    setJobsSuccess('');

    if (!newJobCode.trim() || !newJobTitle.trim() || !newJobDepartment.trim() || !newJobType.trim()) {
      setJobsError('Code, title, department, and type are required');
      return;
    }

    setJobsSaving(true);
    try {
      const created = await fetchJson<CareersJob>('/api/careers-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newJobCode.trim(),
          title: newJobTitle.trim(),
          department: newJobDepartment.trim(),
          type: newJobType.trim(),
          location: newJobLocation.trim() || null,
          applyBy: newJobApplyBy.trim() || null,
          isPublished: newJobIsPublished,
          description: newJobDescription.trim() || null,
        }),
      });

      setJobs((prev) => [created, ...prev]);
      setNewJobCode('');
      setNewJobTitle('');
      setNewJobDepartment('');
      setNewJobType('');
      setNewJobLocation('');
      setNewJobApplyBy('');
      setNewJobIsPublished(true);
      setNewJobDescription('');
      setJobsSuccess('Job created successfully');
    } catch (err) {
      setJobsError(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      setJobsSaving(false);
    }
  };

  const startEditJob = (job: CareersJob) => {
    setEditingJobId(job.id);
    setEditJobCode(job.code);
    setEditJobTitle(job.title);
    setEditJobDepartment(job.department);
    setEditJobType(job.type);
    setEditJobLocation(job.location || '');
    setEditJobApplyBy(job.applyBy ? new Date(job.applyBy).toISOString().slice(0, 10) : '');
    setEditJobIsPublished(Boolean(job.isPublished));
    setEditJobDescription(job.description || '');
    setJobsError('');
    setJobsSuccess('');
  };

  const cancelEditJob = () => {
    setEditingJobId(null);
    setEditJobCode('');
    setEditJobTitle('');
    setEditJobDepartment('');
    setEditJobType('');
    setEditJobLocation('');
    setEditJobApplyBy('');
    setEditJobIsPublished(true);
    setEditJobDescription('');
    setJobsError('');
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setJobsError('');
    setJobsSuccess('');

    if (!editingJobId) return;

    if (!editJobCode.trim() || !editJobTitle.trim() || !editJobDepartment.trim() || !editJobType.trim()) {
      setJobsError('Code, title, department, and type are required');
      return;
    }

    setJobsSaving(true);
    try {
      const updated = await fetchJson<CareersJob>(`/api/careers-jobs/${editingJobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: editJobCode.trim(),
          title: editJobTitle.trim(),
          department: editJobDepartment.trim(),
          type: editJobType.trim(),
          location: editJobLocation.trim() || null,
          applyBy: editJobApplyBy.trim() || null,
          isPublished: editJobIsPublished,
          description: editJobDescription.trim() || null,
        }),
      });

      setJobs((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setJobsSuccess('Job updated successfully');
      setEditingJobId(null);
      setEditJobCode('');
      setEditJobTitle('');
      setEditJobDepartment('');
      setEditJobType('');
      setEditJobLocation('');
      setEditJobApplyBy('');
      setEditJobIsPublished(true);
      setEditJobDescription('');
    } catch (err) {
      setJobsError(err instanceof Error ? err.message : 'Failed to update job');
    } finally {
      setJobsSaving(false);
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const res = await fetch(`/api/careers-jobs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setJobs((prev) => prev.filter((x) => x.id !== id));
      }
    } catch (err) {
      console.error('Error deleting careers job:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this form?')) return;

    try {
      const res = await fetch(`/api/careers-forms/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((x) => x.id !== id));
      }
    } catch (err) {
      console.error('Error deleting careers form:', err);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Careers</h1>
        <button
          type="button"
          onClick={() => setShowAddJobForm(true)}
          className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Plus size={20} />
          Add More
        </button>
      </div>

      {jobsLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950 mx-auto"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No career listings yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{job.code}</td>
                  <td className="px-6 py-4 text-gray-900">{job.title}</td>
                  <td className="px-6 py-4 text-gray-700">{job.department}</td>
                  <td className="px-6 py-4 text-gray-700">{job.type}</td>
                  <td className="px-6 py-4 text-gray-700">{job.isPublished ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEditJob(job)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
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

      {showAddJobForm ? (
        <div ref={addJobFormRef} className="bg-white rounded-lg shadow p-6 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Add Career Opportunity</h2>
            <button
              type="button"
              onClick={() => setShowAddJobForm(false)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleCreateJob} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Code</label>
              <input
                value={newJobCode}
                onChange={(e) => setNewJobCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                placeholder="e.g. consultant_urologist"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                value={newJobTitle}
                onChange={(e) => setNewJobTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                placeholder="e.g. Consultant Urologist"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                value={newJobDepartment}
                onChange={(e) => setNewJobDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                placeholder="e.g. Clinical Services"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <input
                value={newJobType}
                onChange={(e) => setNewJobType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                placeholder="e.g. Full-time"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                value={newJobLocation}
                onChange={(e) => setNewJobLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apply By</label>
              <input
                type="date"
                value={newJobApplyBy}
                onChange={(e) => setNewJobApplyBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
              />
            </div>

            <div>
              <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={newJobIsPublished}
                  onChange={(e) => setNewJobIsPublished(e.target.checked)}
                  className="h-4 w-4"
                />
                Published
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newJobDescription}
                onChange={(e) => setNewJobDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                rows={4}
              />
            </div>

            {jobsError ? <div className="text-red-600 text-sm">{jobsError}</div> : null}
            {jobsSuccess ? <div className="text-green-700 text-sm">{jobsSuccess}</div> : null}

            <button
              type="submit"
              disabled={jobsSaving}
              className="inline-flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60"
            >
              <Plus size={18} />
              {jobsSaving ? 'Saving...' : 'Add Job'}
            </button>
          </form>
        </div>
      ) : null}

      {editingJobId ? (
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Edit Job</h2>
            <button onClick={cancelEditJob} className="p-2 text-gray-600 hover:bg-gray-100 rounded">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleUpdateJob} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Code</label>
                <input
                  value={editJobCode}
                  onChange={(e) => setEditJobCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  value={editJobTitle}
                  onChange={(e) => setEditJobTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  value={editJobDepartment}
                  onChange={(e) => setEditJobDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <input
                  value={editJobType}
                  onChange={(e) => setEditJobType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  value={editJobLocation}
                  onChange={(e) => setEditJobLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apply By</label>
                <input
                  type="date"
                  value={editJobApplyBy}
                  onChange={(e) => setEditJobApplyBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                />
              </div>

              <div>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={editJobIsPublished}
                    onChange={(e) => setEditJobIsPublished(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Published
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editJobDescription}
                  onChange={(e) => setEditJobDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                  rows={4}
                />
              </div>

              {jobsError ? <div className="text-red-600 text-sm">{jobsError}</div> : null}
              {jobsSuccess ? <div className="text-green-700 text-sm">{jobsSuccess}</div> : null}

              <button
                type="submit"
                disabled={jobsSaving}
                className="inline-flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60"
              >
                <Save size={18} />
                {jobsSaving ? 'Saving...' : 'Save Changes'}
              </button>

          </form>
        </div>
      ) : null}

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Application Forms</h2>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus size={20} />
            Add More
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950 mx-auto"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No careers forms yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{item.code}</td>
                    <td className="px-6 py-4 text-gray-900">{item.title}</td>
                    <td className="px-6 py-4">
                      <a href={item.fileUrl} download className="text-blue-600 hover:underline">
                        Download {item.originalName}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{item.sortOrder ?? 0}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Pencil size={18} />
                        </button>
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

        {showAddForm ? (
          <div ref={addFormRef} className="bg-white rounded-lg shadow p-6 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Application Form</h2>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Form Code</label>
                <input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                  placeholder="e.g. job_application"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                  placeholder="e.g. AFIU Job Application Forms"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <input
                  value={newSortOrder}
                  onChange={(e) => setNewSortOrder(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                  placeholder="e.g. 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document</label>
                <input
                  id="careers-new-file"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-950 file:text-white hover:file:bg-blue-800"
                />
                {newFile ? <p className="mt-2 text-sm text-gray-600">Selected: {newFile.name}</p> : null}
              </div>

              {formsError ? <div className="text-red-600 text-sm">{formsError}</div> : null}
              {formsSuccess ? <div className="text-green-700 text-sm">{formsSuccess}</div> : null}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60"
              >
                <Plus size={18} />
                {saving ? 'Saving...' : 'Add Form'}
              </button>
            </form>
          </div>
        ) : null}

        {editingId ? (
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Form</h2>
              <button onClick={cancelEdit} className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Form Code</label>
                <input
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <input
                  value={editSortOrder}
                  onChange={(e) => setEditSortOrder(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Replace Document (optional)</label>
                <input
                  id="careers-edit-file"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-950 file:text-white hover:file:bg-blue-800"
                />
                {editFile ? <p className="mt-2 text-sm text-gray-600">Selected: {editFile.name}</p> : null}
              </div>

              {formsError ? <div className="text-red-600 text-sm">{formsError}</div> : null}
              {formsSuccess ? <div className="text-green-700 text-sm">{formsSuccess}</div> : null}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}
