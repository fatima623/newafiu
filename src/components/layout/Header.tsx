'use client';

import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const hideOnDashboard = pathname?.startsWith('/admin/dashboard');
  const hideOnLogin = pathname?.startsWith('/admin/login');

  if (hideOnDashboard || hideOnLogin) {
    return null;
  }

  // Header is now empty - Admin Portal moved to Navbar
  // Keeping component for potential future use (contact info, announcements, etc.)
  return null;
}
