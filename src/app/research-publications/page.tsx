import { BookOpen, Download } from 'lucide-react';
import { publications } from '@/data/siteData';

export default function ResearchPublicationsPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Research Publications</h1>
          <p className="text-xl text-blue-100">Contributing to Urological Science</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <BookOpen size={48} className="text-blue-950 mx-auto mb-4" />
              <p className="text-lg text-gray-600">
                Our faculty actively contributes to urological research and publishes in leading international journals.
              </p>
            </div>

            <div className="space-y-6">
              {publications.map((pub) => (
                <div key={pub.id} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pub.title}</h3>
                  <p className="text-gray-600 mb-2">
                    <strong>Authors:</strong> {pub.authors.join(', ')}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Journal:</strong> {pub.journal}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <strong>Year:</strong> {pub.year}
                  </p>
                  {pub.pdf && (
                    <button className="inline-flex items-center gap-2 text-blue-950 hover:text-blue-700 font-semibold">
                      <Download size={16} />
                      Download PDF
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
