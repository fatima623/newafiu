import Link from 'next/link';
import { BookOpen, Users, FileText } from 'lucide-react';

export default function EducationalResourcesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Educational Resources</h1>
          <p className="text-lg text-white">
            Information and Guidelines for Patients and Healthcare Professionals
          </p>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/educational-resources/patient-education" className="bg-[#ADD8E6] rounded-lg p-8 hover:border-blue-950 hover:shadow-xl transition-all">
                <BookOpen size={48} className="text-blue-950 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Patient Education</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive information about urological conditions, treatments, and post-operative care
                </p>
                <span className="text-blue-950 font-semibold">Learn More →</span>
              </Link>

              <Link href="/educational-resources/physicians" className="bg-[#ADD8E6] rounded-lg p-8 hover:border-blue-950 hover:shadow-xl transition-all">
                <Users size={48} className="text-blue-950 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">For Physicians</h3>
                <p className="text-gray-600 mb-4">
                  Clinical guidelines, referral information, and continuing medical education resources
                </p>
                <span className="text-blue-950 font-semibold">Learn More →</span>
              </Link>

              <Link href="/educational-resources/guidelines" className="bg-[#ADD8E6] rounded-lg p-8 hover:border-blue-950 hover:shadow-xl transition-all">
                <FileText size={48} className="text-blue-950 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Institutional Guidelines</h3>
                <p className="text-gray-600 mb-4">
                  Clinical protocols, treatment guidelines, and institutional policies
                </p>
                <span className="text-blue-950 font-semibold">Learn More →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
