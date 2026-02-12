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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <Link href="/educational-resources/patient-education" className="bg-[#ADD8E6] rounded-lg p-6 sm:p-8 hover:border-blue-950 hover:shadow-xl transition-all flex flex-col">
                <BookOpen size={40} className="text-blue-950 mb-4 sm:w-12 sm:h-12" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Patient Education</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base flex-1">
                  Comprehensive information about urological conditions, treatments, and post-operative care
                </p>
                <span className="text-blue-950 font-semibold">Learn More →</span>
              </Link>

              <Link href="/educational-resources/physicians" className="bg-[#ADD8E6] rounded-lg p-6 sm:p-8 hover:border-blue-950 hover:shadow-xl transition-all flex flex-col">
                <Users size={40} className="text-blue-950 mb-4 sm:w-12 sm:h-12" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Physician Referrals</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base flex-1">
                  Clinical guidelines, referral information, and continuing medical education resources
                </p>
                <span className="text-blue-950 font-semibold">Learn More →</span>
              </Link>

              <Link href="/educational-resources/guidelines" className="bg-[#ADD8E6] rounded-lg p-6 sm:p-8 hover:border-blue-950 hover:shadow-xl transition-all flex flex-col sm:col-span-2 lg:col-span-1">
                <FileText size={40} className="text-blue-950 mb-4 sm:w-12 sm:h-12" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Institutional Guidelines</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base flex-1">
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
