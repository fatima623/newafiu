'use client';

import { useState, useEffect } from 'react';
import FacultyCard from '@/components/ui/FacultyCard';

const SPECIALIZATION_CATEGORIES = [
  { value: '', label: 'All Doctors' },
  { value: 'UROLOGIST', label: 'Urologist' },
  { value: 'NEPHROLOGIST', label: 'Nephrologist' },
  { value: 'ANAESTHETIC', label: 'Anaesthetic' },
  { value: 'RADIOLOGIST', label: 'Radiologist' },
];

interface Faculty {
  id: number;
  name: string;
  designation: string;
  qualifications: string;
  specializationCategory: string | null;
  image: string | null;
  bio: string | null;
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    async function fetchFaculty() {
      try {
        const res = await fetch('/api/faculty');
        if (res.ok) {
          const data = await res.json();
          setFaculty(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching faculty:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFaculty();
  }, []);

  const filteredFaculty = selectedCategory
    ? faculty.filter(member => member.specializationCategory === selectedCategory)
    : faculty;

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

            {/* Category Filter Dropdown */}
            <div className="flex justify-center mb-8">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 min-w-[200px]"
              >
                {SPECIALIZATION_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950"></div>
              </div>
            ) : filteredFaculty.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {selectedCategory ? 'No faculty members found for this category.' : 'No faculty members available at the moment.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
                {filteredFaculty.map((member) => (
                  <FacultyCard
                    key={member.id}
                    faculty={{
                      id: String(member.id),
                      name: member.name,
                      designation: member.designation,
                      qualifications: member.qualifications,
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
