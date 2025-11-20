import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">About AFIU</h1>
          <p className="text-lg text-white">
            Excellence in Urological Care Since 1999
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Armed Forces Institute of Urology
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-4 text-justify">
We at Armed Forces Institute of Urology (AFIU) Rawalpindi
strive to provide best possible healthcare to our patients. Our mission is to promote health, healing and hope by offering comprehensive medical, surgical and diagnostic services under one roof. From emergency and critical care to specialized departments, AFIU hospital is equipped with doctors, nurses and health care staff committed to excellence in patient outcomes.  
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Link href="/about/mission" className="bg-[#ADD8E6] p-6 rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-blue-950 mb-2">Mission Statement</h3>
                <p className="text-gray-600 mb-4">Learn about our mission and commitment to excellence</p>
                <span className="inline-flex items-center gap-2 text-blue-950 font-semibold">
                  Read More <ArrowRight size={16} />
                </span>
              </Link>

              <Link href="/about/history" className="bg-[#ADD8E6] p-6 rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-blue-950 mb-2">Brief History</h3>
                <p className="text-gray-600 mb-4">Discover our journey and milestones</p>
                <span className="inline-flex items-center gap-2 text-blue-950 font-semibold">
                  Read More <ArrowRight size={16} />
                </span>
              </Link>

              <Link href="/contact" className="bg-[#ADD8E6] p-6 rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-blue-950 mb-2">Contact Us</h3>
                <p className="text-gray-600 mb-4">Get in touch with our team</p>
                <span className="inline-flex items-center gap-2 text-blue-950 font-semibold">
                  Contact <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
