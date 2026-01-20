'use client';

import { Briefcase, Download } from 'lucide-react';

export default function CareersPage() {
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
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Application Forms</h2>
                <p className="text-gray-600 mb-6">
                  Please download and complete the relevant application form. Once filled, submit it as per the instructions
                  provided on the form or by contacting our careers department.
                </p>
                <div className="space-y-4">
                  <a
                    href="/forms/afiu-job-application-form.pdf"
                    className="w-full inline-flex items-center justify-center gap-2 bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <Download size={20} />
                    AFIU Job Application Form
                  </a>
                  <a
                    href="/forms/application-form-residency-training-fcps-part-ii.pdf"
                    className="w-full inline-flex items-center justify-center gap-2 bg-white border border-blue-950 text-blue-950 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <Download size={20} />
                    Application Form for Residency Training (FCPS-Part II)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
