import Link from 'next/link';
import { ArrowRight, Award, Users, Heart, Stethoscope } from 'lucide-react';
import HeroSlider from '@/components/ui/HeroSlider';
import ServiceCard from '@/components/ui/ServiceCard';
import FacultyCard from '@/components/ui/FacultyCard';
import NewsCard from '@/components/ui/NewsCard';
import AnimatedStatsSection from '@/components/ui/AnimatedStatsSection';
import { heroSlides, services, faculty, newsEvents, statistics, commandant } from '@/data/siteData';

export default function Home() {
  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider slides={heroSlides} />

      {/* Welcome Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10 fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                {commandant.welcomeMessage.title}
              </h2>
            </div>
            
            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Commandant Section */}
              <div className="lg:col-span-1 fade-in-up">
                <div className="flex flex-col items-start text-left">
                  {/* Commandant Photo */}
                  <div className="w-48 h-56 overflow-hidden mb-6 shadow-lg rounded-lg">
                    <img 
                      src={commandant.image} 
                      alt={commandant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Commandant Details */}
                  <div className="space-y-2 text-left">
                    <div className="text-sm text-gray-500 italic">(Professor)</div>
                    <h3 className="text-xl font-bold text-gray-800s leading-tight">
                      Dr. Haroon Sabir Khan
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1 leading-tight">
                      <div>MBBS, FCPS (Surgery), FCPS (Urology),</div>
                      <div>FEBU (Europe), MHPE (RIU),</div>
                    </div>
                    <div className="text-sm font-medium text-blue-950 mt-3 space-y-1 leading-tight">
                      <div>Consultant Urologist & Transplant Surgeon</div>
                      
                      <div>Commandant AFIU</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8 fade-in-right">
                <p className="text-lg text-gray-700 leading-relaxed text-justify">
                  {commandant.welcomeMessage.description}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed font-medium text-justify">
                  {commandant.welcomeMessage.closingMessage}
                </p>
                <div className="pt-4">
                  <Link
                    href="/about/mission"
                    className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Learn More About Us
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <AnimatedStatsSection stats={statistics} />

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
      <section className="py-16 bg-blue-950 text-white">
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

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-[#ADD8E6] rounded-2xl shadow-lg p-12 text-center text-gray-800">
            <h2 className="text-4xl font-bold mb-4">Schedule an Appointment for Consultation</h2>
            <p className="text-xl mb-8 text-gray-800">
              Our expert team is ready to provide you with the best urological care
            </p>
            <Link
              href="/hospital-visit/booking"
              className="inline-block bg-blue-950 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
