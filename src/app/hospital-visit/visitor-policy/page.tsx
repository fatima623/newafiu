import { Users, Clock, AlertCircle } from 'lucide-react';

export default function VisitorPolicyPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Visitor Policy</h1>
          <p className="text-xl text-blue-100">Guidelines for Visitors and Attendants</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-blue-50 p-6 rounded-lg">
                <Clock size={32} className="text-blue-950 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">Visiting Hours</h3>
                <p className="text-gray-600 mb-2"><strong>General Wards:</strong></p>
                <p className="text-gray-600 mb-4">4:00 PM - 7:00 PM daily</p>
                <p className="text-gray-600 mb-2"><strong>Private Rooms:</strong></p>
                <p className="text-gray-600">10:00 AM - 8:00 PM daily</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <Users size={32} className="text-blue-950 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">Visitor Limits</h3>
                <p className="text-gray-600 mb-4">
                  Maximum 2 visitors per patient at a time
                </p>
                <p className="text-gray-600">
                  One attendant allowed to stay overnight with prior approval
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle size={24} className="text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Important Guidelines</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• All visitors must register at the reception</li>
                    <li>• Children under 12 are not allowed in patient areas</li>
                    <li>• Maintain silence in hospital premises</li>
                    <li>• Do not bring outside food without permission</li>
                    <li>• Follow hand hygiene protocols</li>
                    <li>• Visitors with infectious diseases should not visit</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Attendant Policy</h3>
              <p className="text-gray-600 mb-4">
                One attendant may stay with the patient overnight if medically necessary. The attendant must:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Obtain permission from the nursing staff</li>
                <li>• Carry a valid ID card</li>
                <li>• Follow all hospital rules and regulations</li>
                <li>• Not interfere with medical procedures</li>
                <li>• Maintain cleanliness in the patient area</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
