'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type GalleryImage = {
  id: string;
  src: string;
  caption: string;
  date: string;
};

type GalleryEvent = {
  id: string;
  title: string;
  date: string;
  images: GalleryImage[];
};

// Sample data - replace with your actual data
const galleryEvents: GalleryEvent[] = [
  {
    id: '1',
    title: 'Annual Medical Conference 2023',
    date: '2023-11-15',
    images: [
      {
        id: '1-1',
        src: '/conference1.jpg',
        caption: 'Keynote speech by Dr. Smith',
        date: '2023-11-15',
      },
      {
        id: '1-2',
        src: '/conference2.jpg',
        caption: 'Panel discussion on urological advancements',
        date: '2023-11-15',
      },
    ],
  },
  {
    id: '2',
    title: 'Hospital Inauguration',
    date: '2023-10-05',
    images: [
      {
        id: '2-1',
        src: '/inauguration.jpg',
        caption: 'Ribbon cutting ceremony',
        date: '2023-10-05',
      },
    ],
  },
  // Add more events as needed
];

export default function GalleryPage() {
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openEvent = (event: GalleryEvent) => {
    setSelectedEvent(event);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedEvent(null);
    document.body.style.overflow = 'auto';
  };

  const goToNextImage = () => {
    if (!selectedEvent) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === selectedEvent.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevImage = () => {
    if (!selectedEvent) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? selectedEvent.images.length - 1 : prevIndex - 1
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-950 mb-4">Gallery</h1>
          <p className="text-lg text-gray-600">Explore our media gallery</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => openEvent(event)}
            >
              <div className="h-48 relative">
                <Image
                  src={event.images[0].src}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                {event.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {event.images.length} photos
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for viewing images */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button 
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close gallery"
          >
            <X size={32} />
          </button>
          
          <div className="relative max-w-4xl w-full">
            <div className="relative aspect-video bg-black">
              <Image
                src={selectedEvent.images[currentImageIndex].src}
                alt={selectedEvent.images[currentImageIndex].caption}
                fill
                className="object-contain"
              />

              {selectedEvent.images.length > 1 && (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
            </div>

            <div className="bg-white p-4">
              <h3 className="text-xl font-semibold text-gray-900">{selectedEvent.title}</h3>
              <p className="text-gray-700 mt-1">
                {selectedEvent.images[currentImageIndex].caption}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {formatDate(selectedEvent.images[currentImageIndex].date)}
              </p>
              {selectedEvent.images.length > 1 && (
                <div className="flex items-center justify-center mt-4 space-x-2">
                  {selectedEvent.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
