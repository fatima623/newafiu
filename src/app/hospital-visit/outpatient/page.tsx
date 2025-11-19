import { CheckCircle } from 'lucide-react';

export default function OutpatientPage() {
  const steps = [
    'Arrive 15 minutes before your appointment time',
    'Register at the reception desk with your appointment confirmation',
    'Wait in the designated waiting area',
    'You will be called when the doctor is ready',
    'Consultation with the urologist',
    'Collect prescriptions and follow-up instructions',
    'Schedule follow-up appointment if needed',
  ];

  return (
    <div>
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Outpatient Appointment</h1>
          <p className="text-lg text-white">Information for Your Outpatient Department (OPD) Visit</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Outpatient Visit Overview</h2>
            <p className="text-lg text-gray-600 mb-8">
              The Outpatient Department (OPD) provides structured consultations and diagnostic services. The information below outlines the usual sequence of an outpatient visit.
            </p>

            <div className="bg-[#ADD8E6] p-8 rounded-lg mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">What to Bring</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Valid ID card or passport</li>
                <li>• Previous medical records and test results</li>
                <li>• List of current medications</li>
                <li>• Insurance card (if applicable)</li>
                <li>• Referral letter (if applicable)</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">Visit Process</h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-950 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
