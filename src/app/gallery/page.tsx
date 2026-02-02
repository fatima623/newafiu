'use client';

import { useMemo, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, ChevronDown, X } from 'lucide-react';
import { fetchJson } from '@/lib/fetchJson';

type GalleryPhoto = {
  id: number;
  code: string;
  originalName: string;
  categoryName?: string;
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
  const [activeSlug, setActiveSlug] = useState<string>('all');
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  // Get all photos from all categories with category name attached
  const allPhotos = useMemo(() => {
    const photos: (GalleryPhoto & { categoryName: string })[] = [];
    categories.forEach((cat) => {
      cat.photos.forEach((photo) => {
        photos.push({ ...photo, categoryName: cat.name });
      });
    });
    return photos;
  }, [categories]);

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === activeSlug) || null,
    [categories, activeSlug]
  );

  const activePhotos = useMemo(() => {
    if (activeSlug === 'all') {
      return allPhotos;
    }
    return activeCategory?.photos || [];
  }, [activeSlug, activeCategory, allPhotos]);

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
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-950">
                {activeSlug === 'all' ? 'All Photos' : activeCategory?.name || 'Gallery'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {activePhotos.length} {activePhotos.length === 1 ? 'photo' : 'photos'}
              </p>
            </div>
            
            {/* Category Dropdown */}
            <div className="relative w-full sm:w-64">
              <select
                value={activeSlug}
                onChange={(e) => {
                  setActiveSlug(e.target.value);
                  setCurrentImageIndex(0);
                }}
                className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent cursor-pointer hover:border-gray-400 transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name} ({cat.photos.length})
                  </option>
                ))}
              </select>
              <ChevronDown 
                size={18} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" 
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 15 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse rounded-2xl overflow-hidden border border-gray-200 bg-white"
                >
                  <div className="aspect-[4/3] bg-gray-200" />
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
                    {activeSlug === 'all' 
                      ? ('categoryName' in activePhoto ? activePhoto.categoryName : 'Gallery')
                      : (activeCategory?.name || 'Gallery')}
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
