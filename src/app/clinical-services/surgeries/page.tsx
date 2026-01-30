'use client';

import Link from 'next/link';
import { Activity, Circle, Heart, Shield, User, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { surgeryCategories } from '@/data/surgeryData';

const iconMap: Record<string, React.ReactNode> = {
  Activity: <Activity size={32} className="text-blue-950" />,
  Circle: <Circle size={32} className="text-blue-950" />,
  Heart: <Heart size={32} className="text-blue-950" />,
  Shield: <Shield size={32} className="text-blue-950" />,
  User: <User size={32} className="text-blue-950" />,
};

export default function SurgeriesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Flatten all procedures for search
  const allProcedures = surgeryCategories.flatMap(cat =>
    cat.subcategories.flatMap(sub =>
      sub.procedures.map(proc => ({
        ...proc,
        categoryName: cat.name,
        categorySlug: cat.slug,
        subcategoryName: sub.name,
        subcategorySlug: sub.slug,
      }))
    )
  );

  const filteredProcedures = searchQuery.length >= 2
    ? allProcedures.filter(proc =>
        proc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.subcategoryName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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
              <li className="text-white font-medium">Surgeries</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Surgical Services</h1>
          <p className="text-sm sm:text-lg text-blue-100 max-w-3xl">
            Comprehensive surgical management of urological conditions including tumors, stone disease, 
            transplant surgery, benign conditions, and inguinoscrotal procedures.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search procedures (e.g., TURP, Nephrectomy, PCNL...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-950 text-gray-800"
              />
            </div>
            
            {/* Search Results */}
            {filteredProcedures.length > 0 && (
              <div className="mt-4 bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto">
                {filteredProcedures.map((proc, idx) => (
                  <Link
                    key={idx}
                    href={`/clinical-services/surgeries/${proc.categorySlug}/${proc.subcategorySlug}/${proc.slug}`}
                    className="block px-4 py-3 hover:bg-blue-50 border-b last:border-b-0"
                  >
                    <div className="font-medium text-gray-800">{proc.fullName || proc.name}</div>
                    <div className="text-sm text-gray-500">
                      {proc.categoryName} → {proc.subcategoryName}
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {searchQuery.length >= 2 && filteredProcedures.length === 0 && (
              <div className="mt-4 text-center text-gray-500 py-4">
                No procedures found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
            Surgery Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {surgeryCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/clinical-services/surgeries/${category.slug}`}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    {iconMap[category.icon] || <Activity size={32} className="text-blue-950" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-950 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="text-sm text-gray-500">
                      {category.subcategories.length} subcategories • {' '}
                      {category.subcategories.reduce((acc, sub) => acc + sub.procedures.length, 0)} procedures
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-blue-950 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  View Procedures <ChevronRight size={16} className="ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
            Our Surgical Expertise
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-950 mb-2">
                {surgeryCategories.reduce((acc, cat) => 
                  acc + cat.subcategories.reduce((a, s) => a + s.procedures.length, 0), 0
                )}+
              </div>
              <div className="text-gray-600">Surgical Procedures</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-950 mb-2">5</div>
              <div className="text-gray-600">Major Categories</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-950 mb-2">24/7</div>
              <div className="text-gray-600">Emergency Coverage</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-950 mb-2">100K+</div>
              <div className="text-gray-600">Successful Surgeries</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-950 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Surgical Consultation?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our expert surgical team is available to discuss your condition and recommend the most appropriate treatment approach.
          </p>
          <Link
            href="/hospital-visit/booking"
            className="inline-block bg-white text-blue-950 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Book an Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}
