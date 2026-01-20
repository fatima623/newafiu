import { Building, Utensils, Wifi, ShoppingBag, Heart, Shield } from 'lucide-react';

export default function FacilitiesPage() {
  const facilities = [
    { icon: Building, title: 'Modern Infrastructure', description: 'State-of-the-art building with advanced medical equipment' },
    { icon: Utensils, title: 'Cafeteria', description: 'Nutritious meals and refreshments available' },
    { icon: ShoppingBag, title: 'Pharmacy', description: 'On-site pharmacy for convenient medication access' },
    { icon: Heart, title: 'Prayer Room', description: 'Dedicated spaces for prayer and meditation' },
    { icon: Shield, title: '24/7 Security', description: 'Round-the-clock security for patient safety' },
  ];

  return (
    <div>
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Hospital Facilities</h1>
          <p className="text-lg text-white">Available Amenities and Services</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Facilities</h2>
              <p className="text-lg text-gray-600">
                AFIU provides modern facilities and amenities to ensure patient comfort and convenience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facilities.map((facility, index) => {
                const Icon = facility.icon;
                return (
                  <div key={index} className="bg-[#ADD8E6] p-6 rounded-lg hover:shadow-lg transition-shadow">
                    <Icon size={40} className="text-blue-950 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{facility.title}</h3>
                    <p className="text-gray-600">{facility.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Additional Services</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 list-disc pl-6">
                <li>ATM facility available</li>
                <li>Wheelchair accessibility</li>
                <li>Ambulance service</li>
                <li>Blood bank</li>
                <li>Diagnostic laboratory</li>
                <li>Radiology services</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
