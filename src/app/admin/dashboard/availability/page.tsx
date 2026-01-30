'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, User, Save, AlertCircle, CheckCircle, Clock, X, Edit2, Trash2, Plus, RefreshCw } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  designation: string;
}

interface AvailabilityRecord {
  id: number;
  facultyId: number;
  date: string;
  isAvailable: boolean;
  unavailabilityType: string | null;
  blockedSlots: string | null;
  overrideType: string | null;
  reason: string | null;
  faculty: {
    id: number;
    name: string;
    designation: string;
  };
}

// Time slots configuration
const TIME_SLOTS = [
  { number: 1, time: '3:00 PM - 3:15 PM' },
  { number: 2, time: '3:15 PM - 3:30 PM' },
  { number: 3, time: '3:30 PM - 3:45 PM' },
  { number: 4, time: '3:45 PM - 4:00 PM' },
  { number: 5, time: '4:00 PM - 4:15 PM' },
  { number: 6, time: '4:15 PM - 4:30 PM' },
  { number: 7, time: '4:30 PM - 4:45 PM' },
  { number: 8, time: '4:45 PM - 5:00 PM' },
  { number: 9, time: '5:00 PM - 5:15 PM' },
  { number: 10, time: '5:15 PM - 5:30 PM' },
];

export default function AvailabilityAdminPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [unavailableRecords, setUnavailableRecords] = useState<AvailabilityRecord[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentDateInput, setCurrentDateInput] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const [overrideType, setOverrideType] = useState<string>('LEAVE');
  const [unavailabilityType, setUnavailabilityType] = useState<string>('FULL_DAY');
  const [blockedSlots, setBlockedSlots] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingRecord, setEditingRecord] = useState<AvailabilityRecord | null>(null);

  // Fetch doctors
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch('/api/appointments/doctors');
        const data = await res.json();
        if (data.doctors) {
          setDoctors(data.doctors);
        }
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    }
    fetchDoctors();
  }, []);

  // Fetch unavailable records
  const fetchUnavailableRecords = useCallback(async () => {
    setLoadingRecords(true);
    try {
      const res = await fetch('/api/appointments/availability?upcoming=true');
      const data = await res.json();
      if (data.records) {
        setUnavailableRecords(data.records);
      }
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setLoadingRecords(false);
    }
  }, []);

  useEffect(() => {
    fetchUnavailableRecords();
  }, [fetchUnavailableRecords]);

  // Add date to selection
  const addDate = () => {
    if (currentDateInput && !selectedDates.includes(currentDateInput)) {
      setSelectedDates([...selectedDates, currentDateInput].sort());
      setCurrentDateInput('');
    }
  };

  // Remove date from selection
  const removeDate = (date: string) => {
    setSelectedDates(selectedDates.filter(d => d !== date));
  };

  // Toggle slot selection
  const toggleSlot = (slotNumber: number) => {
    if (blockedSlots.includes(slotNumber)) {
      setBlockedSlots(blockedSlots.filter(s => s !== slotNumber));
    } else {
      setBlockedSlots([...blockedSlots, slotNumber].sort((a, b) => a - b));
    }
  };

  // Select/deselect all slots
  const toggleAllSlots = () => {
    if (blockedSlots.length === TIME_SLOTS.length) {
      setBlockedSlots([]);
    } else {
      setBlockedSlots(TIME_SLOTS.map(s => s.number));
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedDoctor('');
    setSelectedDates([]);
    setCurrentDateInput('');
    setIsAvailable(false);
    setReason('');
    setOverrideType('LEAVE');
    setUnavailabilityType('FULL_DAY');
    setBlockedSlots([]);
    setEditingRecord(null);
    setMessage(null);
  };

  // Load record for editing
  const loadRecordForEdit = (record: AvailabilityRecord) => {
    setEditingRecord(record);
    setSelectedDoctor(record.facultyId.toString());
    const dateStr = new Date(record.date).toISOString().split('T')[0];
    setSelectedDates([dateStr]);
    setIsAvailable(record.isAvailable);
    setReason(record.reason || '');
    setOverrideType(record.overrideType || 'LEAVE');
    setUnavailabilityType(record.unavailabilityType || 'FULL_DAY');
    if (record.blockedSlots) {
      try {
        setBlockedSlots(JSON.parse(record.blockedSlots));
      } catch {
        setBlockedSlots([]);
      }
    } else {
      setBlockedSlots([]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete record
  const deleteRecord = async (id: number) => {
    if (!confirm('Are you sure you want to delete this availability record? The doctor will become available again.')) {
      return;
    }

    try {
      const res = await fetch(`/api/appointments/availability?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Record deleted successfully' });
        fetchUnavailableRecords();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete record' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor) {
      setMessage({ type: 'error', text: 'Please select a doctor' });
      return;
    }

    if (selectedDates.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one date' });
      return;
    }

    if (!isAvailable && unavailabilityType === 'SPECIFIC_SLOTS' && blockedSlots.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one time slot to block' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/appointments/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          dates: selectedDates,
          isAvailable,
          reason: !isAvailable ? reason : undefined,
          overrideType: !isAvailable ? overrideType : undefined,
          unavailabilityType: !isAvailable ? unavailabilityType : undefined,
          blockedSlots: !isAvailable && unavailabilityType === 'SPECIFIC_SLOTS' ? blockedSlots : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: data.message });
        resetForm();
        fetchUnavailableRecords();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update availability' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Doctor Availability Management</h1>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
          message.type === 'success' 
            ? 'border-green-200 bg-green-50 text-green-700' 
            : 'border-red-200 bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <p>{message.text}</p>
          <button onClick={() => setMessage(null)} className="ml-auto">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Set Availability Form */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingRecord ? 'Edit Availability' : 'Set Doctor Unavailability'}
            </h2>
            {editingRecord && (
              <button
                onClick={resetForm}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X size={14} /> Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Doctor Selection */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <User size={18} className="inline mr-2" />
                Select Doctor
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                required
                disabled={!!editingRecord}
              >
                <option value="">Choose a doctor...</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id.toString()}>
                    {doc.name} - {doc.designation}
                  </option>
                ))}
              </select>
            </div>

            {/* Multiple Date Selection */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Calendar size={18} className="inline mr-2" />
                Select Date(s)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="date"
                  value={currentDateInput}
                  min={getMinDate()}
                  onChange={(e) => setCurrentDateInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                  disabled={!!editingRecord}
                />
                <button
                  type="button"
                  onClick={addDate}
                  disabled={!currentDateInput || !!editingRecord}
                  className="px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              {/* Selected Dates */}
              {selectedDates.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedDates.map((date) => (
                    <span
                      key={date}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {formatDate(date)}
                      {!editingRecord && (
                        <button
                          type="button"
                          onClick={() => removeDate(date)}
                          className="hover:text-blue-950"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}
              {selectedDates.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">Add one or more dates</p>
              )}
            </div>

            {/* Availability Status */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Availability Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={isAvailable}
                    onChange={() => setIsAvailable(true)}
                    className="w-4 h-4 text-blue-950"
                  />
                  <span className="text-green-600 font-medium">Mark as Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!isAvailable}
                    onChange={() => setIsAvailable(false)}
                    className="w-4 h-4 text-blue-950"
                  />
                  <span className="text-red-600 font-medium">Mark as Not Available</span>
                </label>
              </div>
            </div>

            {/* Unavailability Details */}
            {!isAvailable && (
              <>
                {/* Unavailability Type */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <Clock size={18} className="inline mr-2" />
                    Unavailability Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={unavailabilityType === 'FULL_DAY'}
                        onChange={() => {
                          setUnavailabilityType('FULL_DAY');
                          setBlockedSlots([]);
                        }}
                        className="w-4 h-4 text-blue-950"
                      />
                      <span className="font-medium">Full Day</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={unavailabilityType === 'SPECIFIC_SLOTS'}
                        onChange={() => setUnavailabilityType('SPECIFIC_SLOTS')}
                        className="w-4 h-4 text-blue-950"
                      />
                      <span className="font-medium">Specific Time Slots</span>
                    </label>
                  </div>
                </div>

                {/* Time Slot Selection */}
                {unavailabilityType === 'SPECIFIC_SLOTS' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-gray-700 font-medium">Select Blocked Slots</label>
                      <button
                        type="button"
                        onClick={toggleAllSlots}
                        className="text-sm text-blue-950 hover:underline"
                      >
                        {blockedSlots.length === TIME_SLOTS.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot.number}
                          type="button"
                          onClick={() => toggleSlot(slot.number)}
                          className={`p-2 text-xs rounded-lg border transition-colors ${
                            blockedSlots.includes(slot.number)
                              ? 'bg-red-100 border-red-300 text-red-800'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <div className="font-medium">Slot {slot.number}</div>
                          <div>{slot.time}</div>
                        </button>
                      ))}
                    </div>
                    {blockedSlots.length > 0 && (
                      <p className="text-sm text-red-600 mt-2">
                        {blockedSlots.length} slot(s) will be blocked
                      </p>
                    )}
                  </div>
                )}

                {/* Override Type */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Reason Type</label>
                  <select
                    value={overrideType}
                    onChange={(e) => setOverrideType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                  >
                    <option value="LEAVE">Leave</option>
                    <option value="EMERGENCY_BLOCK">Emergency Block</option>
                    <option value="CUSTOM_HOURS">Custom Hours</option>
                  </select>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Reason (optional)</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for unavailability..."
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-950 hover:bg-blue-800 disabled:opacity-75 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Save size={18} />
              {loading ? 'Saving...' : editingRecord ? 'Update Availability' : 'Save Availability'}
            </button>
          </form>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Appointment Rules</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-950 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>Appointments available <strong>Monday to Friday</strong> only</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-950 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>Time window: <strong>3:00 PM - 6:00 PM</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-950 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>Slot duration: <strong>15 minutes</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-950 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>Maximum <strong>10 appointments</strong> per doctor per day</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Reason Types</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li><strong>Leave:</strong> Planned leave/vacation</li>
              <li><strong>Emergency Block:</strong> Urgent unavailability</li>
              <li><strong>Custom Hours:</strong> Modified schedule</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Unavailable Doctors List */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Upcoming Unavailable Doctors</h2>
          <button
            onClick={fetchUnavailableRecords}
            className="flex items-center gap-2 text-sm text-blue-950 hover:text-blue-700"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loadingRecords ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-950"></div>
          </div>
        ) : unavailableRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No upcoming unavailability records found. All doctors are available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blocked Slots</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {unavailableRecords.map((record) => {
                  let blockedSlotsDisplay = 'Full Day';
                  if (record.unavailabilityType === 'SPECIFIC_SLOTS' && record.blockedSlots) {
                    try {
                      const slots = JSON.parse(record.blockedSlots);
                      blockedSlotsDisplay = `Slots: ${slots.join(', ')}`;
                    } catch {
                      blockedSlotsDisplay = 'Full Day';
                    }
                  }

                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{record.faculty.name}</div>
                        <div className="text-xs text-gray-500">{record.faculty.designation}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.overrideType === 'EMERGENCY_BLOCK'
                            ? 'bg-red-100 text-red-800'
                            : record.overrideType === 'LEAVE'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {record.overrideType || 'Leave'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {blockedSlotsDisplay}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {record.reason || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => loadRecordForEdit(record)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteRecord(record.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete (Make Available)"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
