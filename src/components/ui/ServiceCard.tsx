import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
        <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">
          {service.title}
        </h3>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{service.description}</p>
        <Link
          href={`/clinical-services/${service.id}`}
          className="inline-flex items-center gap-2 text-blue-950 hover:text-blue-700 font-semibold transition-colors"
        >
          Read more
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
