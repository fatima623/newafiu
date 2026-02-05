import Link from 'next/link';
import { Faculty } from '@/types';

interface FacultyCardProps {
  faculty: Faculty;
}

export default function FacultyCard({ faculty }: FacultyCardProps) {
  const displayName = faculty.name
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\blt\.?\s*col\b/gi, 'Lt Col');

  const displayNameFinal = displayName.replace(/\bUL\b/g, 'ul');

  return (
    <Link href={`/faculty/${faculty.id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
        <div className="relative h-64 overflow-hidden">
          <img
            src={faculty.image}
            alt={displayNameFinal}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            <h3 className="text-xl font-bold text-gray-900">{displayNameFinal}</h3>
            <p className="text-sm text-gray-600">{faculty.designation}</p>
          </div>
          <p className="text-sm text-gray-600 mb-2">{faculty.qualifications}</p>
        </div>
      </div>
    </Link>
  );
}
