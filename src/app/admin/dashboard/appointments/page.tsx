'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Search, Filter, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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

export default function AppointmentsAdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointments Management</h1>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">#{apt.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-800">{apt.patientName}</div>
                      <div className="text-xs text-gray-500">{apt.patientCnic}</div>
                      <div className="text-xs text-gray-500">{apt.patientPhone}</div>
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
                      <div className="flex items-center gap-2">
                        {apt.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => updateStatus(apt.id, 'CONFIRMED')}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Confirm"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => updateStatus(apt.id, 'CANCELLED')}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Cancel"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        {apt.status === 'CONFIRMED' && (
                          <>
                            <button
                              onClick={() => updateStatus(apt.id, 'COMPLETED')}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Mark Completed"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => updateStatus(apt.id, 'NO_SHOW')}
                              className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                              title="Mark No Show"
                            >
                              <AlertCircle size={18} />
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
          return (
            <div key={status} className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className={`text-2xl font-bold ${
                status === 'PENDING' ? 'text-yellow-600' :
                status === 'CONFIRMED' ? 'text-blue-600' :
                status === 'COMPLETED' ? 'text-green-600' :
                status === 'CANCELLED' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {count}
              </div>
              <div className="text-xs text-gray-500 mt-1">{status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
