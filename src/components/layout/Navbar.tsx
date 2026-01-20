'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Calendar, Search } from 'lucide-react';
import { navItems } from '@/data/siteData';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const navbarRef = useRef<HTMLElement | null>(null);
  const [isBrandAnimated, setIsBrandAnimated] = useState(false);

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

  // Trigger brand animations when navbar enters the viewport (on load and when scrolling back to top)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const navElement = navbarRef.current;
    if (!navElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsBrandAnimated(entry.isIntersecting);
      },
      {
        threshold: 0.6,
      }
    );

    observer.observe(navElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleDropdown = (label: string) => {
    const next = openDropdown === label ? null : label;
    setOpenDropdown(next);
    if (next === null) {
      setOpenSubmenu(null);
    }
  };

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <nav className="w-full" ref={navbarRef}>
      {/* Top White Section */}
      <div className="w-full bg-white">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center py-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/afiulogo.png" 
                alt="AFIU Logo" 
                className={`w-20 h-20 object-contain ${isBrandAnimated ? 'logo-spin-in' : ''}`}
              />
              <div className="hidden md:block">
                <h1 className={`text-3xl font-bold text-blue-950 ${isBrandAnimated ? 'brand-title-animate' : ''}`}>AFIU</h1>
                <p className={`text-lg text-blue-950 ${isBrandAnimated ? 'brand-subtitle-animate' : ''}`}>
                  Armed Forces Institute of Urology
                </p>
              </div>
            </Link>

            {/* Appointment Button */}
            <div className="flex items-center">
              <Link
                href="/hospital-visit/booking"
                className="inline-flex items-center gap-2 bg-blue-950 text-white font-bold px-4 py-2 rounded transition-colors"
              >
                <Calendar size={18} />
                <span className="hidden sm:inline">Appointment</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="ml-4 p-2 text-blue-950 hover:bg-gray-100 rounded lg:hidden"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Blue Navigation Section */}
      <div className="w-full bg-blue-950 text-white">
        <div className="w-full max-w-[1920px] mx-auto px-2 sm:px-2 lg:px-2">
          <div className="flex justify-between items-center py-2 border-t border-blue-800">
            {/* Navigation Links */}
            <div className="hidden lg:block w-full">
              <div className="flex flex-wrap items-center">
                {navItems.map((item) => {
                  const baseLinkClasses = `py-2 text-sm font-medium hover:bg-blue-800 rounded transition-colors ${
                    pathname === item.href ? 'text-white font-semibold' : 'text-blue-100 hover:text-white'
                  }`;
                  return (
                    <div
                      key={item.label}
                      className="relative group"
                      ref={(el) => {
                        if (item.subItems) {
                          dropdownRefs.current[item.label] = el;
                        }
                      }}
                      onMouseEnter={() => item.subItems && setOpenDropdown(item.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {item.subItems ? (
                        <Link
                          href={item.href}
                          className={`${baseLinkClasses} px-4 flex items-center gap-1 rounded`}
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            size={14}
                            className={`transform transition-transform ${
                              openDropdown === item.label ? 'rotate-180' : ''
                            }`}
                          />
                        </Link>
                      ) : (
                        <Link
                          href={item.href}
                          className={`${baseLinkClasses} px-4`}
                        >
                          {item.label}
                        </Link>
                      )}
                      {item.subItems && openDropdown === item.label && (
                        <div
                          className="absolute left-0 w-56 bg-white shadow-lg rounded-md z-10"
                          onMouseEnter={() => setOpenDropdown(item.label)}
                          onMouseLeave={() => {
                            setOpenDropdown(null);
                            setOpenSubmenu(null);
                          }}
                        >
                          <div className="py-1">
                            {item.subItems.map((subItem) => {
                              const hasChildren = !!subItem.subItems && subItem.subItems.length > 0;
                              const isOpenSubmenu = openSubmenu === subItem.label;

                              if (hasChildren) {
                                return (
                                  <div key={subItem.href} className="relative">
                                    <button
                                      type="button"
                                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm ${
                                        pathname === subItem.href
                                          ? 'bg-blue-50 text-blue-900'
                                          : 'text-gray-800 hover:bg-blue-50'
                                      }`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleSubmenu(subItem.label);
                                      }}
                                    >
                                      <span>{subItem.label}</span>
                                      <span className="ml-2 text-gray-400">›</span>
                                    </button>

                                    {isOpenSubmenu && subItem.subItems && (
                                      <div className="absolute left-full top-0 w-64 bg-white shadow-lg rounded-md z-20">
                                        <div className="py-1">
                                          {subItem.subItems.map((child) => (
                                            <Link
                                              key={child.href}
                                              href={child.href}
                                              className={`block px-4 py-2 text-sm ${
                                                pathname === child.href
                                                  ? 'bg-blue-50 text-blue-900'
                                                  : 'text-gray-800 hover:bg-blue-50'
                                              }`}
                                              onClick={() => setOpenDropdown(null)}
                                            >
                                              {child.label}
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              }

                              return (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className={`block px-4 py-2 text-sm ${
                                    pathname === subItem.href
                                      ? 'bg-blue-50 text-blue-900'
                                      : 'text-gray-800 hover:bg-blue-50'
                                  }`}
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  {subItem.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-blue-950 text-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="w-full flex justify-between items-center px-3 py-3 rounded-md text-base font-medium text-white hover:bg-blue-800"
                    >
                      <span>{item.label}</span>
                      <ChevronDown size={16} className={`transform transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.label && (
                      <div className="pl-4 space-y-1 bg-blue-800 rounded-b-md">
                        {item.subItems.map((subItem) => (
                          subItem.subItems && subItem.subItems.length > 0 ? (
                            <div key={subItem.href} className="pt-1 pb-1">
                              <Link
                                href={subItem.href}
                                className={`block px-3 py-2 rounded-md text-sm font-medium ${pathname === subItem.href ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'}`}
                                onClick={() => setIsOpen(false)}
                              >
                                {subItem.label}
                              </Link>
                              <div className="mt-1 pl-3 space-y-1">
                                {subItem.subItems.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className={`block px-3 py-2 rounded-md text-sm font-medium ${pathname === child.href ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'}`}
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`block px-3 py-2 rounded-md text-sm font-medium ${pathname === subItem.href ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'}`}
                              onClick={() => setIsOpen(false)}
                            >
                              {subItem.label}
                            </Link>
                          )
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`block px-3 py-3 rounded-md text-base font-medium ${pathname === item.href ? 'bg-blue-700 text-white' : 'text-white hover:bg-blue-800'}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
