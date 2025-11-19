import { Heart } from 'lucide-react';
import { successStories } from '@/data/siteData';

export default function SuccessStoriesPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Success Stories</h1>
          <p className="text-lg text-white">Real Stories from Our Patients</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Heart size={48} className="text-blue-950 mx-auto mb-4" />
              <p className="text-lg text-gray-600">
                Read inspiring stories from patients who have successfully overcome their urological conditions with our expert care.
              </p>
            </div>

            <div className="space-y-8">
              {successStories.map((story) => (
                <div key={story.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg">
                  <div className="md:flex">
                    {story.image && (
                      <div className="md:w-1/3">
                        <img
                          src={story.image}
                          alt={story.title}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-8 md:w-2/3">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{story.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">{story.patientName} - {new Date(story.date).toLocaleDateString()}</p>
                      <p className="text-gray-600 italic">"{story.story}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-[#ADD8E6] p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Share Your Story</h3>
              <p className="text-gray-600 mb-6">
                Have you been treated at AFIU? We'd love to hear about your experience.
              </p>
              <a href="/contact" className="inline-block bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
