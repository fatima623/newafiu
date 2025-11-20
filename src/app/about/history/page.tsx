import { Calendar } from 'lucide-react';

export default function HistoryPage() {
  const milestones = [
    { year: '1993', description: 'AFIU was established to provide specialized urological care to armed forces personnel and their families' },
    { year: '1997', description: 'Establishment of ITC & Dialysis Center' },
    { year: '1998', description: 'Establishment of Urodynamic Center' },
    { year: '2001', description: 'Establishment of Lithotripsy Center' },
    { year: '2003', description: 'Establishment of four new operation theaters (4 x OTs)' },
    { year: '2015', description: 'Approval of 250 bed capacity (250 beds approved)' },
    { year: '2018', description: 'Approval of new indoor 250-bedded building from QMG (at present 90% construction completed)' },
    { year: '2021', description: 'Commissioning of new OPD complex' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Brief History</h1>
          <p className="text-lg text-white">
            Our Journey of Excellence Since 1999
          </p>
        </div>
      </section>

      {/* History Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-4 text-justify">
	Armed Forces Institute of Urology (AFIU) Rawalpindi provides specialized care for patients suffering from urological disorders. It is dedicated centre for Urological diseases and Renal Transplant. Inaugurated on 1993. First transplant was done in year 1996. Till Oct 2025 around 783 renal transplant have been carried out.   
                </p>
            </div>

            {/* Timeline */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">Key Milestones</h3>
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-blue-950 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {milestone.year}
                      </div>
                    </div>
                    <div className="flex-grow flex items-center">
                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
