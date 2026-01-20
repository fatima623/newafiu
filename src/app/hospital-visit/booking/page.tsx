'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, Phone, Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';

type FormData = {
  fullName: string;
  cnic: string;
  phone: string;
  email: string;
  department: string;
  doctor: string;
  date: string;
  time: string;
  notes: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function BookingPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    cnic: '',
    phone: '',
    email: '',
    department: '',
    doctor: '',
    date: '',
    time: '',
    notes: '',
    consent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const validate = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (data.fullName.trim().length < 3) {
      newErrors.fullName = 'Full Name must be at least 3 characters.';
    }

    if (!data.cnic.trim()) {
      newErrors.cnic = 'CNIC is required.';
    } else if (!/^\d{5}-\d{7}-\d$/.test(data.cnic.trim()) && !/^\d{13}$/.test(data.cnic.trim())) {
      newErrors.cnic = 'Enter CNIC in 13 digits or XXXXX-XXXXXXX-X format.';
    }

    if (!data.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\+?\d{7,15}$/.test(data.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number.';
    }

    if (!data.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!data.department) {
      newErrors.department = 'Please select a department.';
    }

    if (!data.doctor) {
      newErrors.doctor = 'Please select a doctor.';
    }

    if (!data.date) {
      newErrors.date = 'Please select a date.';
    } else {
      const selected = new Date(data.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.date = 'Date cannot be in the past.';
      }
    }

    if (!data.time) {
      newErrors.time = 'Please select a time.';
    }

    if (!data.consent) {
      newErrors.consent = 'You must agree before submitting.';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);

    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});
    setSubmitSuccess(true);
    setIsSubmitting(false);

    setFormData({
      fullName: '',
      cnic: '',
      phone: '',
      email: '',
      department: '',
      doctor: '',
      date: '',
      time: '',
      notes: '',
      consent: false,
    });
  };

  return (
    <div>
      {/* Hero + Breadcrumb */}
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <nav className="text-xs sm:text-sm text-blue-100 mb-2" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 sm:gap-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <span>/</span>
              <li>
                <Link href="/hospital-visit" className="hover:text-white">
                  Hospital Visit
                </Link>
              </li>
              <span>/</span>
              <li className="text-blue-100">Book Appointment</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Book an Appointment</h1>
          <p className="text-sm sm:text-lg text-blue-100 max-w-2xl">
            Book your appointment at AFIU quickly and securely. Fill in the details below and our team will contact you to
            confirm your visit.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Info cards row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-[#ADD8E6] p-6 rounded-lg text-center">
                <Phone size={32} className="text-blue-950 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 mb-1">Call Us</h3>
                <p className="text-gray-700 text-sm">
                  +92 51 5562331
                  <br />
                  OPD / Appointments Desk
                </p>
              </div>

              <div className="bg-[#ADD8E6] p-6 rounded-lg text-center">
                <Mail size={32} className="text-blue-950 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 mb-1">Email Us</h3>
                <p className="text-gray-700 text-sm">
                  afiu@outlook.com
                  <br />
                  appointments@afiu.org.pk
                </p>
              </div>

              <div className="bg-[#ADD8E6] p-6 rounded-lg text-center">
                <Clock size={32} className="text-blue-950 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 mb-1">OPD Hours</h3>
                <p className="text-gray-700 text-sm">
                  Mon–Fri: 8:00 AM – 3:00 PM
                  <br />
                  Private Patients: 3:00 PM – 6:00 PM
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Book Appointment</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Please complete all required fields marked with an asterisk (*). Our staff will review your request and get
                back to you with confirmation.
              </p>

              {submitSuccess && (
                <div className="mb-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p>
                    Your appointment request has been submitted. We will contact you shortly to confirm your appointment time and
                    details.
                  </p>
                </div>
              )}

              {Object.keys(errors).length > 0 && !submitSuccess && (
                <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p>Please correct the highlighted fields before submitting your request.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Name + CNIC */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <User size={18} />
                      </span>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                        aria-invalid={!!errors.fullName}
                      />
                    </div>
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">CNIC (XXXXX-XXXXXXX-X) *</label>
                    <input
                      type="text"
                      value={formData.cnic}
                      onChange={(e) => handleChange('cnic', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                      aria-invalid={!!errors.cnic}
                    />
                    {errors.cnic && <p className="mt-1 text-sm text-red-600">{errors.cnic}</p>}
                  </div>
                </div>

                {/* Row 2: Phone + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <Phone size={18} />
                      </span>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                        aria-invalid={!!errors.phone}
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <Mail size={18} />
                      </span>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                        aria-invalid={!!errors.email}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>

                {/* Row 3: Date + Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Preferred Date *</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <Calendar size={18} />
                      </span>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                        aria-invalid={!!errors.date}
                      />
                    </div>
                    {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Preferred Time *</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <Clock size={18} />
                      </span>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleChange('time', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                        aria-invalid={!!errors.time}
                      />
                    </div>
                    {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
                  </div>
                </div>

                {/* Row 4: Department + Doctor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                      aria-invalid={!!errors.department}
                    >
                      <option value="">Select Department</option>
                      <option value="general-urology">General Urology</option>
                      <option value="endourology">Endourology</option>
                      <option value="uro-oncology">Uro-Oncology</option>
                      <option value="reconstructive-urology">Reconstructive Urology</option>
                      <option value="pediatric-urology">Pediatric Urology</option>
                      <option value="nephrology">Nephrology</option>
                      <option value="dialysis">Dialysis</option>
                    </select>
                    {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Doctor *</label>
                    <select
                      value={formData.doctor}
                      onChange={(e) => handleChange('doctor', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                      aria-invalid={!!errors.doctor}
                    >
                      <option value="">Select Doctor</option>
                      <option value="any">Any Available Doctor</option>
                      <option value="consultant-urologist-1">Consultant Urologist</option>
                      <option value="consultant-urologist-2">Senior Urologist</option>
                    </select>
                    {errors.doctor && <p className="mt-1 text-sm text-red-600">{errors.doctor}</p>}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Notes (optional)</label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                    placeholder="Provide any relevant medical history, current symptoms, or special requests."
                  />
                  {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                </div>

                {/* Consent */}
                <div className="flex items-start gap-3">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => handleChange('consent', e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-blue-950"
                  />
                  <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed">
                    I confirm that the above information is accurate to the best of my knowledge and consent to be contacted by
                    AFIU for appointment confirmation and related communication.
                  </label>
                </div>
                {errors.consent && <p className="mt-1 text-sm text-red-600">{errors.consent}</p>}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-950 hover:bg-blue-700 disabled:opacity-75 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  {isSubmitting ? 'Submitting...' : 'Submit Appointment Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
