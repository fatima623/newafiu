'use client';

import { Phone, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <div className="bg-white text-blue-950 border-b border-blue-100 py-2 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
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
            href="/news-events" 
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <span>News & Events</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
