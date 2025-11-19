import { Target, Eye, Heart } from 'lucide-react';

export default function MissionPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Mission Statement</h1>
          <p className="text-lg text-white">
            Our Commitment to Excellence in Urological Care
          </p>
        </div>
      </section>

      {/* Mission Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="p-8 rounded-lg mb-12">
              <h2 className="text-3xl font-bold text-blue-950 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed text-justify">
We at Armed Forces Institute of Urology (AFIU) Rawalpindi
strive to provide best possible healthcare to our patients. 
Our mission is to promote health, healing and hope by offering comprehensive 
medical, surgical and diagnostic services under one roof. From emergency and critical care to 
specialized departments, AFIU hospital is equipped with doctors, nurses and health care staff 
committed to excellence in patient outcomes.  
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target size={40} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Our Mission</h3>
                <p className="text-gray-600">
To promote health, healing and hope by offering comprehensive medical, surgical and diagnostic services under one roof                </p>
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

            <div className="bg-[#ADD8E6] p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Objectives</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-950 rounded-full mt-2"></div>
                  <div>

                    <p className="text-gray-600">Ensure evidence based clinical practices and adherence to national/ international standards</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-950 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-600">Utilize modern technology and expert staff to achieve the best patient outcomes</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-950 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-600">Implement strict infection control, patient safety and quality assurance protocols</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-950 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-600">Offer compassionate, respectful and patient centered care</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-950 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-600">Conduct clinical research to develop improved methods of treatment and care</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-950 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-600">To ensure continuous and regular training to employees</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-950 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-600">To build an effective feedback system with a foucs on continuous improvement of healthcare system</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-950 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-600">Complying with requirements of the ISO 9001:2015 for Quality Managemet System</p>
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
