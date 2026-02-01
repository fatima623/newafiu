'use client';

import { useEffect, useState } from 'react';
import { Image, BookOpen, Newspaper, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { fetchJson } from '@/lib/fetchJson';

interface Stats {
  galleryCategories: number;
  patientEducation: number;
  newsEvents: number;
  faculty: number;
  currentOpenings: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ 
    galleryCategories: 0, 
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
      const [galleryCategories, education, news, faculty, jobs] = await Promise.all([
        fetchJson('/api/gallery-categories'),
        fetchJson('/api/patient-education'),
        fetchJson('/api/news-events'),
        fetchJson('/api/faculty'),
        fetchJson('/api/careers-jobs?all=1'),
      ]);

      setStats({
        galleryCategories: Array.isArray(galleryCategories) ? galleryCategories.length : 0,
        patientEducation: Array.isArray(education) ? education.length : 0,
        newsEvents: Array.isArray(news) ? news.length : 0,
        faculty: Array.isArray(faculty) ? faculty.length : 0,
        currentOpenings: Array.isArray(jobs) ? jobs.filter((j: { isPublished?: boolean }) => j.isPublished).length : 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Gallery',
      count: stats.galleryCategories,
      icon: Image,
      href: '/admin/dashboard/categorized-gallery',
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
              <div className="h-14 w-14 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className={`${card.bgColor} rounded-xl shadow-lg p-6 border ${card.borderColor} transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-950 focus-visible:ring-offset-2`}
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
      )}
    </div>
  );
}
