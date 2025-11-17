'use client';

import { useState } from 'react';
import { FileText, Search, Download } from 'lucide-react';

export default function LabReportsPage() {
  const [mrNumber, setMrNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Lab report retrieval feature will be available soon. Please contact the laboratory for your reports.');
  };

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Lab Reports</h1>
          <p className="text-xl text-blue-100">Access Your Laboratory Test Results Online</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <FileText size={48} className="text-blue-950 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Online Lab Reports</h2>
              <p className="text-lg text-gray-600">
                Enter your MR number and password to view your laboratory reports
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">MR Number *</label>
                  <input
                    type="text"
                    required
                    value={mrNumber}
                    onChange={(e) => setMrNumber(e.target.value)}
                    placeholder="Enter your MR number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Password is provided at the time of sample collection
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Search size={20} />
                  View Reports
                </button>
              </form>
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you're having trouble accessing your reports or have forgotten your password, please contact our laboratory:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Phone: +92 51 5562331 (Ext: 123)</li>
                <li>• Email: lab@afiu.org.pk</li>
                <li>• Timings: Monday - Saturday, 8:00 AM - 4:00 PM</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
