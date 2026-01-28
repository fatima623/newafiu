import { notFound } from 'next/navigation';
import { Mail, Phone, Award } from 'lucide-react';

interface Faculty {
  id: number;
  name: string;
  designation: string;
  qualifications: string;
  specialization: string | null;
  image: string | null;
  bio: string | null;
}

async function getFacultyMember(id: string): Promise<Faculty | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/faculty/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function FacultyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const member = await getFacultyMember(id);

  if (!member) {
    notFound();
  }

  const displayImage = member.image || '/person.png';
  const displaySpecialization = member.specialization || 'General Urology';

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <img
                src={displayImage}
                alt={member.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl"
              />
              <div>
                <h1 className="text-4xl font-bold mb-2">{member.name}</h1>
                <p className="text-lg text-white mb-4">{member.designation}</p>
                <p className="text-blue-100">{member.qualifications}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-blue-50 p-6 rounded-lg">
                <Award size={32} className="text-blue-600 mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">Specialization</h3>
                <p className="text-gray-600">{displaySpecialization}</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <Phone size={32} className="text-blue-600 mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">Appointments</h3>
                <p className="text-gray-600">Call: +92 51 9270077</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <Mail size={32} className="text-blue-600 mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">Email</h3>
                <p className="text-gray-600">appointments@afiu.org.pk</p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">About</h2>
              <p className="text-lg text-gray-600 mb-6">
                {member.bio || `${member.name} is a highly experienced urologist specializing in ${displaySpecialization}. With extensive training and years of clinical experience, ${member.name.split(' ')[0]} provides expert care to patients with various urological conditions.`}
              </p>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">Qualifications</h3>
              <p className="text-gray-600 mb-6">{member.qualifications}</p>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">Areas of Expertise</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {displaySpecialization.split(',').map((spec, index) => (
                  <li key={index}>{spec.trim()}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
