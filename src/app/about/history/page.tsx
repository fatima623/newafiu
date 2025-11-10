import { Calendar } from 'lucide-react';

export default function HistoryPage() {
  const milestones = [
    { year: '1999', title: 'Foundation', description: 'AFIU was established to provide specialized urological care to armed forces personnel and their families' },
    { year: '2005', title: 'Expansion', description: 'Major expansion of facilities including new operation theaters and diagnostic equipment' },
    { year: '2010', title: 'Research Center', description: 'Establishment of dedicated research wing for urological studies and clinical trials' },
    { year: '2015', title: 'Robotic Surgery', description: 'Introduction of robotic-assisted surgical systems for minimally invasive procedures' },
    { year: '2020', title: 'Center of Excellence', description: 'Recognized as a regional center of excellence in urological care' },
    { year: '2024', title: 'Continued Growth', description: 'Ongoing expansion and adoption of latest technologies and treatment methods' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Brief History</h1>
          <p className="text-xl text-blue-100">
            Our Journey of Excellence Since 1999
          </p>
        </div>
      </section>

      {/* History Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-4">
                Armed Forces Institute of Urology (AFIU) was established in 1999 with a vision to provide world-class urological care to the armed forces community and beyond. Over the years, we have grown from a small specialized unit to a comprehensive urological center of excellence.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Our journey has been marked by continuous innovation, dedication to patient care, and commitment to medical excellence. Today, AFIU stands as one of the leading urological institutes in the region, equipped with state-of-the-art facilities and staffed by highly qualified medical professionals.
              </p>
            </div>

            {/* Timeline */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">Key Milestones</h3>
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-blue-950 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {milestone.year}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{milestone.title}</h4>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Achievements</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Calendar size={20} className="text-blue-950 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Over 10,000 successful surgical procedures performed</span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar size={20} className="text-blue-950 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Trained hundreds of urologists and medical professionals</span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar size={20} className="text-blue-950 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Published numerous research papers in international journals</span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar size={20} className="text-blue-950 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Established partnerships with leading international medical institutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar size={20} className="text-blue-950 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Received multiple awards for excellence in healthcare delivery</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
