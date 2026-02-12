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
        <div className="relative h-56 sm:h-64 overflow-hidden flex-shrink-0">
          <img
            src={faculty.image}
            alt={displayNameFinal}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col min-h-[140px]">
          <div className="mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 leading-tight">{displayNameFinal}</h3>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">{faculty.designation}</p>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{faculty.qualifications}</p>
        </div>
      </div>
    </Link>
  );
}
