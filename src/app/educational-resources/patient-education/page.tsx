'use client';

import { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { fetchJson } from '@/lib/fetchJson';

interface PatientEducationItem {
  id: number;
  title: string;
  description: string | null;
  pdfUrl: string | null;
}

export default function PatientEducationPage() {
  const [items, setItems] = useState<PatientEducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await fetchJson('/api/patient-education');
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching patient education:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Patient Education</h1>
          <p className="text-lg text-white">
            Empowering Patients with Knowledge
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Educational Materials</h2>
              <p className="text-lg text-gray-600">
                We believe that informed patients make better healthcare decisions. Browse our collection of educational materials to learn more about urological conditions and treatments.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950 mx-auto"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No educational materials available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="bg-[#ADD8E6] p-6 rounded-lg hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <FileText size={24} className="text-blue-950 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                        {item.description && (
                          <p className="text-gray-600 mb-3">{item.description}</p>
                        )}
                        {item.pdfUrl ? (
                          <a
                            href={item.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-950 hover:text-blue-700 font-semibold"
                          >
                            <Download size={16} />
                            Download PDF
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">PDF not available</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
