import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function ReconstructivePage() {
  return (
    <ServiceDetailTemplate
      title="Reconstructive Urology"
      description="Advanced surgical reconstruction for complex urological conditions"
      image="https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=600&fit=crop"
      details="Our Reconstructive Urology service specializes in complex surgical procedures to restore normal urinary and reproductive function. We treat conditions such as urethral strictures, vesicovaginal fistulas, and congenital abnormalities using advanced reconstructive techniques. Our surgeons have extensive experience in performing complex reconstructive procedures with excellent outcomes."
      procedures={[
        'Urethral Stricture Repair (Urethroplasty)',
        'Vesicovaginal Fistula Repair',
        'Hypospadias Repair',
        'Pelvic Organ Prolapse Surgery',
        'Urinary Incontinence Surgery',
        'Penile Prosthesis Implantation'
      ]}
      benefits={[
        'Expert reconstructive surgeons',
        'Advanced surgical techniques',
        'Improved quality of life',
        'High success rates',
        'Comprehensive pre and post-operative care',
        'Long-term follow-up support'
      ]}
    />
  );
}
