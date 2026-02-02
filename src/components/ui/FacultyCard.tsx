import Link from 'next/link';
import { Faculty } from '@/types';

interface FacultyCardProps {
  faculty: Faculty;
}

export default function FacultyCard({ faculty }: FacultyCardProps) {
  return (
    <Link href={`/faculty/${faculty.id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
        <div className="relative h-64 overflow-hidden">
          <img
            src={faculty.image}
            alt={faculty.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-bold mb-1">{faculty.name}</h3>
            <p className="text-sm text-gray-200">{faculty.designation}</p>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <p className="text-sm text-gray-600 mb-2">{faculty.qualifications}</p>
        </div>
      </div>
    </Link>
  );
}
