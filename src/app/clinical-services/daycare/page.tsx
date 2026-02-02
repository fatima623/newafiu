import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function DaycarePage() {
  return (
    <ServiceDetailTemplate
      title="Day Care Services"
      description="Same-day procedures and treatments in a comfortable setting"
      image="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=600&fit=crop"
      details="Our Daycare facility offers minor urological procedures and treatments that do not require overnight hospitalization. Patients can receive quality care in a comfortable environment and return home the same day. Our daycare services are designed to provide efficient, cost-effective treatment while maintaining the highest standards of medical care. With 37 years of excellence, over 140,249 surgeries performed, 1,190,419 patients treated, and 37+ expert doctors, we deliver world-class daycare surgical services."
      procedures={[
        'URS (Ureteroscopy) - Minimally invasive stone removal',
        'Botox Injections - For overactive bladder and urological conditions',
        'Meatoplasty - Surgical correction of urethral meatus',
        'Circumcision - Safe and professional procedure',
        'PPV (Preputioplasty) - Foreskin correction surgery',
        'Orchidopexy - Surgical treatment for undescended testicle',
        'Cystoscopy and bladder procedures',
        'Minor stone removal procedures',
        'Urethral dilatation',
        'Catheter changes and management',
        'Injection therapies'
      ]}
      benefits={[
        'No overnight stay required',
        'Cost-effective treatment option',
        'Comfortable and private setting',
        'Quick recovery time',
        'Reduced hospital stay',
        'Expert nursing care',
        '37+ years of surgical excellence',
        'Over 140,249 successful surgeries',
        '37+ expert doctors on staff'
      ]}
    />
  );
}
