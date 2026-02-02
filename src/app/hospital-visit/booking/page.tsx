'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, Phone, Mail, Send, CheckCircle2, AlertCircle, Loader2, UserCircle, X } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  designation: string;
  specialization: string | null;
  specializationCategory: string | null;
  image: string | null;
}

interface OfficialHoliday {
  id: number;
  date: string;
  name: string;
  reason: string | null;
}

const SPECIALIZATION_CATEGORIES = [
  { value: 'UROLOGIST', label: 'Urologist' },
  { value: 'NEPHROLOGIST', label: 'Nephrologist' },
  { value: 'ANAESTHETIC', label: 'Anaesthetic' },
  { value: 'RADIOLOGIST', label: 'Radiologist' },
];

interface Slot {
  slotNumber: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
  status: 'available' | 'booked' | 'unavailable' | 'disabled' | 'doctor_absent';
}

interface AvailabilityInfo {
  doctorId: number;
  doctorName: string;
  designation: string;
  image: string | null;
  date: string;
  isAvailable: boolean;
  availabilityNote: string | null;
  slots: Slot[];
  bookedCount: number;
  remainingSlots: number;
}

interface BookingConfirmation {
  id: number;
  doctorName: string;
  appointmentDate: string;
  slotStartTime: string;
  slotEndTime: string;
}

type Step = 'doctor' | 'datetime' | 'details' | 'confirm' | 'success';

