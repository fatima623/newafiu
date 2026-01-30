'use client';

import { useState, useEffect } from 'react';
import { Calendar, User, Save, AlertCircle, CheckCircle } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  designation: string;
}

export default function AvailabilityAdminPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [reason, setReason] = useState<string>('');
  const [overrideType, setOverrideType] = useState<string>('LEAVE');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedDate) {
      setMessage({ type: 'error', text: 'Please select a doctor and date' });
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
          date: selectedDate,
          isAvailable,
          reason: !isAvailable ? reason : undefined,
          overrideType: !isAvailable ? overrideType : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: data.message });
        setReason('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update availability' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Doctor Availability Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Set Availability Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Set Doctor Availability</h2>
          
          {message && (
            <div className={`mb-4 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
              message.type === 'success' 
                ? 'border-green-200 bg-green-50 text-green-700' 
                : 'border-red-200 bg-red-50 text-red-700'
            }`}>
              {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <p>{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              >
                <option value="">Choose a doctor...</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id.toString()}>
                    {doc.name} - {doc.designation}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Calendar size={18} className="inline mr-2" />
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={getMinDate()}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                required
              />
            </div>

            {/* Availability Toggle */}
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
                  <span className="text-green-600 font-medium">Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!isAvailable}
                    onChange={() => setIsAvailable(false)}
                    className="w-4 h-4 text-blue-950"
                  />
                  <span className="text-red-600 font-medium">Not Available</span>
                </label>
              </div>
            </div>

            {/* Unavailability Details */}
            {!isAvailable && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Override Type</label>
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

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Reason (optional)</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for unavailability..."
                    rows={3}
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
              {loading ? 'Saving...' : 'Save Availability'}
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
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-950 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>Booking cutoff: <strong>30 minutes</strong> before slot time</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Override Types</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li><strong>Leave:</strong> Doctor is on planned leave</li>
              <li><strong>Emergency Block:</strong> Urgent unavailability</li>
              <li><strong>Custom Hours:</strong> Modified working hours</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
