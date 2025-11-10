import FacultyCard from '@/components/ui/FacultyCard';
import { faculty } from '@/data/siteData';

export default function FacultyPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Our Faculty</h1>
          <p className="text-xl text-blue-100">
            Meet Our Team of Expert Urological Specialists
          </p>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Highly Qualified Medical Professionals
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our faculty comprises highly qualified and experienced urological specialists dedicated to providing the best possible care to our patients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {faculty.map((member) => (
                <FacultyCard key={member.id} faculty={member} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
