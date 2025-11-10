'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { contactInfo } from '@/data/siteData';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/afiulogo.jpg"
                alt="AFIU Logo"
                className="w-12 h-12 object-contain bg-white rounded-lg p-1"
              />
              <div>
                <h3 className="text-lg font-bold">AFIU</h3>
                <p className="text-xs text-gray-400">Armed Forces Institute of Urology</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Providing excellence in urological care with state-of-the-art facilities and expert medical professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
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
          <div>
            <h3 className="text-lg font-bold mb-4">Our Services</h3>
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
                <Link href="/clinical-services/reconstructive" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Reconstructive Urology
                </Link>
              </li>
              <li>
                <Link href="/clinical-services/opd" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  OPD
                </Link>
              </li>
              <li>
                <Link href="/clinical-services/daycare" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Daycare
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
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

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex gap-4 mb-4 md:mb-0">
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-950 transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-950 transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-950 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-950 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-950 transition-colors">
              <Youtube size={20} />
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Armed Forces Institute of Urology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
