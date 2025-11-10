import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function DaycarePage() {
  return (
    <ServiceDetailTemplate
      title="Daycare Services"
      description="Same-day procedures and treatments in a comfortable setting"
      image="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=600&fit=crop"
      details="Our Daycare facility offers minor urological procedures and treatments that do not require overnight hospitalization. Patients can receive quality care in a comfortable environment and return home the same day. Our daycare services are designed to provide efficient, cost-effective treatment while maintaining the highest standards of medical care."
      procedures={[
        'Cystoscopy and bladder procedures',
        'Minor stone removal procedures',
        'Urethral dilatation',
        'Catheter changes and management',
        'Injection therapies',
        'Minor surgical procedures'
      ]}
      benefits={[
        'No overnight stay required',
        'Cost-effective treatment option',
        'Comfortable and private setting',
        'Quick recovery time',
        'Reduced hospital stay',
        'Expert nursing care'
      ]}
    />
  );
}
