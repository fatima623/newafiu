import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function UroOncologyPage() {
  return (
    <ServiceDetailTemplate
      title="Uro-Oncology"
      description="Comprehensive cancer care for urological malignancies"
      image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=600&fit=crop"
      details="Our Uro-Oncology department provides comprehensive diagnosis and treatment for all types of urological cancers. We offer the latest surgical techniques including robotic-assisted surgery, along with chemotherapy and immunotherapy options. Our multidisciplinary team works together to provide personalized treatment plans for each patient."
      procedures={[
        'Radical Prostatectomy (Open and Robotic)',
        'Radical Cystectomy with Urinary Diversion',
        'Partial and Radical Nephrectomy',
        'Transurethral Resection of Bladder Tumor (TURBT)',
        'Testicular Cancer Surgery',
        'Lymph Node Dissection'
      ]}
      benefits={[
        'Multidisciplinary cancer care',
        'Robotic-assisted surgery available',
        'Personalized treatment plans',
        'Latest oncological techniques',
        'Comprehensive follow-up care',
        'Support services available'
      ]}
    />
  );
}
