import FacultyCard from '@/components/ui/FacultyCard';

interface Faculty {
  id: number;
  name: string;
  designation: string;
  qualifications: string;
  specialization: string | null;
  image: string | null;
  bio: string | null;
}

async function getFaculty(): Promise<Faculty[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/faculty`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function FacultyPage() {
  const faculty = await getFaculty();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Our Faculty</h1>
          <p className="text-lg text-white">
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

            {faculty.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No faculty members available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
                {faculty.map((member) => (
                  <FacultyCard
                    key={member.id}
                    faculty={{
                      id: String(member.id),
                      name: member.name,
                      designation: member.designation,
                      qualifications: member.qualifications,
                      specialization: member.specialization || '',
                      image: member.image || '/person.png',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
