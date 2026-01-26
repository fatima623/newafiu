'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Megaphone } from 'lucide-react';

interface BannerItem {
  id: number;
  title: string;
  category: 'news' | 'event';
  date: string;
}

export default function NewsBanner() {
  const [items, setItems] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBannerItems();
  }, []);

  const fetchBannerItems = async () => {
    try {
      const res = await fetch('/api/news-events/banner');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching banner items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 px-4 flex items-center gap-2 bg-white/20 py-1 rounded-r-full">
          <Megaphone size={16} />
          <span className="font-semibold text-sm">Announcements</span>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center">
            {items.map((item, index) => (
              <Link
                key={item.id}
                href="/news-events"
                className="inline-flex items-center gap-2 mx-8 hover:underline"
              >
                <span
                  className={`px-2 py-0.5 text-xs rounded ${
                    item.category === 'news'
                      ? 'bg-blue-600'
                      : 'bg-green-600'
                  }`}
                >
                  {item.category === 'news' ? 'NEWS' : 'EVENT'}
                </span>
                <span className="font-medium">{item.title}</span>
                <span className="flex items-center gap-1 text-white/80 text-sm">
                  <Calendar size={12} />
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                {index < items.length - 1 && (
                  <span className="ml-8 text-white/50">•</span>
                )}
              </Link>
            ))}
            {/* Duplicate for seamless loop */}
            {items.map((item, index) => (
              <Link
                key={`dup-${item.id}`}
                href="/news-events"
                className="inline-flex items-center gap-2 mx-8 hover:underline"
              >
                <span
                  className={`px-2 py-0.5 text-xs rounded ${
                    item.category === 'news'
                      ? 'bg-blue-600'
                      : 'bg-green-600'
                  }`}
                >
                  {item.category === 'news' ? 'NEWS' : 'EVENT'}
                </span>
                <span className="font-medium">{item.title}</span>
                <span className="flex items-center gap-1 text-white/80 text-sm">
                  <Calendar size={12} />
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                {index < items.length - 1 && (
                  <span className="ml-8 text-white/50">•</span>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 px-4">
          <Link
            href="/hospital-visit/booking"
            className="bg-white text-orange-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-orange-100 transition-colors"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}
