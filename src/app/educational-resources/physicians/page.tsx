export default function PhysiciansPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">For Physicians</h1>
          <p className="text-lg text-white">Professional Resources and Referral Information</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Referral Information</h2>
            <p className="text-lg text-gray-600 mb-8">
              AFIU welcomes referrals from healthcare professionals. We provide comprehensive urological consultations and treatment services for your patients.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-[#ADD8E6] p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Referral Process</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Complete referral form with patient details</li>
                  <li>• Include relevant medical history and investigations</li>
                  <li>• Fax or email to our referral coordinator</li>
                  <li>• Patient will be contacted within 48 hours</li>
                </ul>
              </div>

              <div className="bg-[#ADD8E6] p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Contact Information</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Phone:+92 51 5562331 </li>
                  <li>• Email: referrals@afiu.org.pk</li>
                  <li>• Fax: +92 51 9270078</li>
                  <li>• Hours: Mon-Fri 8AM-4PM</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">Clinical Guidelines</h3>
            <p className="text-gray-600 mb-6">
              Access our institutional clinical guidelines and treatment protocols for various urological conditions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
