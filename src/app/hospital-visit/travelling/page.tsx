import { MapPin, Car, Bus, Plane } from 'lucide-react';

export default function TravellingPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Travelling to AFIU</h1>
          <p className="text-lg text-white">Directions and Transportation Information</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Location</h2>
              <div className="bg-[#ADD8E6] p-6 rounded-lg mb-6">
                <MapPin size={32} className="text-blue-950 mb-3" />
                <p className="text-lg text-gray-700">
                  Armed Forces Institute of Urology<br />
                  CMH Medical Complex<br />
                  Rawalpindi - Pakistan 46000
                </p>
              </div>

              <div className="rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.5!2d73.0479!3d33.5651!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDMzJzU0LjQiTiA3M8KwMDInNTIuNCJF!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <Car size={32} className="text-blue-950 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">By Car</h3>
                <p className="text-gray-600">
                  Free parking available for patients and visitors. Follow signs to CMH Medical Complex.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <Bus size={32} className="text-blue-950 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">By Public Transport</h3>
                <p className="text-gray-600">
                  Multiple bus routes serve the area. Nearest metro bus station is 2km away.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <Plane size={32} className="text-blue-950 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">From Airport</h3>
                <p className="text-gray-600">
                  Islamabad International Airport is 30km away. Taxi service available 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
