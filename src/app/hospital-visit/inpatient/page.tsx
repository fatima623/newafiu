export default function InpatientPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Inpatient Admission</h1>
          <p className="text-xl text-blue-100">Information for Hospital Admission</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Admission Process</h2>
            <p className="text-lg text-gray-600 mb-8">
              If you need to be admitted to the hospital, our staff will guide you through the process and ensure your comfort during your stay.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Before Admission</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Complete pre-admission tests</li>
                  <li>• Arrange for attendant if needed</li>
                  <li>• Pack essential items</li>
                  <li>• Inform family members</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">What to Bring</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Personal toiletries</li>
                  <li>• Comfortable clothing</li>
                  <li>• Current medications</li>
                  <li>• Important documents</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">During Your Stay</h3>
              <p className="text-gray-600 mb-4">
                Our nursing staff will provide round-the-clock care. You will have regular visits from your doctor and medical team. Meals will be provided according to your dietary requirements.
              </p>
              <p className="text-gray-600">
                Family members can visit during designated visiting hours. Please check with the nursing station for specific timings.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
