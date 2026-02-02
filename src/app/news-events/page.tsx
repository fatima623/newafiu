'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { fetchJson } from '@/lib/fetchJson';

interface NewsEventItem {
  id: number;
  title: string;
  date: string;
  excerpt: string | null;
  imageUrl: string | null;
  category: 'news' | 'event';
}

export default function NewsEventsPage() {
  const [items, setItems] = useState<NewsEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const itemRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle scroll to highlighted item from URL param
  useEffect(() => {
    const newsId = searchParams.get('id');
    if (newsId && !loading) {
      const id = parseInt(newsId, 10);
      setHighlightedId(id);
      
      // Scroll to the item after a short delay
      setTimeout(() => {
        const element = itemRefs.current[id];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightedId(null);
      }, 3000);
    }
  }, [searchParams, loading]);

  const fetchItems = async () => {
    try {
      const data = await fetchJson('/api/news-events');
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching news/events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">News & Events</h1>
          <p className="text-lg text-white">Stay Updated with Latest Happenings at AFIU</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950 mx-auto"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No news or events available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                  <div
                    key={item.id}
                    ref={(el) => { itemRefs.current[item.id] = el; }}
                    className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500 ${
                      highlightedId === item.id 
                        ? 'ring-4 ring-yellow-400 shadow-xl scale-[1.02]' 
                        : 'hover:shadow-lg'
                    }`}
                  >
                    <div className="h-48 relative">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      {item.excerpt && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.excerpt}</p>
                      )}
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar size={14} />
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
