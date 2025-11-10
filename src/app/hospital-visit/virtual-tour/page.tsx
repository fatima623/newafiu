import { Video, Camera } from 'lucide-react';

export default function VirtualTourPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Virtual Tour</h1>
          <p className="text-xl text-blue-100">Explore Our Facilities Online</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Video size={48} className="text-blue-950 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Take a Virtual Tour</h2>
              <p className="text-lg text-gray-600">
                Explore our state-of-the-art facilities from the comfort of your home
              </p>
            </div>

            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center mb-8">
              <div className="text-center">
                <Camera size={64} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Virtual tour coming soon</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">OPD Area</h3>
                <p className="text-gray-600">Modern outpatient consultation rooms with advanced diagnostic equipment</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Operation Theaters</h3>
                <p className="text-gray-600">State-of-the-art surgical facilities with latest technology</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Patient Wards</h3>
                <p className="text-gray-600">Comfortable and well-equipped inpatient facilities</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Diagnostic Lab</h3>
                <p className="text-gray-600">Advanced laboratory with modern testing equipment</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
