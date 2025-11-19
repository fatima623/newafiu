'use client';

import { useState } from 'react';
import { Briefcase, Send } from 'lucide-react';

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your application! We will review it and contact you soon.');
    setFormData({ name: '', email: '', phone: '', position: '', message: '' });
  };

  const positions = [
    { title: 'Consultant Urologist', department: 'Clinical Services', type: 'Full-time' },
    { title: 'Resident Urologist', department: 'Clinical Services', type: 'Full-time' },
    { title: 'Nursing Staff', department: 'Nursing', type: 'Full-time' },
    { title: 'Lab Technician', department: 'Laboratory', type: 'Full-time' },
  ];

  return (
    <div>
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Careers</h1>
          <p className="text-lg text-white">Join Our Team of Healthcare Professionals</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="mb-12">
                  <Briefcase size={48} className="text-blue-950 mb-4" />
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Work at AFIU?</h2>
                  <p className="text-gray-600 mb-6">
                    AFIU offers a dynamic and rewarding work environment where you can grow professionally while making a difference in patients' lives.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li>• Competitive salary and benefits</li>
                    <li>• Professional development opportunities</li>
                    <li>• State-of-the-art facilities</li>
                    <li>• Collaborative work environment</li>
                    <li>• Work-life balance</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Current Openings</h3>
                  <div className="space-y-4">
                    {positions.map((position, index) => (
                      <div key={index} className="bg-[#ADD8E6] p-4 rounded-lg">
                        <h4 className="font-bold text-gray-800">{position.title}</h4>
                        <p className="text-sm text-gray-600">{position.department} • {position.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Apply Now</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    <label className="block text-gray-700 font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Position Applied For *</label>
                    <select
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                    >
                      <option value="">Select Position</option>
                      {positions.map((pos, index) => (
                        <option key={index} value={pos.title}>{pos.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Cover Letter</label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Submit Application
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
