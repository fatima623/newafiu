'use client';

import { useEffect, useState } from 'react';
import { Image, BookOpen, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { fetchJson } from '@/lib/fetchJson';

interface Stats {
  galleryAlbums: number;
  patientEducation: number;
  newsEvents: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ galleryAlbums: 0, patientEducation: 0, newsEvents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [gallery, education, news] = await Promise.all([
        fetchJson('/api/gallery'),
        fetchJson('/api/patient-education'),
        fetchJson('/api/news-events'),
      ]);

      setStats({
        galleryAlbums: Array.isArray(gallery) ? gallery.length : 0,
        patientEducation: Array.isArray(education) ? education.length : 0,
        newsEvents: Array.isArray(news) ? news.length : 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Gallery Albums',
      count: stats.galleryAlbums,
      icon: Image,
      href: '/admin/dashboard/gallery',
      color: 'bg-purple-500',
    },
    {
      title: 'Patient Education',
      count: stats.patientEducation,
      icon: BookOpen,
      href: '/admin/dashboard/patient-education',
      color: 'bg-green-500',
    },
    {
      title: 'News & Events',
      count: stats.newsEvents,
      icon: Newspaper,
      href: '/admin/dashboard/news-events',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{card.count}</p>
                <p className="text-gray-600">{card.title}</p>
              </Link>
            );
          })}
        </div>
      )}


    </div>
  );
}
