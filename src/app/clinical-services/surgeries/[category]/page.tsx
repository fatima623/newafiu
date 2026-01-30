'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { surgeryCategories } from '@/data/surgeryData';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  
  const category = surgeryCategories.find(c => c.slug === categorySlug);
  
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Category Not Found</h1>
          <Link href="/clinical-services/surgeries" className="text-blue-950 hover:underline">
            ← Back to Surgeries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <nav className="text-xs sm:text-sm text-blue-100 mb-2" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 sm:gap-2">
              <li>
                <Link href="/" className="hover:text-white">Home</Link>
              </li>
              <span>/</span>
              <li>
                <Link href="/clinical-services" className="hover:text-white">Clinical Services</Link>
              </li>
              <span>/</span>
              <li>
                <Link href="/clinical-services/surgeries" className="hover:text-white">Surgeries</Link>
              </li>
              <span>/</span>
              <li className="text-white font-medium">{category.name}</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{category.name}</h1>
          <p className="text-sm sm:text-lg text-blue-100 max-w-3xl">
            {category.description}
          </p>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-4 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <Link 
            href="/clinical-services/surgeries" 
            className="inline-flex items-center text-blue-950 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to All Surgeries
          </Link>
        </div>
      </section>

      {/* Subcategories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {category.subcategories.map((subcategory) => (
              <div key={subcategory.slug} className="mb-12 last:mb-0">
                <div className="border-l-4 border-blue-950 pl-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{subcategory.name}</h2>
                  <p className="text-gray-600 mt-2">{subcategory.overview}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subcategory.procedures.map((procedure) => (
                    <Link
                      key={procedure.slug}
                      href={`/clinical-services/surgeries/${category.slug}/${subcategory.slug}/${procedure.slug}`}
                      className="group bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-5 transition-all"
                    >
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-950 mb-2">
                        {procedure.name}
                      </h3>
                      {procedure.fullName && procedure.fullName !== procedure.name && (
                        <p className="text-sm text-gray-500 mb-2">{procedure.fullName}</p>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {procedure.overview}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {procedure.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-blue-950 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        View Details <ChevronRight size={14} className="ml-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Explore Other Surgery Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {surgeryCategories
              .filter(c => c.slug !== category.slug)
              .map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/clinical-services/surgeries/${cat.slug}`}
                  className="bg-white border border-gray-200 hover:border-blue-300 px-6 py-3 rounded-lg font-medium text-gray-700 hover:text-blue-950 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-blue-950 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-bold mb-3">Need a Consultation?</h2>
          <p className="text-blue-100 mb-5">
            Speak with our specialists about your condition and treatment options.
          </p>
          <Link
            href="/hospital-visit/booking"
            className="inline-block bg-white text-blue-950 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Book Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}
