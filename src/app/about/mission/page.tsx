import { Target, Eye, Heart } from 'lucide-react';

export default function MissionPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Mission Statement</h1>
          <p className="text-xl text-blue-100">
            Our Commitment to Excellence in Urological Care
          </p>
        </div>
      </section>

      {/* Mission Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 p-8 rounded-lg mb-12">
              <h2 className="text-3xl font-bold text-blue-950 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To provide world-class urological care through excellence in clinical services, education, and research. We are committed to delivering compassionate, patient-centered care using the latest medical technologies and evidence-based practices, while maintaining the highest standards of professionalism and ethics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target size={40} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Our Mission</h3>
                <p className="text-gray-600">
                  To provide exceptional urological care and improve patient outcomes through innovation and dedication
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye size={40} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Our Vision</h3>
                <p className="text-gray-600">
                  To be the leading center of excellence in urological care in the region, recognized for quality and innovation
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart size={40} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Our Values</h3>
                <p className="text-gray-600">
                  Compassion, integrity, excellence, teamwork, and continuous improvement in all we do
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Core Values</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-950 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-bold text-gray-800">Patient-Centered Care</h4>
                    <p className="text-gray-600">We prioritize the needs, comfort, and wellbeing of our patients in everything we do</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-950 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-bold text-gray-800">Excellence</h4>
                    <p className="text-gray-600">We strive for the highest standards in clinical care, education, and research</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-950 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-bold text-gray-800">Innovation</h4>
                    <p className="text-gray-600">We embrace new technologies and methods to improve patient outcomes</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-950 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-bold text-gray-800">Integrity</h4>
                    <p className="text-gray-600">We maintain the highest ethical standards in all our professional activities</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-950 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-bold text-gray-800">Teamwork</h4>
                    <p className="text-gray-600">We work collaboratively to provide comprehensive, coordinated care</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
