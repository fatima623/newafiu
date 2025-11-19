import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function PediatricUrologySurgeryPage() {
  return (
    <ServiceDetailTemplate
      title="Paediatric Urological Surgery"
      description="Specialised surgical care for urological problems in children"
      image="https://images.unsplash.com/photo-1535916707207-35f97e715e1b?w=1200&h=600&fit=crop"
      details="The Paediatric Urology service provides surgical management for congenital and acquired urological conditions in infants and children. Our team aims to provide child-friendly, family-centred care with long-term follow-up into adolescence where required."
      procedures={[
        'Correction of congenital anomalies such as hypospadias',
        'Surgery for vesico-ureteric reflux and obstructive uropathy',
        'Management of undescended testes and other scrotal conditions',
        'Endoscopic treatment of paediatric stone disease',
        'Reconstructive procedures for paediatric urethral and bladder problems',
        'Collaborative care with paediatric nephrology and other specialties'
      ]}
      benefits={[
        'Care tailored to the needs of children and their families',
        'Use of age-appropriate anaesthesia and pain management protocols',
        'Focus on preserving kidney function and continence',
        'Special attention to long-term growth and development',
        'Multidisciplinary team including paediatric specialists',
        'Family education and support throughout the treatment journey'
      ]}
    />
  );
}
