export default function GuidelinesPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Institutional Guidelines</h1>
          <p className="text-lg text-white">Clinical Protocols and Treatment Standards</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-lg text-gray-600 mb-8">
              AFIU follows evidence-based clinical guidelines and maintains high standards of care through institutional protocols.
            </p>

            <div className="space-y-4">
              {['Antibiotic Prophylaxis Guidelines', 'Post-Operative Care Protocols', 'Pain Management Guidelines', 'Infection Control Measures', 'Quality Assurance Standards'].map((guideline, index) => (
                <div key={index} className="bg-[#ADD8E6] border-b p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{guideline}</h3>
                  <p className="text-gray-600">Comprehensive guidelines for clinical practice</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
