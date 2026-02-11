'use client';

import { useMemo, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, ChevronDown, X, Grid3x3, List, Camera, Building, Users, Heart } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar Navigation - AFBMTC Style */}
      <div className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Gallery</h1>
          <nav className="space-y-1">
            <button
              onClick={() => {
                setActiveSlug('all');
                setCurrentImageIndex(0);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSlug === 'all'
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              All Departments
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveSlug(cat.slug);
                  setCurrentImageIndex(0);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSlug === cat.slug
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Department Header */}
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">
                {activeSlug === 'all' ? 'All Departments' : activeCategory?.name || 'Gallery'}
              </h2>
              <p className="text-blue-700">
                {activeSlug === 'all' 
                  ? 'Browse through all departments and facilities'
                  : `View images from our ${activeCategory?.name} department`
                }
              </p>
            </div>
          </div>

          {/* Error State */}
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
              <div className="text-red-700 font-medium">{error}</div>
            </div>
          ) : null}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">No tour categories available.</div>
            </div>
          ) : activePhotos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">No photos available in this department.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer"
                  onClick={() => openViewer(index)}
                >
                  <div className="h-48 bg-gray-100">
                    <img
                      src={`/api/gallery-photos/${photo.id}`}
                      alt={photo.originalName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Image failed to load:', photo.id, photo.originalName);
                        // Try to load a fallback image
                        e.currentTarget.src = '/random-1.jpg';
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully:', photo.id);
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500">{photo.categoryName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AFBMTC Style Modal for viewing images */}
      {isViewerOpen && activePhoto ? (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0" onClick={closeModal} />

          <div className="relative w-full max-w-5xl">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {activeSlug === 'all' 
                        ? ('categoryName' in activePhoto ? activePhoto.categoryName : 'Gallery')
                        : (activeCategory?.name || 'Gallery')}
                    </h3>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Image Container */}
              <div className="relative bg-black">
                <div className="h-96">
                  <img
                    src={`/api/gallery-photos/${activePhoto.id}`}
                    alt={activePhoto.originalName}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Navigation */}
                {activePhotos.length > 1 ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrevImage();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg shadow-lg transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNextImage();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg shadow-lg transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                ) : null}
              </div>

              {/* Footer with Thumbnails */}
              {activePhotos.length > 1 ? (
                <div className="bg-gray-50 border-t border-gray-200 p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {activePhotos.map((p, idx) => {
                      const isActive = idx === currentImageIndex;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`shrink-0 rounded border-2 transition-all ${
                            isActive
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-gray-300 hover:border-gray-400'
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
