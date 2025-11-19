import Link from 'next/link';
import { Calendar, MapPin, Stethoscope, Bed, Users, Building, Video, Info } from 'lucide-react';

export default function HospitalVisitPage() {
  const sections = [
    { title: 'Booking your appointment', icon: Calendar, href: '/hospital-visit/booking', description: 'Schedule your consultation with our specialists' },
    { title: 'Travelling to AFIU', icon: MapPin, href: '/hospital-visit/travelling', description: 'Directions and transportation information' },
    { title: 'Outpatient Appointment', icon: Stethoscope, href: '/hospital-visit/outpatient', description: 'What to expect during your OPD visit' },
    { title: 'Inpatient Admission', icon: Bed, href: '/hospital-visit/inpatient', description: 'Information for hospital admission' },
    { title: 'Visitor Policy', icon: Users, href: '/hospital-visit/visitor-policy', description: 'Guidelines for visitors and attendants' },
    { title: 'Hospital Facilities', icon: Building, href: '/hospital-visit/facilities', description: 'Available amenities and services' },
    { title: 'Virtual Tour', icon: Video, href: '/hospital-visit/virtual-tour', description: 'Explore our facilities online' },
  ];

  return (
    <div>
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Your Hospital Visit</h1>
          <p className="text-lg text-white">Everything You Need to Know About Visiting AFIU</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Info size={48} className="text-blue-950 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Plan Your Visit</h2>
              <p className="text-lg text-gray-600">
                Find all the information you need to prepare for your visit to AFIU
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <Link
                    key={index}
                    href={section.href}
                    className="bg-[#ADD8E6] rounded-lg p-6 hover:border-blue-950 hover:shadow-xl transition-all"
                  >
                    <Icon size={40} className="text-blue-950 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{section.title}</h3>
                    <p className="text-gray-600 mb-4">{section.description}</p>
                    <span className="text-blue-950 font-semibold">Learn More →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
