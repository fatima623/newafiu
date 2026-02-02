'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Image, 
  BookOpen, 
  Newspaper, 
  LogOut,
  Menu,
  X,
  Users,
  Briefcase,
  Calendar,
  Clock
} from 'lucide-react';
import { fetchJson } from '@/lib/fetchJson';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/dashboard/appointments', label: 'Appointments', icon: Calendar },
  { href: '/admin/dashboard/availability', label: 'Availability', icon: Clock },
  { href: '/admin/dashboard/categorized-gallery', label: 'Gallery', icon: Image },
  { href: '/admin/dashboard/patient-education', label: 'Patient Education', icon: BookOpen },
  { href: '/admin/dashboard/news-events', label: 'News & Events', icon: Newspaper },
  { href: '/admin/dashboard/faculty', label: 'Faculty', icon: Users },
  { href: '/admin/dashboard/careers', label: 'Careers', icon: Briefcase },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await fetchJson<{ id: number; username: string }>('/api/auth/login');
      setUser(data);
    } catch {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetchJson('/api/auth/login', { method: 'DELETE' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
      router.push('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-950 text-white rounded-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-blue-950 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col items-center">
          <img
            src="/afiulogo.png"
            alt="AFIU Logo"
            className="w-24 h-24 object-contain"
          />
          <div className="mt-2 text-sm font-semibold tracking-wide">Admin</div>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg mx-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 ${
                  isActive
                    ? 'bg-blue-800 border-r-4 border-white shadow-sm'
                    : 'hover:bg-blue-800/60 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-blue-800/50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 p-8 pt-16 lg:pt-8">
        {children}
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
