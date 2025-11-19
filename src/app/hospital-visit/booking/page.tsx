'use client';

import { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, Send } from 'lucide-react';

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    department: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Your appointment request has been submitted! We will contact you shortly to confirm.');
    setFormData({ name: '', email: '', phone: '', date: '', time: '', department: '', message: '' });
  };

  return (
    <div>
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Book an Appointment</h1>
          <p className="text-lg text-white">Schedule Your Consultation with Our Specialists</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-[#ADD8E6] p-6 rounded-lg text-center">
                <Phone size={32} className="text-blue-950 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">Call Us</h3>
                <p className="text-gray-600">+92 51 9270077</p>
              </div>

              <div className="bg-[#ADD8E6] p-6 rounded-lg text-center">
                <Mail size={32} className="text-blue-950 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">Email Us</h3>
                <p className="text-gray-600">appointments@afiu.org.pk</p>
              </div>

              <div className="bg-[#ADD8E6] p-6 rounded-lg text-center">
                <Clock size={32} className="text-blue-950 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">OPD Hours</h3>
                <p className="text-gray-600">Mon-Fri: 8AM-3PM<br/>Private Patients: 3PM-6PM</p>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Request an Appointment</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Preferred Time *</label>
                    <select
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                    >
                      <option value="">Select Time</option>
                      <option value="morning">Morning (8AM-12PM)</option>
                      <option value="afternoon">Afternoon (12PM-4PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Department *</label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                  >
                    <option value="">Select Department</option>
                    <option value="general">General Urology</option>
                    <option value="endourology">Endourology</option>
                    <option value="uro-oncology">Uro-Oncology</option>
                    <option value="reconstructive">Reconstructive Urology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Additional Information</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                    placeholder="Please provide any relevant medical history or concerns"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Submit Appointment Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
