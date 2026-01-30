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
