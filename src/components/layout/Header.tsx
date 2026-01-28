'use client';

import { Phone, Mail, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const hideOnDashboard = pathname?.startsWith('/admin/dashboard');
  const hideOnLogin = pathname?.startsWith('/admin/login');

  if (hideOnDashboard || hideOnLogin) {
    return null;
  }

  return (
    <div className="bg-white text-blue-950 border-b border-blue-100">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center text-sm py-2">
        <div className="flex flex-wrap items-center gap-4 mb-2 md:mb-0">
          <a href="tel:+92519270076" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
            <Phone size={16} />
            <span>Tel: +92 51 5562331</span>
          </a>
          <a href="mailto:afiu@outlook.com" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
            <Mail size={16} />
            <span>Email: afiu@outlook.com</span>
          </a>
        </div>
        <div className="flex gap-4">
        
          <Link 
            href="/admin/login" 
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <Shield size={16} />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
