'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, User, Save, AlertCircle, CheckCircle, Clock, X, Edit2, Trash2, Plus, RefreshCw, CalendarOff } from 'lucide-react';

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
  reason: string | null;
  faculty: {
    id: number;
    name: string;
    designation: string;
  };
}

interface OfficialHoliday {
  id: number;
  date: string;
  name: string;
  reason: string | null;
  isActive: boolean;
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
  { number: 11, time: '5:30 PM - 5:45 PM' },
  { number: 12, time: '5:45 PM - 6:00 PM' },
];

export default function AvailabilityAdminPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [unavailableRecords, setUnavailableRecords] = useState<AvailabilityRecord[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentDateInput, setCurrentDateInput] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const [unavailabilityType, setUnavailabilityType] = useState<string>('FULL_DAY');
  const [blockedSlots, setBlockedSlots] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingRecord, setEditingRecord] = useState<AvailabilityRecord | null>(null);
  
  // Modal states
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  
  // Holiday states
  const [holidays, setHolidays] = useState<OfficialHoliday[]>([]);
  const [loadingHolidays, setLoadingHolidays] = useState(true);
  const [holidayDate, setHolidayDate] = useState<string>('');
  const [holidayName, setHolidayName] = useState<string>('');
  const [holidayReason, setHolidayReason] = useState<string>('');
  const [editingHoliday, setEditingHoliday] = useState<OfficialHoliday | null>(null);
  const [savingHoliday, setSavingHoliday] = useState(false);
  
  // Active tab
  const [activeTab, setActiveTab] = useState<'doctors' | 'holidays'>('doctors');

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

  // Fetch holidays
  const fetchHolidays = useCallback(async () => {
    setLoadingHolidays(true);
    try {
      const res = await fetch('/api/appointments/holidays?upcoming=true');
      const data = await res.json();
      if (data.holidays) {
        setHolidays(data.holidays);
      }
    } catch (error) {
      console.error('Failed to fetch holidays:', error);
    } finally {
      setLoadingHolidays(false);
    }
  }, []);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

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
    setUnavailabilityType('FULL_DAY');
    setBlockedSlots([]);
    setEditingRecord(null);
    setMessage(null);
    setShowDoctorModal(false);
  };

  // Reset holiday form
  const resetHolidayForm = () => {
    setHolidayDate('');
    setHolidayName('');
    setHolidayReason('');
    setEditingHoliday(null);
    setShowHolidayModal(false);
  };

  // Load holiday for editing
  const loadHolidayForEdit = (holiday: OfficialHoliday) => {
    setEditingHoliday(holiday);
    // Parse the date and format it correctly for the date input
    const d = new Date(holiday.date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    setHolidayDate(dateStr);
    setHolidayName(holiday.name);
    setHolidayReason(holiday.reason || '');
    setShowHolidayModal(true);
  };

  // Save holiday
  const handleSaveHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!holidayDate || !holidayName) {
      setMessage({ type: 'error', text: 'Date and name are required for holiday' });
      return;
    }

    setSavingHoliday(true);
    setMessage(null);

    try {
      const url = '/api/appointments/holidays';
      const method = editingHoliday ? 'PUT' : 'POST';
      const body = editingHoliday 
        ? { id: editingHoliday.id, date: holidayDate, name: holidayName, reason: holidayReason }
        : { date: holidayDate, name: holidayName, reason: holidayReason };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: editingHoliday ? 'Holiday updated successfully' : 'Holiday added successfully' });
        resetHolidayForm();
        fetchHolidays();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save holiday' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSavingHoliday(false);
    }
  };

  // Delete holiday
  const deleteHoliday = async (id: number) => {
    if (!confirm('Are you sure you want to delete this holiday?')) {
      return;
    }

    try {
      const res = await fetch(`/api/appointments/holidays?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Holiday deleted successfully' });
        fetchHolidays();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete holiday' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  // Load record for editing
  const loadRecordForEdit = (record: AvailabilityRecord) => {
    setEditingRecord(record);
    setSelectedDoctor(record.facultyId.toString());
    const dateStr = new Date(record.date).toISOString().split('T')[0];
    setSelectedDates([dateStr]);
    setIsAvailable(record.isAvailable);
    setReason(record.reason || '');
    setShowDoctorModal(true);
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
      // If editing, use PUT to update the existing record by ID
      if (editingRecord) {
        const res = await fetch('/api/appointments/availability', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingRecord.id,
            doctorId: selectedDoctor,
            date: selectedDates[0], // Single date when editing
            isAvailable,
            reason: !isAvailable ? reason : undefined,
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
      } else {
        // Creating new records - use POST
        const res = await fetch('/api/appointments/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            doctorId: selectedDoctor,
            dates: selectedDates,
            isAvailable,
            reason: !isAvailable ? reason : undefined,
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
    // Use UTC methods to display the date correctly regardless of timezone
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Availability Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              resetForm();
              setShowDoctorModal(true);
            }}
            className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus size={18} />
            Add Doctor Unavailability
          </button>
          <button
            onClick={() => setShowHolidayModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <CalendarOff size={18} />
            Add Holiday
          </button>
        </div>
      </div>

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

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'doctors'
                ? 'border-blue-950 text-blue-950'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <User size={16} className="inline mr-2" />
            Doctor Unavailability
          </button>
          <button
            onClick={() => setActiveTab('holidays')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'holidays'
                ? 'border-blue-950 text-blue-950'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <CalendarOff size={16} className="inline mr-2" />
            Official Holidays
          </button>
        </nav>
      </div>

      {/* Doctor Unavailability Tab */}
      {activeTab === 'doctors' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Unavailable Doctors List */}
          <div className="xl:col-span-3 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Upcoming Doctor Unavailability</h2>
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Doctor</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Blocked Slots</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Reason</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Actions</th>
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
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {blockedSlotsDisplay}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate" title={record.reason || '-'}>
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

          {/* Info Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment Rules</h2>
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
          </div>
        </div>
      )}

      {/* Official Holidays Tab */}
      {activeTab === 'holidays' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Official Holidays</h2>
              <button
                onClick={fetchHolidays}
                className="flex items-center gap-2 text-sm text-blue-950 hover:text-blue-700"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            {loadingHolidays ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-950"></div>
              </div>
            ) : holidays.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No upcoming holidays found. Click &quot;Add Holiday&quot; to add one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Holiday Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Reason / Description</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {holidays.map((holiday) => (
                      <tr key={holiday.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(holiday.date)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{holiday.name}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate" title={holiday.reason || '-'}>
                          {holiday.reason || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            holiday.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {holiday.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => loadHolidayForEdit(holiday)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => deleteHoliday(holiday.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
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
            )}
          </div>

          {/* Info Panel for Holidays */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">About Official Holidays</h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>Holidays apply to <strong>all doctors</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>Patients <strong>cannot book</strong> on holidays</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>Reason is shown when patient <strong>hovers</strong> the date</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 rounded-lg p-6">
              <h3 className="font-semibold text-amber-900 mb-2">Note</h3>
              <p className="text-sm text-amber-800">
                Official holidays will make the date unselectable for all patients during booking. 
                The reason you provide will be displayed to patients when they hover over the blocked date.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Unavailability Modal */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingRecord ? 'Edit Doctor Unavailability' : 'Add Doctor Unavailability'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Doctor Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <User size={18} className="inline mr-2" />
                  Select Doctor <span className="text-red-500">*</span>
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
                  Select Date(s) <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="date"
                    value={currentDateInput}
                    min={getMinDate()}
                    onChange={(e) => setCurrentDateInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                  <button
                    type="button"
                    onClick={addDate}
                    disabled={!currentDateInput}
                    className="px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                
                {selectedDates.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDates.map((date) => (
                      <span
                        key={date}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {formatDate(date)}
                        <button
                          type="button"
                          onClick={() => removeDate(date)}
                          className="hover:text-blue-950"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {selectedDates.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">Add one or more dates</p>
                )}
                {editingRecord && (
                  <p className="text-xs text-orange-600 mt-2">Note: Changing the date will update the existing record.</p>
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
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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

                  {/* Reason */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Reason for unavailability (shown to patients) <span className="text-red-500">*</span></label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Enter reason for unavailability (e.g., 'Doctor on medical leave', 'Attending conference')..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">This reason will be displayed to patients when they try to book.</p>
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-950 hover:bg-blue-800 disabled:opacity-75 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : editingRecord ? 'Update' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Holiday Modal */}
      {showHolidayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingHoliday ? 'Edit Official Holiday' : 'Add Official Holiday'}
              </h2>
              <button onClick={resetHolidayForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveHoliday} className="p-6 space-y-5">
              {/* Holiday Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <Calendar size={18} className="inline mr-2" />
                  Holiday Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={holidayDate}
                  min={getMinDate()}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                  required
                />
              </div>

              {/* Holiday Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Holiday Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                  placeholder="e.g., Independence Day, Eid ul Fitr"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                  required
                />
              </div>

              {/* Holiday Reason */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Reason / Description (shown to patients)</label>
                <textarea
                  value={holidayReason}
                  onChange={(e) => setHolidayReason(e.target.value)}
                  placeholder="Enter a description that will be shown to patients when they hover over this date..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
                <p className="text-xs text-gray-500 mt-1">This will be displayed when patients hover over the blocked date.</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={savingHoliday}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-75 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Save size={18} />
                  {savingHoliday ? 'Saving...' : editingHoliday ? 'Update Holiday' : 'Add Holiday'}
                </button>
                <button
                  type="button"
                  onClick={resetHolidayForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
