'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Search, Filter, RefreshCw, CheckCircle, XCircle, AlertCircle, Edit2, X, Loader2, Eye, Send } from 'lucide-react';

interface Appointment {
  id: number;
  patientName: string;
  patientCnic: string;
  patientPhone: string;
  patientEmail: string;
  appointmentDate: string;
  slotStartTime: string;
  slotEndTime: string;
  slotNumber: number;
  status: string;
  notes: string | null;
  createdAt: string;
  faculty: {
    id: number;
    name: string;
    designation: string;
  };
}

interface Doctor {
  id: number;
  name: string;
  designation: string;
}

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

export default function AppointmentsAdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit modal state
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editAction, setEditAction] = useState<'update' | 'cancel'>('update');
  const [editDoctorId, setEditDoctorId] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editSlot, setEditSlot] = useState<string>('');
  const [editReason, setEditReason] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // View modal state
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);

  // Reply modal state
  const [replyAppointment, setReplyAppointment] = useState<Appointment | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [replySuccess, setReplySuccess] = useState('');

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

  // Fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDoctor !== 'all') params.append('doctorId', selectedDoctor);
      if (selectedDate) params.append('date', selectedDate);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      
      const res = await fetch(`/api/admin/appointments?${params.toString()}`);
      const data = await res.json();
      if (data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDoctor, selectedDate, selectedStatus]);

  // Filter appointments by search
  const filteredAppointments = appointments.filter(apt => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      apt.patientName.toLowerCase().includes(query) ||
      apt.patientCnic.includes(query) ||
      apt.patientPhone.includes(query) ||
      apt.patientEmail.toLowerCase().includes(query)
    );
  });

  // Format time
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      NO_SHOW: 'bg-gray-100 text-gray-800',
      EXPIRED: 'bg-gray-100 text-gray-600',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // Update appointment status
  const updateStatus = async (appointmentId: number, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/appointments/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, status: newStatus }),
      });
      
      if (res.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Open edit modal
  const openEditModal = (appointment: Appointment, action: 'update' | 'cancel') => {
    setEditingAppointment(appointment);
    setEditAction(action);
    setEditDoctorId(appointment.faculty.id.toString());
    const dateStr = new Date(appointment.appointmentDate).toISOString().split('T')[0];
    setEditDate(dateStr);
    setEditSlot(appointment.slotNumber.toString());
    setEditReason('');
    setEditError('');
    setEditSuccess('');
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditingAppointment(null);
    setEditReason('');
    setEditError('');
    setEditSuccess('');
  };

  // Handle edit/cancel submission
  const handleEditSubmit = async () => {
    if (!editingAppointment) return;
    
    if (!editReason.trim() || editReason.trim().length < 5) {
      setEditError('Please provide a reason (at least 5 characters)');
      return;
    }

    setEditLoading(true);
    setEditError('');
    setEditSuccess('');

    try {
      const body: Record<string, unknown> = {
        appointmentId: editingAppointment.id,
        action: editAction,
        reason: editReason.trim(),
      };

      if (editAction === 'update') {
        if (editDoctorId !== editingAppointment.faculty.id.toString()) {
          body.doctorId = editDoctorId;
        }
        const originalDate = new Date(editingAppointment.appointmentDate).toISOString().split('T')[0];
        if (editDate !== originalDate) {
          body.appointmentDate = editDate;
        }
        if (editSlot !== editingAppointment.slotNumber.toString()) {
          body.slotNumber = editSlot;
        }
      }

      const res = await fetch('/api/admin/appointments/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setEditSuccess(data.message);
        fetchAppointments();
        setTimeout(() => {
          closeEditModal();
        }, 1500);
      } else {
        setEditError(data.error || 'Failed to update appointment');
      }
    } catch (error) {
      setEditError('Network error. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // Open view modal
  const openViewModal = (appointment: Appointment) => {
    setViewingAppointment(appointment);
  };

  // Close view modal
  const closeViewModal = () => {
    setViewingAppointment(null);
  };

  // Open reply modal
  const openReplyModal = (appointment: Appointment) => {
    setReplyAppointment(appointment);
    setReplySubject(`Regarding Your Appointment on ${formatDate(appointment.appointmentDate)}`);
    setReplyMessage('');
    setReplyError('');
    setReplySuccess('');
  };

  // Close reply modal
  const closeReplyModal = () => {
    setReplyAppointment(null);
    setReplySubject('');
    setReplyMessage('');
    setReplyError('');
    setReplySuccess('');
  };

  // Handle reply submission
  const handleReplySubmit = async () => {
    if (!replyAppointment) return;

    if (!replySubject.trim()) {
      setReplyError('Please enter a subject');
      return;
    }

    if (!replyMessage.trim() || replyMessage.trim().length < 10) {
      setReplyError('Please enter a message (at least 10 characters)');
      return;
    }

    setReplyLoading(true);
    setReplyError('');
    setReplySuccess('');

    try {
      const res = await fetch('/api/admin/appointments/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: replyAppointment.id,
          patientEmail: replyAppointment.patientEmail,
          patientName: replyAppointment.patientName,
          subject: replySubject.trim(),
          message: replyMessage.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setReplySuccess('Email sent successfully!');
        setTimeout(() => {
          closeReplyModal();
        }, 1500);
      } else {
        setReplyError(data.error || 'Failed to send email');
      }
    } catch (error) {
      setReplyError('Network error. Please try again.');
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Appointments Management</h1>
        <button
          onClick={fetchAppointments}
          className="flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, CNIC, phone, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
              />
            </div>
          </div>

          {/* Doctor Filter */}
          <div>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
            >
              <option value="all">All Doctors</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id.toString()}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="NO_SHOW">No Show</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-950"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No appointments found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">S.No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Patient</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Doctor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Date & Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((apt, index) => (
                  <tr key={apt.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-800">{apt.patientName}</div>
                     
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-800">{apt.faculty.name}</div>
                      <div className="text-xs text-gray-500">{apt.faculty.designation}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-800">{formatDate(apt.appointmentDate)}</div>
                      <div className="text-xs text-gray-500">
                        {formatTime(apt.slotStartTime)} - {formatTime(apt.slotEndTime)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* View button - always visible */}
                        <button
                          onClick={() => openViewModal(apt)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Reply button - always visible */}
                        <button
                          onClick={() => openReplyModal(apt)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                          title="Send Reply"
                        >
                          <Send size={16} />
                        </button>

                        {/* Edit button - for PENDING and CONFIRMED */}
                        {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                          <button
                            onClick={() => openEditModal(apt, 'update')}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Appointment"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}

                        {/* Cancel button - for PENDING and CONFIRMED */}
                        {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                          <button
                            onClick={() => openEditModal(apt, 'cancel')}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Cancel Appointment"
                          >
                            <XCircle size={16} />
                          </button>
                        )}

                        {/* Status change buttons */}
                        {apt.status === 'PENDING' && (
                          <button
                            onClick={() => updateStatus(apt.id, 'CONFIRMED')}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Confirm"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}

                        {apt.status === 'CONFIRMED' && (
                          <>
                            <button
                              onClick={() => updateStatus(apt.id, 'COMPLETED')}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Mark Completed"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => updateStatus(apt.id, 'NO_SHOW')}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                              title="Mark No Show"
                            >
                              <AlertCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
        {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'EXPIRED'].map((status) => {
          const count = appointments.filter(a => a.status === status).length;
          const isActive = selectedStatus === status;
          const label = status.replace(/_/g, ' ');
          return (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus((prev) => (prev === status ? 'all' : status))}
              aria-pressed={isActive}
              aria-label={`Filter appointments by ${label}`}
              title={`Click to filter by ${label}`}
              className={`bg-white rounded-lg shadow-sm p-4 text-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-950 cursor-pointer hover:shadow-md ${
                isActive ? 'ring-2 ring-blue-950' : ''
              }`}
            >
              <div className={`text-2xl font-bold ${
                status === 'PENDING' ? 'text-yellow-600' :
                status === 'CONFIRMED' ? 'text-blue-600' :
                status === 'COMPLETED' ? 'text-green-600' :
                status === 'CANCELLED' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {count}
              </div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
              <div className="text-[11px] text-gray-400 mt-1">
                {isActive ? 'Click to clear filter' : 'Click to filter'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Edit/Cancel Modal */}
      {editingAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className={`px-6 py-4 border-b flex items-center justify-between ${editAction === 'cancel' ? 'bg-red-50' : 'bg-blue-50'}`}>
              <h2 className={`text-2xl font-bold ${editAction === 'cancel' ? 'text-red-800' : 'text-blue-800'}`}>
                {editAction === 'cancel' ? 'Cancel Appointment' : 'Edit Appointment'}
              </h2>
              <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Current Appointment Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Appointment</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Patient:</span>
                    <p className="font-medium">{editingAppointment.patientName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Doctor:</span>
                    <p className="font-medium">{editingAppointment.faculty.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <p className="font-medium">{formatDate(editingAppointment.appointmentDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Time:</span>
                    <p className="font-medium">{formatTime(editingAppointment.slotStartTime)} - {formatTime(editingAppointment.slotEndTime)}</p>
                  </div>
                </div>
              </div>

              {/* Edit Fields (only for update action) */}
              {editAction === 'update' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Change Doctor</label>
                    <select
                      value={editDoctorId}
                      onChange={(e) => setEditDoctorId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id.toString()}>
                          {doc.name} - {doc.designation}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Change Date</label>
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Change Time Slot</label>
                    <select
                      value={editSlot}
                      onChange={(e) => setEditSlot(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot.number} value={slot.number.toString()}>
                          Slot {slot.number}: {slot.time}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Reason Field (required for both) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for {editAction === 'cancel' ? 'Cancellation' : 'Update'} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder={`Enter reason for ${editAction === 'cancel' ? 'cancellation' : 'updating the appointment'}...`}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">This will be sent to the patient via email.</p>
              </div>

              {/* Error/Success Messages */}
              {editError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {editError}
                </div>
              )}
              {editSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                  {editSuccess}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={editLoading}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 ${
                    editAction === 'cancel' 
                      ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400' 
                      : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'
                  }`}
                >
                  {editLoading && <Loader2 size={16} className="animate-spin" />}
                  {editAction === 'cancel' ? 'Cancel Appointment' : 'Update Appointment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Appointment Modal */}
      {viewingAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Appointment Details</h2>
              <button onClick={closeViewModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Patient Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <User size={18} /> Patient Information
                </h3>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-800">{viewingAppointment.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CNIC:</span>
                    <span className="font-medium text-gray-800">{viewingAppointment.patientCnic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-gray-800">{viewingAppointment.patientPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-800">{viewingAppointment.patientEmail}</span>
                  </div>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Calendar size={18} /> Appointment Details
                </h3>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-medium text-gray-800">{viewingAppointment.faculty.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Designation:</span>
                    <span className="font-medium text-gray-800">{viewingAppointment.faculty.designation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-800">{formatDate(viewingAppointment.appointmentDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium text-gray-800">
                      {formatTime(viewingAppointment.slotStartTime)} - {formatTime(viewingAppointment.slotEndTime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Slot Number:</span>
                    <span className="font-medium text-gray-800">{viewingAppointment.slotNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(viewingAppointment.status)}`}>
                      {viewingAppointment.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {viewingAppointment.notes && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Notes</h3>
                  <p className="text-sm text-gray-700">{viewingAppointment.notes}</p>
                </div>
              )}

              {/* Booking Info */}
              <div className="text-xs text-gray-500 text-center pt-2">
                Booked on: {new Date(viewingAppointment.createdAt).toLocaleString()}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeViewModal}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    closeViewModal();
                    openReplyModal(viewingAppointment);
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={16} /> Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b bg-purple-50 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-purple-800">Reply to Patient</h2>
              <button onClick={closeReplyModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Appointment Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Appointment Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Patient:</span>
                    <p className="font-medium">{replyAppointment.patientName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium text-sm">{replyAppointment.patientEmail}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Doctor:</span>
                    <p className="font-medium">{replyAppointment.faculty.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <p className="font-medium">{formatDate(replyAppointment.appointmentDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Time:</span>
                    <p className="font-medium">
                      {formatTime(replyAppointment.slotStartTime)} - {formatTime(replyAppointment.slotEndTime)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(replyAppointment.status)}`}>
                      {replyAppointment.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subject Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Email subject..."
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your message to the patient..."
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This message will be sent to: {replyAppointment.patientEmail}
                </p>
              </div>

              {/* Error/Success Messages */}
              {replyError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {replyError}
                </div>
              )}
              {replySuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                  {replySuccess}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeReplyModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReplySubmit}
                  disabled={replyLoading}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {replyLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
