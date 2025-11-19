export default function InpatientPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Inpatient Admission</h1>
          <p className="text-lg text-white">Information for Inpatient Admission</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Inpatient Admission Process</h2>
            <p className="text-lg text-gray-600 mb-8">
              Patients admitted to the Armed Forces Institute of Urology (AFIU) receive consultant-led, multidisciplinary care. The information below outlines the standard process for inpatient admission and preparation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-[#ADD8E6] p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Pre-admission Preparation</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Complete all pre-admission investigations advised by your consultant</li>
                  <li>• Confirm your admission date and reporting time with the hospital</li>
                  <li>• Arrange for a responsible attendant/caregiver, if required</li>
                  <li>• Inform your family members about the planned admission and expected duration of stay</li>
                </ul>
              </div>

              <div className="bg-[#ADD8E6] p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Documents and Personal Items</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• National identity card or other valid identification document</li>
                  <li>• Previous medical records, investigation reports and discharge summaries (if any)</li>
                  <li>• Current medications in their original packaging</li>
                  <li>• Insurance or entitlement documents, if applicable</li>
                  <li>• Limited personal toiletries and comfortable clothing, as permitted by ward policy</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Care During Hospital Stay</h3>
              <p className="text-gray-600 mb-4">
                Our nursing staff will provide round-the-clock care. You will have regular visits from your doctor and medical team. Meals will be provided according to your dietary requirements.
              
                Family members can visit during designated visiting hours. Please check with the nursing station for specific timings.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
