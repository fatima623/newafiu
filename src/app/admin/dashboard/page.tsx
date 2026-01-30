'use client';

import { useEffect, useState } from 'react';
import { Image, BookOpen, Newspaper, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  galleryAlbums: number;
  patientEducation: number;
  newsEvents: number;
  faculty: number;
  currentOpenings: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ 
    galleryAlbums: 0, 
    patientEducation: 0, 
    newsEvents: 0,
    faculty: 0,
    currentOpenings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch each endpoint separately to handle individual failures
      const fetchSafe = async (url: string) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return [];
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        } catch {
          return [];
        }
      };

      const [gallery, education, news, faculty, jobs] = await Promise.all([
        fetchSafe('/api/gallery'),
        fetchSafe('/api/patient-education'),
        fetchSafe('/api/news-events'),
        fetchSafe('/api/faculty'),
        fetchSafe('/api/careers/jobs'),
      ]);

      setStats({
        galleryAlbums: gallery.length,
        patientEducation: education.length,
        newsEvents: news.length,
        faculty: faculty.length,
        currentOpenings: jobs.filter((j: { isPublished?: boolean }) => j.isPublished).length,
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
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Patient Education',
      count: stats.patientEducation,
      icon: BookOpen,
      href: '/admin/dashboard/patient-education',
      gradient: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      title: 'News & Events',
      count: stats.newsEvents,
      icon: Newspaper,
      href: '/admin/dashboard/news-events',
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      title: 'Faculty Members',
      count: stats.faculty,
      icon: Users,
      href: '/admin/dashboard/faculty',
      gradient: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Current Openings',
      count: stats.currentOpenings,
      icon: Briefcase,
      href: '/admin/dashboard/careers',
      gradient: 'from-amber-500 to-yellow-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
  ];

  return (
    <div className="pt-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {loading ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
                <div className="h-14 w-14 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
            {[4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
                <div className="h-14 w-14 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* First row - 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
            {cards.slice(0, 3).map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className={`${card.bgColor} rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border ${card.borderColor}`}
                >
                  <div className={`bg-gradient-to-r ${card.gradient} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{card.count}</p>
                  <p className="text-gray-600 font-medium text-sm">{card.title}</p>
                </Link>
              );
            })}
          </div>
          {/* Second row - 2 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
            {cards.slice(3, 5).map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className={`${card.bgColor} rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border ${card.borderColor}`}
                >
                  <div className={`bg-gradient-to-r ${card.gradient} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{card.count}</p>
                  <p className="text-gray-600 font-medium text-sm">{card.title}</p>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
