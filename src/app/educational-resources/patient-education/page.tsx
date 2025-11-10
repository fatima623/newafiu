import { FileText, Download } from 'lucide-react';

export default function PatientEducationPage() {
  const topics = [
    { title: 'Kidney Stones', description: 'Understanding causes, symptoms, and treatment options' },
    { title: 'Prostate Health', description: 'Information about BPH, prostatitis, and prostate cancer' },
    { title: 'Urinary Incontinence', description: 'Types, causes, and management strategies' },
    { title: 'Bladder Health', description: 'Common bladder conditions and their treatment' },
    { title: 'Pre-Operative Instructions', description: 'What to do before your surgery' },
    { title: 'Post-Operative Care', description: 'Recovery guidelines after urological procedures' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Patient Education</h1>
          <p className="text-xl text-blue-100">
            Empowering Patients with Knowledge
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Educational Materials</h2>
              <p className="text-lg text-gray-600">
                We believe that informed patients make better healthcare decisions. Browse our collection of educational materials to learn more about urological conditions and treatments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topics.map((topic, index) => (
                <div key={index} className="bg-blue-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <FileText size={24} className="text-blue-950 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{topic.title}</h3>
                      <p className="text-gray-600 mb-3">{topic.description}</p>
                      <button className="inline-flex items-center gap-2 text-blue-950 hover:text-blue-700 font-semibold">
                        <Download size={16} />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Need More Information?</h3>
              <p className="text-gray-600 mb-4">
                If you have questions about your condition or treatment, please don't hesitate to contact us or speak with your healthcare provider.
              </p>
              <a href="/contact" className="inline-block bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
