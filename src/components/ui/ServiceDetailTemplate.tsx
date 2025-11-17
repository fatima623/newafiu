import Link from 'next/link';
import { Clock, Phone, ArrowRight } from 'lucide-react';

interface ServiceDetailProps {
  title: string;
  description: string;
  image: string;
  details: string;
  procedures?: string[];
  benefits?: string[];
}

export default function ServiceDetailTemplate({ 
  title, 
  description, 
  image, 
  details, 
  procedures = [],
  benefits = []
}: ServiceDetailProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-blue-100">{description}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-96 object-cover rounded-lg shadow-lg mb-8"
                />

                <h2 className="text-3xl font-bold text-gray-800 mb-6">Overview</h2>
                <p className="text-lg text-gray-600 mb-8">{details}</p>

                {procedures.length > 0 && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Procedures & Treatments</h3>
                    <ul className="space-y-3 mb-8">
                      {procedures.map((procedure, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-950 rounded-full mt-2"></div>
                          <span className="text-gray-600">{procedure}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {benefits.length > 0 && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Benefits</h3>
                    <ul className="space-y-3">
                      {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-950 rounded-full mt-2"></div>
                          <span className="text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Sidebar */}
              <div>
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Book an Appointment</h3>
                  <p className="text-gray-600 mb-4">Schedule a consultation with our specialists</p>
                  <Link
                    href="/hospital-visit/booking"
                    className="block w-full bg-blue-950 hover:bg-blue-700 text-white text-center px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Book Now
                  </Link>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone size={20} className="text-blue-950 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-800">Phone</p>
                        <p className="text-gray-600">+92 51 5562331</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={20} className="text-blue-950 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-800">Timings</p>
                        <p className="text-gray-600">Mon-Fri: 8AM-4PM</p>
                        <p className="text-gray-600">Sat: 8AM-12PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-950 text-white p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Need Help?</h3>
                  <p className="mb-4">Our team is here to answer your questions</p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-white hover:text-blue-100 font-semibold"
                  >
                    Contact Us <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
