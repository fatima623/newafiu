import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-950 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">About AFIU</h1>
          <p className="text-xl text-blue-100">
            Excellence in Urological Care Since 1999
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Armed Forces Institute of Urology
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-4">
                At Armed Forces Institute of Urology (AFIU), Rawalpindi, we strive to provide the best possible healthcare to our patients. We endeavor to reach the highest level of skills and professionalism required for patients' satisfaction as well as service excellence.
              </p>
              <p className="text-gray-600 mb-4">
                The Institute is committed to comply with all the requirements of quality, environment, health & safety and all applicable standards. All departments of this Centre undertake the responsibility to understand and implement these standards.
              </p>
              <p className="text-gray-600 mb-8">
                Thank you for selecting AFIU. It is our honour and privilege to take care of you and your loved ones.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Link href="/about/mission" className="bg-blue-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-blue-950 mb-2">Mission Statement</h3>
                <p className="text-gray-600 mb-4">Learn about our mission and commitment to excellence</p>
                <span className="inline-flex items-center gap-2 text-blue-950 font-semibold">
                  Read More <ArrowRight size={16} />
                </span>
              </Link>

              <Link href="/about/history" className="bg-blue-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-blue-950 mb-2">Brief History</h3>
                <p className="text-gray-600 mb-4">Discover our journey and milestones</p>
                <span className="inline-flex items-center gap-2 text-blue-950 font-semibold">
                  Read More <ArrowRight size={16} />
                </span>
              </Link>

              <Link href="/contact" className="bg-blue-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
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
