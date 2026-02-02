'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { contactInfo } from '@/data/siteData';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // OTP verification state
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [submitError, setSubmitError] = useState('');

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
    if (formData.email.toLowerCase() !== verifiedEmail.toLowerCase()) {
      setOtpVerified(false);
      setOtpSent(false);
      setOtpValue('');
      setOtpError('');
    }
  }, [formData.email, verifiedEmail]);

  // Send OTP function
  const handleSendOTP = async () => {
    const email = formData.email.trim();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setOtpError('Please enter a valid email address');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const res = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email, purpose: 'contact' }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setOtpSent(true);
        setOtpCountdown(60);
        setOtpValue('');
      } else {
        setOtpError(data.error || 'Failed to send verification code');
      }
    } catch {
      setOtpError('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP function
  const handleVerifyOTP = async () => {
    const email = formData.email.trim();
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
        body: JSON.stringify({ action: 'verify', email, otp: otpValue, purpose: 'contact' }),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email is verified
    if (!otpVerified || formData.email.trim().toLowerCase() !== verifiedEmail.toLowerCase()) {
      setSubmitError('Please verify your email address before submitting');
      return;
    }
    
    setSubmitError('');
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setOtpSent(false);
    setOtpVerified(false);
    setOtpValue('');
    setVerifiedEmail('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSubmitError('');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-white">
            Get in Touch with Our Team
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-blue-950" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Address</h3>
                    <p className="text-gray-600">{contactInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-blue-950" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Phone</h3>
                    <p className="text-gray-600">Main: {contactInfo.phone}</p>
                    <p className="text-gray-600">Appointments: {contactInfo.appointmentPhone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-blue-950" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">General: {contactInfo.email}</p>
                    <p className="text-gray-600">Appointments: {contactInfo.appointmentEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={24} className="text-blue-950" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Timings</h3>
                    <p className="text-gray-600">{contactInfo.timings}</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.5!2d73.0479!3d33.5651!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDMzJzU0LjQiTiA3M8KwMDInNTIuNCJF!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email Address *
                    {otpVerified && formData.email.trim().toLowerCase() === verifiedEmail.toLowerCase() && (
                      <span className="ml-2 inline-flex items-center text-green-600 text-sm font-normal">
                        <CheckCircle2 size={14} className="mr-1" /> Verified
                      </span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={otpVerified && formData.email.trim().toLowerCase() === verifiedEmail.toLowerCase()}
                      className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950 ${
                        otpVerified && formData.email.trim().toLowerCase() === verifiedEmail.toLowerCase()
                          ? 'bg-green-50 border-green-300'
                          : ''
                      }`}
                    />
                    {!otpVerified || formData.email.trim().toLowerCase() !== verifiedEmail.toLowerCase() ? (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={
                          otpLoading ||
                          otpCountdown > 0 ||
                          !formData.email.trim() ||
                          !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email.trim())
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
                        We&apos;ve sent a 6-digit verification code to <strong>{formData.email}</strong>
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
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                  ></textarea>
                </div>

                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!otpVerified || formData.email.trim().toLowerCase() !== verifiedEmail.toLowerCase()}
                  className="w-full bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                  Send Message
                </button>
                
                {!otpVerified && (
                  <p className="text-sm text-gray-500 text-center">
                    Please verify your email address above to send the message.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
