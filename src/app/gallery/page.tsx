'use client';

import { useMemo, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Search, X } from 'lucide-react';
import { fetchJson } from '@/lib/fetchJson';

type GalleryPhoto = {
  id: number;
  code: string;
  originalName: string;
};

type GalleryCategory = {
  id: number;
  name: string;
  slug: string;
  photos: GalleryPhoto[];
};

export default function GalleryPage() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSlug, setActiveSlug] = useState<string>('');
  const [query, setQuery] = useState('');
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!activeSlug && categories.length > 0) {
      setActiveSlug(categories[0].slug);
    }
  }, [activeSlug, categories]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeSlug]);

  const fetchCategories = async () => {
    try {
      setError('');
      const data = await fetchJson('/api/gallery-categories');
      setCategories(Array.isArray(data) ? (data as GalleryCategory[]) : []);
    } catch (error) {
      console.error('Error fetching gallery categories:', error);
      setError('Failed to load gallery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, query]);

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === activeSlug) || null,
    [categories, activeSlug]
  );

  const activePhotos = useMemo(() => {
    return activeCategory?.photos || [];
  }, [activeCategory]);

  const activePhoto = activePhotos[currentImageIndex] || null;

  const openViewer = (index: number) => {
    if (!activePhotos[index]) return;
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  };

  const closeModal = () => {
    setIsViewerOpen(false);
  };

  const goToNextImage = () => {
    if (activePhotos.length === 0) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === activePhotos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevImage = () => {
    if (activePhotos.length === 0) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? activePhotos.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    if (!isViewerOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        return;
      }

      if (e.key === 'ArrowRight') {
        goToNextImage();
        return;
      }

      if (e.key === 'ArrowLeft') {
        goToPrevImage();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isViewerOpen, activePhotos.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-3xl">
            <p className="text-blue-100 text-sm font-medium tracking-wide">AFIU</p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-white">Gallery</h1>
            <p className="mt-4 text-blue-100 text-lg">
              A curated look at our facilities, services, and memorable moments.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 lg:order-2">
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 lg:sticky lg:top-6">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white">
                <Search size={16} className="text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search categories"
                  className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                />
              </div>

              <div className="mt-4 space-y-1 max-h-[60vh] overflow-auto pr-1">
                {filteredCategories.map((c) => {
                  const isActive = c.slug === activeSlug;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveSlug(c.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-950 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                    </button>
                  );
                })}

                {!loading && categories.length > 0 && filteredCategories.length === 0 ? (
                  <div className="px-3 py-6 text-sm text-gray-500 text-center">No matching categories</div>
                ) : null}
              </div>
            </div>
          </aside>

          <section className="lg:col-span-9 lg:order-1">
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-blue-950">
                    {activeCategory?.name || 'Gallery'}
                  </h2>
                </div>
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
                  {error}
                </div>
              ) : null}

              {loading ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="animate-pulse rounded-2xl overflow-hidden border border-gray-200 bg-white"
                    >
                      <div className="aspect-[4/3] bg-gray-200" />
                      <div className="p-3">
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-14">
                  <ImageIcon className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No gallery photos yet</p>
                  <p className="text-gray-500 text-sm mt-1">Please check back soon.</p>
                </div>
              ) : activePhotos.length === 0 ? (
                <div className="text-center py-14">
                  <ImageIcon className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No photos in this category</p>
                  <p className="text-gray-500 text-sm mt-1">Try another category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                  {activePhotos.map((photo, index) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => openViewer(index)}
                      className="group text-left rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
                      aria-label={`View ${photo.originalName}`}
                    >
                      <div className="relative aspect-[4/3] bg-gray-100">
                        <img
                          src={`/api/gallery-photos/${photo.id}`}
                          alt={photo.originalName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Modal for viewing images */}
      {isViewerOpen && activePhoto ? (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0" onClick={closeModal} />

          <div className="relative w-full max-w-5xl">
            <div className="relative rounded-2xl overflow-hidden bg-blue-950 border border-blue-950 shadow-2xl">
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between gap-3 p-3 bg-gradient-to-b from-blue-950 via-blue-950/20 to-transparent">
                <div className="min-w-0">
                  <div className="text-white text-sm font-medium truncate">
                    {activeCategory?.name || 'Gallery'}
                  </div>
                  <div className="text-blue-100 text-xs truncate">{activePhoto.originalName}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close gallery"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="relative aspect-[16/10] bg-black">
                <img
                  src={`/api/gallery-photos/${activePhoto.id}`}
                  alt={activePhoto.originalName}
                  className="w-full h-full object-contain"
                />

                {activePhotos.length > 1 ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrevImage();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/40 text-white hover:bg-black/60 transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={26} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNextImage();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/40 text-white hover:bg-black/60 transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={26} />
                    </button>
                  </>
                ) : null}
              </div>

              {activePhotos.length > 1 ? (
                <div className="p-3 bg-black/60 border-t border-white/10">
                  <div className="flex gap-2 overflow-auto">
                    {activePhotos.map((p, idx) => {
                      const isActive = idx === currentImageIndex;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`shrink-0 rounded-lg overflow-hidden border transition-colors ${
                            isActive
                              ? 'border-white'
                              : 'border-white/20 hover:border-white/60'
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        >
                          <img
                            src={`/api/gallery-photos/${p.id}`}
                            alt={p.originalName}
                            className="w-16 h-12 object-cover"
                            loading="lazy"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
