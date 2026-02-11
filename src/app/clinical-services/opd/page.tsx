import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function OPDPage() {
  return (
    <ServiceDetailTemplate
      title="OPD (Outpatient Department)"
      description="Comprehensive outpatient diagnostic and consultation services"
      image="/UROLOGY OPD.jpg"
      details="Our Outpatient Department (OPD) provides comprehensive urological consultations and diagnostic services. Our experienced urologists conduct thorough examinations and provide expert advice for various urological conditions. The OPD is equipped with modern diagnostic facilities to ensure accurate diagnosis and appropriate treatment planning."
      procedures={[
        'Initial consultation and examination',
        'Follow-up consultations',
        'Diagnostic procedures (Uroflowmetry, Ultrasound)',
        'Minor procedures and treatments',
        'Pre-operative assessments',
        'Post-operative follow-ups'
      ]}
      benefits={[
        'Expert urological advice',
        'Modern diagnostic facilities',
        'Convenient appointment scheduling',
        'Comprehensive care coordination'
      ]}
    />
  );
}
