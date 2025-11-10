import Link from 'next/link';
import { ArrowRight, Award, Users, Heart, Stethoscope } from 'lucide-react';
import HeroSlider from '@/components/ui/HeroSlider';
import ServiceCard from '@/components/ui/ServiceCard';
import FacultyCard from '@/components/ui/FacultyCard';
import NewsCard from '@/components/ui/NewsCard';
import { heroSlides, services, faculty, newsEvents, statistics } from '@/data/siteData';

export default function Home() {
  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider slides={heroSlides} />

      {/* Welcome Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Welcome to Armed Forces Institute of Urology
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              At Armed Forces Institute of Urology (AFIU), Rawalpindi, we strive to provide the best possible healthcare to our patients. We endeavor to reach the highest level of skills and professionalism required for patients' satisfaction as well as service excellence.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              The Institute is committed to comply with all the requirements of quality, environment, health & safety and all applicable standards. Thank you for selecting AFIU. It is our honour and privilege to take care of you and your loved ones.
            </p>
            <Link
              href="/about/mission"
              className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Learn More About Us
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-blue-950 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-xl text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Clinical Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive urological care with state-of-the-art facilities and expert medical professionals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/clinical-services"
              className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Services
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Expert Faculty</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our team of highly qualified urologists and medical professionals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faculty.slice(0, 6).map((member) => (
              <FacultyCard key={member.id} faculty={member} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/faculty"
              className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Faculty
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gradient-to-br from-blue-950 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose AFIU?</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Excellence in urological care backed by expertise and technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={32} className="text-blue-950" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Team</h3>
              <p className="text-blue-100">
                Highly qualified urologists with years of experience
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope size={32} className="text-blue-950" />
              </div>
              <h3 className="text-xl font-bold mb-2">Advanced Technology</h3>
              <p className="text-blue-100">
                State-of-the-art equipment and modern facilities
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-blue-950" />
              </div>
              <h3 className="text-xl font-bold mb-2">Patient Care</h3>
              <p className="text-blue-100">
                Compassionate care focused on patient satisfaction
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-blue-950" />
              </div>
              <h3 className="text-xl font-bold mb-2">Comprehensive Services</h3>
              <p className="text-blue-100">
                Complete range of urological treatments and procedures
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News & Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Latest News & Events</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest happenings at AFIU
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsEvents.slice(0, 3).map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/news-events"
              className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View All News & Events
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-950 to-blue-800 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Schedule an Appointment for Consultation</h2>
            <p className="text-xl mb-8 text-blue-100">
              Our expert team is ready to provide you with the best urological care
            </p>
            <Link
              href="/hospital-visit/booking"
              className="inline-block bg-white text-blue-950 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              Request Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
