'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, Phone, ArrowRight, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { surgeryCategories } from '@/data/surgeryData';

export default function ProcedurePage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const subcategorySlug = params.subcategory as string;
  const procedureSlug = params.procedure as string;
  
  const category = surgeryCategories.find(c => c.slug === categorySlug);
  const subcategory = category?.subcategories.find(s => s.slug === subcategorySlug);
  const procedure = subcategory?.procedures.find(p => p.slug === procedureSlug);
  
  if (!category || !subcategory || !procedure) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Procedure Not Found</h1>
          <Link href="/clinical-services/surgeries" className="text-blue-950 hover:underline">
            ← Back to Surgeries
          </Link>
        </div>
      </div>
    );
  }

  // Find related procedures based on tags
  const relatedProcedures = surgeryCategories.flatMap(cat =>
    cat.subcategories.flatMap(sub =>
      sub.procedures
        .filter(p => 
          p.slug !== procedure.slug && 
          p.tags.some(tag => procedure.tags.includes(tag))
        )
        .map(p => ({
          ...p,
          categorySlug: cat.slug,
          subcategorySlug: sub.slug,
          categoryName: cat.name,
        }))
    )
  ).slice(0, 6);

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
              <li>
                <Link href={`/clinical-services/surgeries/${category.slug}`} className="hover:text-white">
                  {category.name}
                </Link>
              </li>
              <span>/</span>
              <li className="text-white font-medium">{procedure.name}</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {procedure.fullName || procedure.name}
          </h1>
          {procedure.fullName && procedure.fullName !== procedure.name && (
            <p className="text-lg text-blue-200 mb-3">({procedure.name})</p>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {procedure.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-white/20 text-white px-3 py-1 rounded-full"
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-4 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <Link 
            href={`/clinical-services/surgeries/${category.slug}`}
            className="inline-flex items-center text-blue-950 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to {category.name}
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Overview */}
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Activity size={24} className="text-blue-950" />
                    Overview
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{procedure.overview}</p>
                </div>

                {/* Indications */}
                {procedure.indications && (
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <CheckCircle size={24} className="text-green-600" />
                      Indications
                    </h2>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                      <p className="text-gray-700">{procedure.indications}</p>
                    </div>
                  </div>
                )}

                {/* Procedure Details */}
                {procedure.procedureDetails && (
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Procedure Details</h2>
                    <p className="text-gray-700 leading-relaxed">{procedure.procedureDetails}</p>
                  </div>
                )}

                {/* Recovery */}
                {procedure.recovery && (
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Clock size={24} className="text-blue-600" />
                      Recovery
                    </h2>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                      <p className="text-gray-700">{procedure.recovery}</p>
                    </div>
                  </div>
                )}

                {/* Risks */}
                {procedure.risks && (
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <AlertTriangle size={24} className="text-amber-600" />
                      Risks & Considerations
                    </h2>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                      <p className="text-gray-700">{procedure.risks}</p>
                    </div>
                  </div>
                )}

                {/* Related Procedures */}
                {relatedProcedures.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Procedures</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {relatedProcedures.map((related) => (
                        <Link
                          key={`${related.categorySlug}-${related.subcategorySlug}-${related.slug}`}
                          href={`/clinical-services/surgeries/${related.categorySlug}/${related.subcategorySlug}/${related.slug}`}
                          className="group bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-4 transition-all"
                        >
                          <h3 className="font-semibold text-gray-800 group-hover:text-blue-950 mb-1">
                            {related.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">{related.categoryName}</p>
                          <div className="flex flex-wrap gap-1">
                            {related.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div>
                <div className="sticky top-4 space-y-6">
                  {/* Book Appointment */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Book a Consultation</h3>
                    <p className="text-gray-600 mb-4">
                      Discuss this procedure with our specialist surgeons.
                    </p>
                    <Link
                      href="/hospital-visit/booking"
                      className="block w-full bg-blue-950 hover:bg-blue-700 text-white text-center px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Book Appointment
                    </Link>
                  </div>

                  {/* Contact */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Phone size={20} className="text-blue-950 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-800">Phone</p>
                          <p className="text-gray-600">+92 51 5562331</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock size={20} className="text-blue-950 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-800">OPD Timings</p>
                          <p className="text-gray-600">Mon-Fri: 8AM-3PM</p>
                          <p className="text-gray-600">Private: 3PM-6PM</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Other Procedures in Subcategory */}
                  <div className="bg-white border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Other {subcategory.name} Procedures
                    </h3>
                    <ul className="space-y-2">
                      {subcategory.procedures
                        .filter(p => p.slug !== procedure.slug)
                        .map((p) => (
                          <li key={p.slug}>
                            <Link
                              href={`/clinical-services/surgeries/${category.slug}/${subcategory.slug}/${p.slug}`}
                              className="text-blue-950 hover:text-blue-700 hover:underline text-sm flex items-center gap-1"
                            >
                              <ArrowRight size={14} />
                              {p.name}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>

                  {/* Help */}
                  <div className="bg-blue-950 text-white p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">Need Help?</h3>
                    <p className="mb-4 text-blue-100">
                      Our team is here to answer your questions about this procedure.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-white hover:text-blue-100 font-semibold"
                    >
                      Contact Us <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
