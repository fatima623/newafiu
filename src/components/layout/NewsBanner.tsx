'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Megaphone } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface BannerItem {
  id: number;
  title: string;
  category: 'news' | 'event';
  date: string;
}

export default function NewsBanner() {
  const pathname = usePathname();
  const hideOnDashboard = pathname?.startsWith('/admin/dashboard');
  const hideOnLogin = pathname?.startsWith('/admin/login');
  const isHomePage = pathname === '/';
  const [items, setItems] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hideOnDashboard && !hideOnLogin) {
      fetchBannerItems();

      // Auto-refresh every 30 seconds so admin changes reflect without page reload
      const interval = setInterval(fetchBannerItems, 30_000);
      return () => clearInterval(interval);
    }
  }, [hideOnDashboard, hideOnLogin]);

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

  // Hide on dashboard and login pages, or when loading/no items
  if (hideOnDashboard || hideOnLogin || loading || items.length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-gradient-to-r from-red-500 to-blue-600 text-white py-2 overflow-hidden ${
        isHomePage ? 'sticky top-0 z-50' : ''
      }`}
    >
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
                href={`/news-events?id=${item.id}`}
                className="inline-flex items-center gap-2 mx-8 hover:underline"
              >
                <span className="font-medium">{item.title}</span>
                {index < items.length - 1 && (
                  <span className="ml-8 text-white/50">•</span>
                )}
              </Link>
            ))}
            {/* Duplicate for seamless loop */}
            {items.map((item, index) => (
              <Link
                key={`dup-${item.id}`}
                href={`/news-events?id=${item.id}`}
                className="inline-flex items-center gap-2 mx-8 hover:underline"
              >
                <span className="font-medium">{item.title}</span>
                {index < items.length - 1 && (
                  <span className="ml-8 text-white/50">•</span>
                )}
              </Link>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
}
