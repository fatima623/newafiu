'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { contactInfo } from '@/data/siteData';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const hideOnDashboard = pathname?.startsWith('/admin/dashboard');
  const hideOnLogin = pathname?.startsWith('/admin/login');

  if (hideOnDashboard || hideOnLogin) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-8xl mx-auto px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-y-8 lg:gap-x-8">
          {/* About Section */}
          <div className="ms-8 sm:ms-16 md:ms-8 lg:ms-1 xl:ms-1 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/afiulogo.png"
                alt="AFIU Logo"
                className="w-10 h-10 object-contain bg-white rounded p-0.5"
              />
              <div>
                <h3 className="text-lg font-bold">AFIU</h3>
                <p className="text-xs text-gray-400">Armed Forces Institute of Urology</p>
              </div>
            </div>
            <li className="flex items-start gap-2 text-sm">
                <MapPin size={16} className="flex-shrink-0 text-blue-400" />
                <span className="text-gray-400">Location</span>
            </li>
            <div>
              <div className="relative w-full rounded-lg overflow-hidden border border-gray-700">
                <iframe
                  src="https://maps.google.com/maps?layer=c&cbll=33.581419,73.046959&cbp=11,0,0,0,0&output=svembed"
                  width="100%"
                  height="128"
                  style={{ border: 0 }}
                  className="block"
                />
                <a 
                  href="https://www.google.com/maps/search/33.581419,+73.046959"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex justify-center"
                >
                  <span className="px-3 py-1 bg-blue-600 text-white rounded text-xs">
                    View Map
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="ms-16">
            <h3 className="text-base font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about/mission" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Mission Statement
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Our Faculty
                </Link>
              </li>
              <li>
                <Link href="/clinical-services" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Clinical Services
                </Link>
              </li>
              <li>
                <Link href="/news-events" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  News & Events
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="ms-8 sm:ms-16 md:ms-8 lg:ms-8 xl:ms-8">
            <h3 className="text-base font-bold mb-3">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/clinical-services/endourology" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Endourology
                </Link>
              </li>
              <li>
                <Link href="/clinical-services/uro-oncology" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Uro-Oncology
                </Link>
              </li>
              <li>
                <Link href="/clinical-services/endourology/reconstructive-surgery" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Reconstructive Urology
                </Link>
              </li>
              <li>
                <Link href="/clinical-services/endourology/pediatric-urology" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Pediatric Urology
                </Link>
              </li>
              <li>
                <Link href="/clinical-services/reconstructive" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Lithotripsy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="ms-8 sm:ms-16 md:ms-16 lg:ms-1 xl:ms-1">
            <h3 className="text-base font-bold mb-3">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin size={16} className="mt-1 flex-shrink-0 text-blue-400" />
                <span className="text-gray-400">{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone size={16} className="flex-shrink-0 text-blue-400" />
                <a href={`tel:${contactInfo.phone}`} className="text-gray-400 hover:text-blue-400 transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail size={16} className="flex-shrink-0 text-blue-400" />
                <a href={`mailto:${contactInfo.email}`} className="text-gray-400 hover:text-blue-400 transition-colors">
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Clock size={16} className="mt-1 flex-shrink-0 text-blue-400" />
                <span className="text-gray-400">{contactInfo.timings}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex justify-center items-center">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} Armed Forces Institute of Urology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
