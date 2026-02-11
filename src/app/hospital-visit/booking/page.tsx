'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, Phone, Mail, Send, CheckCircle2, AlertCircle, Loader2, UserCircle, X, ChevronDown } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  designation: string;
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
    countryCode: '+92',
    phone: '',
    email: '',
    notes: '',
    consent: false,
  });

  // Common country codes with phone format details
  const COUNTRY_CODES = [
    { code: '+92', country: 'Pakistan', flag: '🇵🇰', placeholder: '3001234567', minLen: 10, maxLen: 10, format: '10 digits' },
    { code: '+1', country: 'USA/Canada', flag: '🇺🇸', placeholder: '2025551234', minLen: 10, maxLen: 10, format: '10 digits' },
    { code: '+44', country: 'UK', flag: '🇬🇧', placeholder: '7911123456', minLen: 10, maxLen: 11, format: '10-11 digits' },
    { code: '+971', country: 'UAE', flag: '🇦🇪', placeholder: '501234567', minLen: 9, maxLen: 9, format: '9 digits' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', placeholder: '512345678', minLen: 9, maxLen: 9, format: '9 digits' },
    { code: '+974', country: 'Qatar', flag: '🇶🇦', placeholder: '55123456', minLen: 8, maxLen: 8, format: '8 digits' },
    { code: '+965', country: 'Kuwait', flag: '🇰🇼', placeholder: '51234567', minLen: 8, maxLen: 8, format: '8 digits' },
    { code: '+968', country: 'Oman', flag: '🇴🇲', placeholder: '92123456', minLen: 8, maxLen: 8, format: '8 digits' },
    { code: '+973', country: 'Bahrain', flag: '🇧🇭', placeholder: '36001234', minLen: 8, maxLen: 8, format: '8 digits' },
    { code: '+91', country: 'India', flag: '🇮🇳', placeholder: '9876543210', minLen: 10, maxLen: 10, format: '10 digits' },
    { code: '+86', country: 'China', flag: '🇨🇳', placeholder: '13812345678', minLen: 11, maxLen: 11, format: '11 digits' },
    { code: '+61', country: 'Australia', flag: '🇦🇺', placeholder: '412345678', minLen: 9, maxLen: 9, format: '9 digits' },
    { code: '+49', country: 'Germany', flag: '🇩🇪', placeholder: '15123456789', minLen: 10, maxLen: 11, format: '10-11 digits' },
    { code: '+33', country: 'France', flag: '🇫🇷', placeholder: '612345678', minLen: 9, maxLen: 9, format: '9 digits' },
    { code: '+39', country: 'Italy', flag: '🇮🇹', placeholder: '3123456789', minLen: 9, maxLen: 10, format: '9-10 digits' },
    { code: '+34', country: 'Spain', flag: '🇪🇸', placeholder: '612345678', minLen: 9, maxLen: 9, format: '9 digits' },
    { code: '+90', country: 'Turkey', flag: '🇹🇷', placeholder: '5321234567', minLen: 10, maxLen: 10, format: '10 digits' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾', placeholder: '123456789', minLen: 9, maxLen: 10, format: '9-10 digits' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬', placeholder: '81234567', minLen: 8, maxLen: 8, format: '8 digits' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷', placeholder: '1012345678', minLen: 9, maxLen: 10, format: '9-10 digits' },
  ];

  // Get current country config
  const getCurrentCountryConfig = () => {
    return COUNTRY_CODES.find(c => c.code === patientDetails.countryCode) || COUNTRY_CODES[0];
  };
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);

  // Calendar open state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Specialization filter
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  
  // Doctor search
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  
  // Holidays
  const [holidays, setHolidays] = useState<OfficialHoliday[]>([]);

  // OTP verification state
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [verifiedEmail, setVerifiedEmail] = useState(''); // Track which email was verified
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Returning user state
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [savedUserDetails, setSavedUserDetails] = useState<{
    fullName: string;
    cnic: string;
    phone: string;
  } | null>(null);
  const [lookingUpUser, setLookingUpUser] = useState(false);

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const DISPOSABLE_EMAIL_DOMAINS = new Set([
    'mailinator.com',
    'guerrillamail.com',
    'guerrillamail.info',
    '10minutemail.com',
    'temp-mail.org',
    'yopmail.com',
    'getnada.com',
    'trashmail.com',
  ]);

  const getEmailValidationError = (rawEmail: string) => {
    const email = rawEmail.trim();
    if (!email) return 'Email is required';

    if (email.length < 6 || email.length > 254) return 'Email must be between 6 and 254 characters';
    if (!EMAIL_REGEX.test(email)) return 'Enter a valid email address';
    if (email.includes('..')) return 'Enter a valid email address';

    const atIndex = email.indexOf('@');
    if (atIndex === -1) return 'Enter a valid email address';
    const local = email.slice(0, atIndex);
    const domain = email.slice(atIndex + 1).toLowerCase();

    if (!local || !domain) return 'Enter a valid email address';
    if (local.length > 64) return 'Enter a valid email address';
    if (local.startsWith('.') || local.endsWith('.')) return 'Enter a valid email address';
    if (domain.includes('..')) return 'Enter a valid email address';
    if (!domain.includes('.')) return 'Enter a valid email address';
    if (domain.length > 253) return 'Enter a valid email address';
    for (const d of DISPOSABLE_EMAIL_DOMAINS) {
      if (domain === d || domain.endsWith(`.${d}`)) {
        return 'Disposable email addresses are not allowed';
      }
    }

    const labels = domain.split('.');
    const tld = labels[labels.length - 1] || '';
    if (!/^[a-zA-Z]{2,63}$/.test(tld)) return 'Enter a valid email address';

    for (const label of labels) {
      if (label.length < 1 || label.length > 63) return 'Enter a valid email address';
      if (!/^[a-zA-Z0-9-]+$/.test(label)) return 'Enter a valid email address';
      if (label.startsWith('-') || label.endsWith('-')) return 'Enter a valid email address';
    }

    return '';
  };

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

  // OTP countdown timer
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown]);

  // Reset OTP state if email changes
  useEffect(() => {
    if (patientDetails.email.toLowerCase() !== verifiedEmail.toLowerCase()) {
      setOtpVerified(false);
      setOtpSent(false);
      setOtpValue('');
      setOtpError('');
    }
  }, [patientDetails.email, verifiedEmail]);

  // Lookup returning user when email is entered (debounced)
  useEffect(() => {
    const email = patientDetails.email.trim().toLowerCase();
    const emailError = getEmailValidationError(email);
    
    // Only lookup if email is valid
    if (emailError || !email) {
      setIsReturningUser(false);
      setSavedUserDetails(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLookingUpUser(true);
      try {
        const res = await fetch(`/api/appointments/user-lookup?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        
        if (data.found && data.user) {
          setIsReturningUser(true);
          // Extract phone number without country code for proper field handling
          let phoneNumber = data.user.phone || '';
          let countryCode = '+92';
          
          // Try to match country code
          for (const cc of COUNTRY_CODES) {
            if (phoneNumber.startsWith(cc.code)) {
              countryCode = cc.code;
              phoneNumber = phoneNumber.slice(cc.code.length);
              break;
            }
          }
          
          setSavedUserDetails({
            fullName: data.user.fullName || '',
            cnic: data.user.cnic || '',
            phone: phoneNumber,
          });
          
          // Auto-fill the details for returning user
          setPatientDetails(prev => ({
            ...prev,
            fullName: data.user.fullName || prev.fullName,
            cnic: data.user.cnic || prev.cnic,
            phone: phoneNumber || prev.phone,
            countryCode: countryCode,
          }));
          
          // For returning users with unchanged info, mark as verified
          setOtpVerified(true);
          setVerifiedEmail(email);
        } else {
          setIsReturningUser(false);
          setSavedUserDetails(null);
        }
      } catch (error) {
        console.error('Failed to lookup user:', error);
        setIsReturningUser(false);
        setSavedUserDetails(null);
      } finally {
        setLookingUpUser(false);
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientDetails.email]);

  // Check if returning user changed their info (requires re-verification)
  const hasInfoChanged = useCallback(() => {
    if (!isReturningUser || !savedUserDetails) return false;
    
    const currentName = patientDetails.fullName.trim();
    const currentCnic = patientDetails.cnic.trim();
    const currentPhone = patientDetails.phone.trim();
    
    return (
      currentName !== savedUserDetails.fullName ||
      currentCnic !== savedUserDetails.cnic ||
      currentPhone !== savedUserDetails.phone
    );
  }, [isReturningUser, savedUserDetails, patientDetails.fullName, patientDetails.cnic, patientDetails.phone]);

  // If returning user changes info, require re-verification
  useEffect(() => {
    if (isReturningUser && hasInfoChanged()) {
      setOtpVerified(false);
    } else if (isReturningUser && !hasInfoChanged() && verifiedEmail === patientDetails.email.trim().toLowerCase()) {
      setOtpVerified(true);
    }
  }, [isReturningUser, hasInfoChanged, verifiedEmail, patientDetails.email]);

  // Send OTP function
  const handleSendOTP = async () => {
    const email = patientDetails.email.trim();
    const error = getEmailValidationError(email);
    if (error) {
      setOtpError(error);
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const res = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email, purpose: 'booking' }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setOtpSent(true);
        setOtpCountdown(60);
        setOtpValue('');
        setVerifiedEmail(email);
      } else {
        setOtpError(data.error || 'Failed to send OTP');
      }
    } catch {
      setOtpError('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP function
  const handleVerifyOTP = async () => {
    const email = patientDetails.email.trim();
    if (otpValue.length !== 6) {
      setOtpError('Please enter the 6-digit code');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const res = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, otp: otpValue, purpose: 'booking' }),
      });
      const data = await res.json();

      if (res.ok && data.verified) {
        setOtpVerified(true);
        setVerifiedEmail(email.toLowerCase());
        setOtpError('');
      } else {
        setOtpError(data.error || 'Invalid verification code');
      }
    } catch {
      setOtpError('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

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

  // Filter doctors by specialization and search query
  const filteredDoctors = doctors.filter(doc => {
    const matchesSpecialization = !selectedSpecialization || doc.specializationCategory === selectedSpecialization;
    const matchesSearch = !doctorSearchQuery || 
      doc.name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
      (doc.designation && doc.designation.toLowerCase().includes(doctorSearchQuery.toLowerCase()));
    return matchesSpecialization && matchesSearch;
  });

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
  const validateDetails = (details = patientDetails) => {
    const newErrors: Record<string, string> = {};
    
    if (!details.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (details.fullName.trim().length < 3) {
      newErrors.fullName = 'Full Name must be at least 3 characters';
    } else if (details.fullName.trim().length > 60) {
      newErrors.fullName = 'Full Name must be 60 characters or less';
    } else if (!/^[A-Za-z\s]+$/.test(details.fullName.trim())) {
      newErrors.fullName = 'Full Name must contain letters only';
    }
    
    if (!details.cnic.trim()) {
      newErrors.cnic = 'CNIC is required';
    } else if (!/^(\d{5}-\d{7}-\d|\d{13})$/.test(details.cnic.trim())) {
      newErrors.cnic = 'Enter CNIC in 13 digits or XXXXX-XXXXXXX-X format';
    }
    
    const countryConfig = COUNTRY_CODES.find(c => c.code === details.countryCode) || COUNTRY_CODES[0];
    if (!details.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!/^\d+$/.test(details.phone.trim())) {
      newErrors.phone = 'Mobile number must contain only digits';
    } else if (details.phone.trim().length < countryConfig.minLen || details.phone.trim().length > countryConfig.maxLen) {
      newErrors.phone = `Enter ${countryConfig.format} for ${countryConfig.country}`;
    }
    
    if (!details.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailError = getEmailValidationError(details.email);
      if (emailError) {
        newErrors.email = emailError;
      } else if (isReturningUser && !hasInfoChanged()) {
        // Returning user with unchanged info - no OTP required
        // Don't add error
      } else if (!otpVerified || details.email.trim().toLowerCase() !== verifiedEmail.toLowerCase()) {
        newErrors.email = 'Please verify your email address';
      }
    }
    
    if (!details.consent) {
      newErrors.consent = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle booking submission
  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) return;

    if (!validateDetails()) {
      setCurrentStep('details');
      return;
    }
    
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
          patientPhone: `${patientDetails.countryCode}${patientDetails.phone.trim()}`,
          patientEmail: patientDetails.email.trim().toLowerCase(),
          appointmentDate: selectedDate,
          slotNumber: selectedSlot.slotNumber,
          notes: patientDetails.notes.trim() || undefined,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setBookingConfirmation(data.appointment);

        // Refresh slots so this slot is immediately marked as booked
        // (useful if user goes back or tries to book another slot).
        await fetchSlots();

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
      countryCode: '+92',
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
            Book your private appointment at AFIU.<br></br>
            Available Monday to Friday, 3:00 PM - 6:00 PM.
           
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
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Select a Doctor</h2>
                    <select
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                      className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    >
                      <option value="">All Doctors</option>
                      {SPECIALIZATION_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Search bar */}
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by doctor name or designation..."
                      value={doctorSearchQuery}
                      onChange={(e) => setDoctorSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                    {doctorSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setDoctorSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    )}
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
                ) : filteredDoctors.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No doctors found matching your search.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        </div>
                      </button>
                    ))}
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

                {/* Date Selection - Custom Calendar */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    <Calendar size={18} className="inline mr-2" />
                    Select Date (Monday - Friday only)
                  </label>
                  
                  {/* Date Input Field - Click to open calendar */}
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="w-full max-w-md flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-blue-500 focus:ring-2 focus:ring-blue-950 focus:border-transparent transition-all text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-gray-400" />
                      {selectedDate ? (
                        <span className="text-gray-800">{formatDate(selectedDate)}</span>
                      ) : (
                        <span className="text-gray-400">Click to select a date</span>
                      )}
                    </div>
                    <ChevronDown 
                      size={18} 
                      className={`text-gray-400 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  
                  {/* Custom Calendar Grid - Collapsible */}
                  {isCalendarOpen && (
                    <div className="mt-2 bg-white border border-gray-200 rounded-lg p-4 max-w-md shadow-lg">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-gray-800">
                          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      
                      {/* Day Headers */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      {/* Calendar Days */}
                      <div className="grid grid-cols-7 gap-1">
                        {(() => {
                          const today = new Date();
                          const year = today.getFullYear();
                          const month = today.getMonth();
                          const firstDay = new Date(year, month, 1).getDay();
                          const firstDayIndexMondayStart = (firstDay + 6) % 7;
                          const daysInMonth = new Date(year, month + 1, 0).getDate();
                          const days = [];
                          
                          // Empty cells for days before first of month
                          for (let i = 0; i < firstDayIndexMondayStart; i++) {
                            days.push(<div key={`empty-${i}`} className="p-2"></div>);
                          }
                          
                          // Days of the month
                          for (let day = 1; day <= daysInMonth; day++) {
                            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isDisabled = isBookingDateDisabled(dateStr);
                            const holiday = getOfficialHoliday(dateStr);
                            const isSelected = selectedDate === dateStr;
                            const isToday = day === today.getDate();
                            const dateObj = new Date(dateStr);
                            const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                            const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                            
                            days.push(
                              <div key={day} className="relative group">
                                <button
                                  type="button"
                                  disabled={isDisabled}
                                  onClick={() => {
                                    if (!isDisabled) {
                                      setSelectedDate(dateStr);
                                      setIsCalendarOpen(false); // Auto-close after selection
                                    }
                                  }}
                                  className={`
                                    w-full p-2 text-sm rounded-lg transition-all
                                    ${isSelected ? 'bg-blue-950 text-white font-semibold' : ''}
                                    ${holiday && !isSelected ? 'bg-yellow-100 text-yellow-800 font-medium' : ''}
                                    ${isToday && !isSelected && !holiday ? 'bg-blue-100 text-blue-800 font-medium' : ''}
                                    ${isWeekend && !isSelected ? 'text-gray-300' : ''}
                                    ${isPast && !isSelected ? 'text-gray-300' : ''}
                                    ${isDisabled && !holiday ? 'text-gray-300 cursor-not-allowed' : ''}
                                    ${!isDisabled && !isSelected && !holiday && !isToday ? 'hover:bg-gray-100 text-gray-700' : ''}
                                    ${isDisabled && holiday ? 'cursor-not-allowed' : ''}
                                  `}
                                >
                                  {day}
                                </button>
                                
                                {/* Tooltip for holidays */}
                                {holiday && (
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                    <div className="font-semibold">{holiday.name}</div>
                                    {holiday.reason && <div className="text-gray-300">{holiday.reason}</div>}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                  </div>
                                )}
                              </div>
                            );
                          }
                          
                          return days;
                        })()}
                      </div>
                      
                      {/* Legend */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                          <span>Holiday</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 bg-blue-950 rounded"></div>
                          <span>Selected</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 bg-blue-100 rounded"></div>
                          <span>Today</span>
                        </div>
                      </div>
                    </div>
                  )}
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
                        {availability.availabilityNote ? (
                          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800 text-sm">
                            <AlertCircle className="inline mr-2" size={16} />
                            {availability.availabilityNote}
                          </div>
                        ) : null}
                        <div className="mb-4 text-sm text-gray-600">
                          {availability.slots.filter((s) => s.isAvailable).length} of {availability.slots.length} slots available
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
                              {slot.status === 'disabled' && <div className="text-xs mt-1">Closed - Bookings closed 45 minutes prior</div>}
                            </button>
                          ))}
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-3">
                          Bookings close 45 minutes before the appointment time.
                        </p>
                        
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
                  {/* Email Address - First field for returning user lookup */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email Address *
                      {lookingUpUser && (
                        <span className="ml-2 inline-flex items-center text-blue-600 text-sm font-normal">
                          <Loader2 size={14} className="mr-1 animate-spin" /> Checking...
                        </span>
                      )}
                      {!lookingUpUser && isReturningUser && !hasInfoChanged() && (
                        <span className="ml-2 inline-flex items-center text-green-600 text-sm font-normal">
                          <CheckCircle2 size={14} className="mr-1" /> Welcome back!
                        </span>
                      )}
                      {!lookingUpUser && isReturningUser && hasInfoChanged() && (
                        <span className="ml-2 inline-flex items-center text-orange-600 text-sm font-normal">
                          <AlertCircle size={14} className="mr-1" /> Info changed - verify email
                        </span>
                      )}
                      {!lookingUpUser && !isReturningUser && otpVerified && patientDetails.email.trim().toLowerCase() === verifiedEmail.toLowerCase() && (
                        <span className="ml-2 inline-flex items-center text-green-600 text-sm font-normal">
                          <CheckCircle2 size={14} className="mr-1" /> Verified
                        </span>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          placeholder="example@email.com"
                          value={patientDetails.email}
                          onChange={(e) => {
                            const value = e.target.value;
                            setPatientDetails((prev) => ({ ...prev, email: value }));
                            setErrors((prev) => ({ ...prev, email: '' }));
                          }}
                          onBlur={() => {
                            const emailError = getEmailValidationError(patientDetails.email);
                            if (emailError) setErrors((prev) => ({ ...prev, email: emailError }));
                          }}
                          disabled={otpVerified && !hasInfoChanged() && patientDetails.email.trim().toLowerCase() === verifiedEmail.toLowerCase()}
                          className={`w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-950 ${
                            otpVerified && !hasInfoChanged() && patientDetails.email.trim().toLowerCase() === verifiedEmail.toLowerCase()
                              ? 'bg-green-50 border-green-300'
                              : ''
                          }`}
                        />
                      </div>
                      {/* Show verify button only if: not verified, or info changed for returning user */}
                      {(!otpVerified || (isReturningUser && hasInfoChanged())) && patientDetails.email.trim().toLowerCase() !== verifiedEmail.toLowerCase() || (isReturningUser && hasInfoChanged() && !otpVerified) ? (
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={
                            otpLoading ||
                            otpCountdown > 0 ||
                            !patientDetails.email.trim() ||
                            !!getEmailValidationError(patientDetails.email)
                          }
                          className="px-4 py-3 bg-blue-950 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {otpLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : otpCountdown > 0 ? (
                            `Resend (${otpCountdown}s)`
                          ) : otpSent ? (
                            'Resend Code'
                          ) : (
                            'Verify Email'
                          )}
                        </button>
                      ) : null}
                    </div>
                    
                    {/* OTP Input Section */}
                    {otpSent && !otpVerified && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800 mb-3">
                          We&apos;ve sent a 6-digit verification code to <strong>{patientDetails.email}</strong>
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={otpValue}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                              setOtpValue(value);
                              setOtpError('');
                            }}
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-center text-lg tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-blue-950"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOTP}
                            disabled={otpLoading || otpValue.length !== 6}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {otpLoading ? <Loader2 size={18} className="animate-spin" /> : 'Verify'}
                          </button>
                        </div>
                        {otpError && <p className="mt-2 text-sm text-red-600">{otpError}</p>}
                        <p className="mt-2 text-xs text-gray-500">
                          The code will expire in 10 minutes. Check your spam folder if you don&apos;t see the email.
                        </p>
                      </div>
                    )}

                    {!otpSent && otpError ? <p className="mt-2 text-sm text-red-600">{otpError}</p> : null}
                    
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  {/* Full Name and CNIC */}
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

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Mobile Number *
                      <span className="ml-2 text-xs text-gray-500 font-normal">
                        ({getCurrentCountryConfig().format})
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <select
                          value={patientDetails.countryCode}
                          onChange={(e) => {
                            setPatientDetails((prev) => ({
                              ...prev,
                              countryCode: e.target.value,
                              phone: '', // Clear phone when country changes
                            }));
                            setErrors((prev) => ({ ...prev, phone: '' }));
                          }}
                          className="h-full rounded-lg border border-gray-300 px-3 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-950 appearance-none bg-white text-sm"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="relative flex-1">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          placeholder={getCurrentCountryConfig().placeholder}
                          value={patientDetails.phone}
                          maxLength={getCurrentCountryConfig().maxLen}
                          onChange={(e) =>
                            setPatientDetails((prev) => ({
                              ...prev,
                              phone: e.target.value.replace(/\D/g, '').slice(0, getCurrentCountryConfig().maxLen),
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-950"
                        />
                      </div>
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
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
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const nextDetails = { ...patientDetails, consent: checked };
                        setPatientDetails(nextDetails);
                        if (checked && currentStep === 'details') {
                          if (validateDetails(nextDetails)) {
                            setCurrentStep('confirm');
                          }
                        }
                      }}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-blue-950"
                    />
                    <label htmlFor="consent" className="text-sm text-gray-700">
                      I hereby confirm that the above information is accurate and I give my consent to be contacted by AFIU for appointment confirmation.
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <p className="font-medium">{patientDetails.fullName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium">{patientDetails.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Mobile Number:</span>
                      <p className="font-medium">{`${patientDetails.countryCode}${patientDetails.phone}`}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
          </div>
        </div>
      </section>
    </div>
  );
}
