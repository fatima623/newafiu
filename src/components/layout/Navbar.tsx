'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Search, Calendar } from 'lucide-react';
import { navItems } from '@/data/siteData';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isOutside = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(target)
      );
      if (isOutside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white'}`}>
      <div className="bg-blue-950 text-white border-b border-blue-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/afiulogo.png" 
                alt="AFIU Logo" 
                className="w-24 h-24 object-contain"
              />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-white">AFIU</h1>
                <p className="text-xs text-blue-100">Armed Forces Institute of Urology</p>
              </div>
            </Link>

            {/* Appointment Button & Mobile Menu */}
            <div className="flex items-center gap-4">
              <Link
                href="/hospital-visit/booking"
                className="hidden sm:inline-flex items-center gap-2 bg-white text-blue-950 hover:bg-blue-100 px-6 py-2.5 rounded-lg font-semibold transition-colors"
              >
                <Calendar size={18} className="text-blue-950" />
                Appointment
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-white hover:bg-blue-900 rounded-lg transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Second Line: Desktop Navigation Menu */}
        <div className="hidden lg:block">
          <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-1 py-3">
            {navItems.map((item) => (
              <div 
                key={item.label} 
                className="relative"
                ref={(el) => {
                  if (item.subItems) {
                    dropdownRefs.current[item.label] = el;
                  }
                }}
              >
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      className={`flex items-center gap-1 py-2 px-3 text-gray-700 hover:text-blue-950 transition-colors font-medium whitespace-nowrap ${
                        pathname.startsWith(item.href) ? 'text-blue-950' : ''
                      }`}
                    >
                      {item.label}
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    <div 
                      className={`absolute left-0 top-full mt-2 w-64 bg-white shadow-xl rounded-lg transition-all duration-300 z-50 ${
                        openDropdown === item.label ? 'opacity-100 visible' : 'opacity-0 invisible'
                      }`}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <div className="py-2">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            onClick={() => setOpenDropdown(null)}
                            className={`block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-950 transition-colors ${
                              pathname === subItem.href ? 'bg-blue-50 text-blue-950' : ''
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`py-2 px-3 text-gray-700 hover:text-blue-950 transition-colors font-medium whitespace-nowrap ${
                      pathname === item.href ? 'text-blue-950' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <button className="p-2 hover:bg-blue-50 rounded-full transition-colors">
              <Search size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 border-t">
            {navItems.map((item) => (
              <div key={item.label} className="border-b">
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="w-full flex items-center justify-between py-3 px-2 text-gray-700 hover:text-blue-950 transition-colors font-medium"
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="bg-gray-50 py-2">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            onClick={() => setIsOpen(false)}
                            className={`block px-6 py-2 text-gray-600 hover:text-blue-950 transition-colors ${
                              pathname === subItem.href ? 'text-blue-950 font-medium' : ''
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-3 px-2 text-gray-700 hover:text-blue-950 transition-colors font-medium ${
                      pathname === item.href ? 'text-blue-950' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
