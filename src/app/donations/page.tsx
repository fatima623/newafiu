'use client';

import { Heart, DollarSign, Users, Building } from 'lucide-react';

export default function DonationsPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Support AFIU</h1>
          <p className="text-xl text-blue-100">Help Us Provide Quality Healthcare to Those in Need</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Heart size={48} className="text-blue-950 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Make a Difference</h2>
              <p className="text-lg text-gray-600">
                Your generous donations help us provide quality urological care to patients who cannot afford treatment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <DollarSign size={40} className="text-blue-950 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Financial Support</h3>
                <p className="text-gray-600">Help cover treatment costs for underprivileged patients</p>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Building size={40} className="text-blue-950 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Equipment</h3>
                <p className="text-gray-600">Support purchase of advanced medical equipment</p>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Users size={40} className="text-blue-950 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Education</h3>
                <p className="text-gray-600">Fund training programs for medical professionals</p>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">How to Donate</h3>
              <div className="space-y-4 text-gray-600">
                <p><strong>Bank Transfer:</strong></p>
                <ul className="ml-6 space-y-2">
                  <li>• Bank: [Bank Name]</li>
                  <li>• Account Title: Armed Forces Institute of Urology</li>
                  <li>• Account Number: [Account Number]</li>
                  <li>• IBAN: [IBAN Number]</li>
                </ul>

                <p className="mt-6"><strong>Contact Us:</strong></p>
                <p>For more information about donations, please contact us at:</p>
                <p>Email: donations@afiu.org.pk</p>
                <p>Phone: +92 51 9270076</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 italic">
                All donations are tax-deductible. You will receive a receipt for your contribution.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