export default function BookingPage() {
  // Step state
  const [currentStep, setCurrentStep] = useState<Step>('doctor');
  
  // Doctor selection
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  // Date and slot selection
  const [selectedDate, setSelectedDate] = useState('');
  const [availability, setAvailability] = useState<AvailabilityInfo | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  
  // Patient details
  const [patientDetails, setPatientDetails] = useState({
    fullName: '',
    cnic: '',
    phone: '',
    email: '',
    notes: '',
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);

  // Specialization filter
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  
  // Holidays
  const [holidays, setHolidays] = useState<OfficialHoliday[]>([]);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const MAX_BOOKING_DAYS_AHEAD = 7;

  // Fetch doctors on mount
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
      } finally {
        setLoadingDoctors(false);
      }
    }
    fetchDoctors();
  }, []);

  // Fetch holidays on mount
  useEffect(() => {
    async function fetchHolidays() {
      try {
        const res = await fetch('/api/appointments/holidays?upcoming=true&active=true');
        const data = await res.json();
        if (data.holidays) {
          setHolidays(data.holidays);
        }
      } catch (error) {
        console.error('Failed to fetch holidays:', error);
      }
    }
    fetchHolidays();
  }, []);

  // Fetch slots when doctor and date are selected
  const fetchSlots = useCallback(async () => {
    if (!selectedDoctor || !selectedDate) return;
    
    setLoadingSlots(true);
    setAvailability(null);
    setSelectedSlot(null);
    
    try {
      const res = await fetch(`/api/appointments/slots?doctorId=${selectedDoctor.id}&date=${selectedDate}`);
      const data = await res.json();
      
      if (res.ok) {
        setAvailability(data);
      } else {
        setAvailability(null);
      }
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedDoctor, selectedDate]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchSlots();
    }
  }, [selectedDoctor, selectedDate, fetchSlots]);

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const max = new Date(today);
    max.setDate(max.getDate() + MAX_BOOKING_DAYS_AHEAD);
    return max.toISOString().split('T')[0];
  };

  const toISODate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const getPakistanPublicHolidays = (year: number) => {
    const fixed = [
      `${year}-01-01`,
      `${year}-02-05`,
      `${year}-03-23`,
      `${year}-05-01`,
      `${year}-08-14`,
      `${year}-09-06`,
      `${year}-11-09`,
      `${year}-12-25`,
    ];
    return new Set(fixed);
  };

  // Check if date is an official holiday (admin-managed)
  const getOfficialHoliday = (dateStr: string): OfficialHoliday | null => {
    const holiday = holidays.find(h => {
      const holidayDate = new Date(h.date).toISOString().split('T')[0];
      return holidayDate === dateStr;
    });
    return holiday || null;
  };

  const isBookingDateDisabled = (dateStr: string) => {
    if (!dateStr) return true;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const date = new Date(`${dateStr}T00:00:00`);
    const max = new Date(today);
    max.setDate(max.getDate() + MAX_BOOKING_DAYS_AHEAD);
    if (date < today) return true;
    if (date > max) return true;
    const day = date.getDay();
    if (day === 0 || day === 6) return true;
    const staticHolidays = getPakistanPublicHolidays(date.getFullYear());
    if (staticHolidays.has(toISODate(date))) return true;
    // Check admin-managed holidays
    if (getOfficialHoliday(dateStr)) return true;
    return false;
  };

  // Get holiday reason for tooltip
  const getHolidayReason = (dateStr: string): string | null => {
    const officialHoliday = getOfficialHoliday(dateStr);
    if (officialHoliday) {
      return officialHoliday.reason || `Holiday: ${officialHoliday.name}`;
    }
    const staticHolidays = getPakistanPublicHolidays(new Date(dateStr).getFullYear());
    if (staticHolidays.has(dateStr)) {
      return 'Public Holiday';
    }
    return null;
  };

  // Filter doctors by specialization
  const filteredDoctors = selectedSpecialization
    ? doctors.filter(doc => doc.specializationCategory === selectedSpecialization)
    : doctors;

  // Group doctors by specialization for display
  const doctorsBySpecialization = SPECIALIZATION_CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = doctors.filter(doc => doc.specializationCategory === cat.value);
    return acc;
  }, {} as Record<string, Doctor[]>);

  // Doctors without specialization
  const doctorsWithoutSpecialization = doctors.filter(doc => !doc.specializationCategory);

  // Check if date is a weekday
  const isWeekday = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    return day >= 1 && day <= 5;
  };

  // Validate patient details
  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    
    if (!patientDetails.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (patientDetails.fullName.trim().length < 3) {
      newErrors.fullName = 'Full Name must be at least 3 characters';
    } else if (patientDetails.fullName.trim().length > 60) {
      newErrors.fullName = 'Full Name must be 60 characters or less';
    } else if (!/^[A-Za-z\s]+$/.test(patientDetails.fullName.trim())) {
      newErrors.fullName = 'Full Name must contain letters only';
    }
    
    if (!patientDetails.cnic.trim()) {
      newErrors.cnic = 'CNIC is required';
    } else if (!/^(\d{5}-\d{7}-\d|\d{13})$/.test(patientDetails.cnic.trim())) {
      newErrors.cnic = 'Enter CNIC in 13 digits or XXXXX-XXXXXXX-X format';
    }
    
    if (!patientDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{7,15}$/.test(patientDetails.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number';
    }
    
    if (!patientDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(patientDetails.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }
    
    if (!patientDetails.consent) {
      newErrors.consent = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle booking submission
  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const res = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          patientName: patientDetails.fullName.trim(),
          patientCnic: patientDetails.cnic.trim(),
          patientPhone: patientDetails.phone.trim(),
          patientEmail: patientDetails.email.trim().toLowerCase(),
          appointmentDate: selectedDate,
          slotNumber: selectedSlot.slotNumber,
          notes: patientDetails.notes.trim() || undefined,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setBookingConfirmation(data.appointment);
        setCurrentStep('success');
      } else {
        setSubmitError(data.error || 'Failed to book appointment');
      }
    } catch (error) {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const getArriveByTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    d.setMinutes(d.getMinutes() - 15);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return formatTime(`${hh}:${mm}`);
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get slot status color
  const getSlotColor = (slot: Slot) => {
    if (slot.status === 'available') return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200';
    if (slot.status === 'booked') return 'bg-red-100 border-red-300 text-red-600 cursor-not-allowed';
    if (slot.status === 'disabled') return 'bg-red-50 border-red-200 text-red-700 cursor-not-allowed';
    return 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed';
  };

  // Reset form
  const resetForm = () => {
    setCurrentStep('doctor');
    setSelectedDoctor(null);
    setSelectedDate('');
    setAvailability(null);
    setSelectedSlot(null);
    setPatientDetails({
      fullName: '',
      cnic: '',
      phone: '',
      email: '',
      notes: '',
      consent: false,
    });
    setErrors({});
    setSubmitError('');
    setBookingConfirmation(null);
  };

  return (
    <div>
      {/* Hero + Breadcrumb */}
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <nav className="text-xs sm:text-sm text-blue-100 mb-2" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 sm:gap-2">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <span>/</span>
              <li><Link href="/hospital-visit" className="hover:text-white">Hospital Visit</Link></li>
              <span>/</span>
              <li className="text-white font-medium">Book Appointment</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Book an Appointment</h1>
          <p className="text-sm sm:text-lg text-blue-100 max-w-2xl">
            Book your private appointment at AFIU. Available Monday to Friday, 3:00 PM - 6:00 PM.
            Maximum 10 appointments per doctor per day.
          </p>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mt-2">
            Please arrive at least 15 minutes before your appointment time.
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-6 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-2xl mx-auto">
            {['doctor', 'datetime', 'details', 'confirm'].map((step, idx) => {
              const steps = ['doctor', 'datetime', 'details', 'confirm'];
              const currentIdx = steps.indexOf(currentStep);
              const isActive = step === currentStep;
              const isCompleted = idx < currentIdx || currentStep === 'success';
              
              return (
                <div key={step} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${isActive ? 'bg-blue-950 text-white' : ''}
                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                    ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
                  `}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  {idx < 3 && (
                    <div className={`w-8 sm:w-16 h-1 mx-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-4 sm:gap-12 mt-2 text-xs sm:text-sm text-gray-600">
            <span>Doctor</span>
            <span>Date & Time</span>
            <span>Details</span>
            <span>Confirm</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Step 1: Select Doctor */}
            {currentStep === 'doctor' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Select a Doctor</h2>
                
                {/* Specialization Filter */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Filter by Specialization</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedSpecialization('')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedSpecialization === ''
                          ? 'bg-blue-950 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All Doctors
                    </button>
                    {SPECIALIZATION_CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setSelectedSpecialization(cat.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedSpecialization === cat.value
                            ? 'bg-blue-950 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat.label} ({doctorsBySpecialization[cat.value]?.length || 0})
                      </button>
                    ))}
                  </div>
                </div>
                
                {loadingDoctors ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-blue-950" size={32} />
                  </div>
                ) : doctors.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No doctors available at the moment.
                  </div>
                ) : selectedSpecialization ? (
                  /* Filtered view - show only selected specialization */
                  <div>
                    {filteredDoctors.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No doctors found for this specialization.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredDoctors.map((doctor) => (
                          <button
                            key={doctor.id}
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setCurrentStep('datetime');
                            }}
                            className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                          >
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                              {doctor.image ? (
                                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                              ) : (
                                <UserCircle size={40} className="text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                              <p className="text-sm text-gray-600">{doctor.designation}</p>
                              {doctor.specializationCategory && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {SPECIALIZATION_CATEGORIES.find(c => c.value === doctor.specializationCategory)?.label}
                                </span>
                              )}
                              {doctor.specialization && doctor.specialization !== 'no data' && (
                                <p className="text-xs text-gray-500 mt-1">{doctor.specialization}</p>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Grouped view - show all doctors grouped by specialization */
                  <div className="space-y-8">
                    {SPECIALIZATION_CATEGORIES.map((cat) => {
                      const categoryDoctors = doctorsBySpecialization[cat.value];
                      if (!categoryDoctors || categoryDoctors.length === 0) return null;
                      
                      return (
                        <div key={cat.value}>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="w-3 h-3 bg-blue-950 rounded-full"></span>
                            {cat.label}s ({categoryDoctors.length})
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categoryDoctors.map((doctor) => (
                              <button
                                key={doctor.id}
                                onClick={() => {
                                  setSelectedDoctor(doctor);
                                  setCurrentStep('datetime');
                                }}
                                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                              >
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                  {doctor.image ? (
                                    <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <UserCircle size={40} className="text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                                  <p className="text-sm text-gray-600">{doctor.designation}</p>
                                  {doctor.specialization && doctor.specialization !== 'no data' && (
                                    <p className="text-xs text-gray-500 mt-1">{doctor.specialization}</p>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Doctors without specialization */}
                    {doctorsWithoutSpecialization.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                          Other Specialists ({doctorsWithoutSpecialization.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {doctorsWithoutSpecialization.map((doctor) => (
                            <button
                              key={doctor.id}
                              onClick={() => {
                                setSelectedDoctor(doctor);
                                setCurrentStep('datetime');
                              }}
                              className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                            >
                              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                {doctor.image ? (
                                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                                ) : (
                                  <UserCircle size={40} className="text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                                <p className="text-sm text-gray-600">{doctor.designation}</p>
                                {doctor.specialization && doctor.specialization !== 'no data' && (
                                  <p className="text-xs text-gray-500 mt-1">{doctor.specialization}</p>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Select Date & Time */}
            {currentStep === 'datetime' && selectedDoctor && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Select Date & Time</h2>
                  <button
                    onClick={() => setCurrentStep('doctor')}
                    className="text-blue-950 hover:underline text-sm"
                  >
                    ← Change Doctor
                  </button>
                </div>

                {/* Selected Doctor Info */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {selectedDoctor.image ? (
                      <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle size={30} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedDoctor.name}</h3>
                    <p className="text-sm text-gray-600">{selectedDoctor.designation}</p>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    <Calendar size={18} className="inline mr-2" />
                    Select Date (Monday - Friday only)
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={getMinDate()}
                    max={getMaxDate()}
                    onChange={(e) => {
                      const date = e.target.value;
                      if (!date) {
                        setSelectedDate('');
                        return;
                      }

                      if (isBookingDateDisabled(date)) {
                        setSelectedDate('');
                        alert('This date is disabled. Please select a weekday (Mon-Fri), within the next 7 days, excluding holidays.');
                        return;
                      }

                      if (isWeekday(date)) {
                        setSelectedDate(date);
                      } else {
                        setSelectedDate('');
                        alert('Please select a weekday (Monday to Friday)');
                      }
                    }}
                    className="w-full max-w-xs rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                </div>

                {/* Slots */}
                {selectedDate && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-3">
                      <Clock size={18} className="inline mr-2" />
                      Available Slots for {formatDate(selectedDate)}
                    </h3>
                    
                    {loadingSlots ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin text-blue-950" size={24} />
                      </div>
                    ) : !availability ? (
                      <div className="text-center py-8 text-gray-500">
                        Unable to load slots. Please select a valid weekday.
                      </div>
                    ) : !availability.isAvailable ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        <AlertCircle className="inline mr-2" size={18} />
                        {availability.availabilityNote || 'Doctor is not available on this date'}
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 text-sm text-gray-600">
                          {availability.remainingSlots} of {availability.slots.length} slots available
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {availability.slots.map((slot) => (
                            <button
                              key={slot.slotNumber}
                              disabled={!slot.isAvailable}
                              onClick={() => setSelectedSlot(slot)}
                              className={`
                                p-3 rounded-lg border text-center transition-all
                                ${getSlotColor(slot)}
                                ${selectedSlot?.slotNumber === slot.slotNumber ? 'ring-2 ring-blue-950' : ''}
                              `}
                            >
                              <div className="font-medium">{formatTime(slot.startTime)}</div>
                              <div className="text-xs">to {formatTime(slot.endTime)}</div>
                              {slot.status === 'booked' && <div className="text-xs mt-1">Booked</div>}
                              {slot.status === 'disabled' && <div className="text-xs mt-1">Disabled</div>}
                            </button>
                          ))}
                        </div>
                        
                        {selectedSlot && (
                          <div className="mt-6">
                            <button
                              onClick={() => setCurrentStep('details')}
                              className="bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                              Continue with {formatTime(selectedSlot.startTime)} slot
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Patient Details */}
            {currentStep === 'details' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Your Details</h2>
                  <button
                    onClick={() => setCurrentStep('datetime')}
                    className="text-blue-950 hover:underline text-sm"
                  >
                    ← Change Slot
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={patientDetails.fullName}
                          maxLength={60}
                          onChange={(e) =>
                            setPatientDetails((prev) => ({
                              ...prev,
                              fullName: e.target.value.replace(/[^a-zA-Z\s]/g, ''),
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-950"
                        />
                      </div>
                      {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">CNIC *</label>
                      <input
                        type="text"
                        placeholder="XXXXX-XXXXXXX-X"
                        value={patientDetails.cnic}
                        maxLength={15}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 13);
                          const formatted =
                            digits.length <= 5
                              ? digits
                              : digits.length <= 12
                                ? `${digits.slice(0, 5)}-${digits.slice(5)}`
                                : `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
                          setPatientDetails((prev) => ({ ...prev, cnic: formatted }));
                        }}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-950"
                      />
                      {errors.cnic && <p className="mt-1 text-sm text-red-600">{errors.cnic}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={patientDetails.phone}
                          maxLength={15}
                          onChange={(e) =>
                            setPatientDetails((prev) => ({
                              ...prev,
                              phone: e.target.value.replace(/\D/g, '').slice(0, 15),
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-950"
                        />
                      </div>
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={patientDetails.email}
                          onChange={(e) => setPatientDetails(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-950"
                        />
                      </div>
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Notes (optional)</label>
                    <textarea
                      rows={3}
                      value={patientDetails.notes}
                      onChange={(e) => setPatientDetails(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any relevant medical history or special requests"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-950"
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="consent"
                      type="checkbox"
                      checked={patientDetails.consent}
                      onChange={(e) => setPatientDetails(prev => ({ ...prev, consent: e.target.checked }))}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-blue-950"
                    />
                    <label htmlFor="consent" className="text-sm text-gray-700">
                      I confirm that the above information is accurate and consent to be contacted by AFIU for appointment confirmation.
                    </label>
                  </div>
                  {errors.consent && <p className="text-sm text-red-600">{errors.consent}</p>}

                  <button
                    onClick={() => {
                      if (validateDetails()) {
                        setCurrentStep('confirm');
                      }
                    }}
                    className="bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Review Booking
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 'confirm' && selectedDoctor && selectedSlot && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Your Booking</h2>

                {submitError && (
                  <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                    <p>{submitError}</p>
                    <button onClick={() => setSubmitError('')} className="ml-auto">
                      <X size={18} />
                    </button>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Appointment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Doctor:</span>
                      <p className="font-medium">{selectedDoctor.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <p className="font-medium">{formatDate(selectedDate)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Time:</span>
                      <p className="font-medium">{formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Arrive by:</span>
                      <p className="font-medium">{getArriveByTime(selectedSlot.startTime)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <p className="font-medium">15 minutes</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Patient Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <p className="font-medium">{patientDetails.fullName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">CNIC:</span>
                      <p className="font-medium">{patientDetails.cnic}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-medium">{patientDetails.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium">{patientDetails.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep('details')}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-950 hover:bg-blue-700 disabled:opacity-75 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Success */}
            {currentStep === 'success' && bookingConfirmation && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={48} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointment Booked Successfully!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Your appointment has been confirmed. Please arrive 15 minutes before your scheduled time.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto mb-8">
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Booking ID:</span>
                      <span className="font-medium">#{bookingConfirmation.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Doctor:</span>
                      <span className="font-medium">{bookingConfirmation.doctorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date:</span>
                      <span className="font-medium">{formatDate(bookingConfirmation.appointmentDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Time:</span>
                      <span className="font-medium">
                        {formatTime(bookingConfirmation.slotStartTime)} - {formatTime(bookingConfirmation.slotEndTime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Arrive by:</span>
                      <span className="font-medium">{getArriveByTime(bookingConfirmation.slotStartTime)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Book Another
                  </button>
                  <Link
                    href="/"
                    className="px-6 py-3 bg-blue-950 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Go to Home
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg text-center shadow-sm">
              <Phone size={32} className="text-blue-950 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 mb-1">Call Us</h3>
              <p className="text-gray-600 text-sm">+92 51 5562331</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-sm">
              <Clock size={32} className="text-blue-950 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 mb-1">Private Hours</h3>
              <p className="text-gray-600 text-sm">Mon-Fri: 3:00 PM - 6:00 PM</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-sm">
              <Calendar size={32} className="text-blue-950 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 mb-1">Max Appointments</h3>
              <p className="text-gray-600 text-sm">10 per doctor per day</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
