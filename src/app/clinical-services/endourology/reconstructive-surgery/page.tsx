import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function ReconstructiveSurgeryPage() {
  return (
    <ServiceDetailTemplate
      title="Reconstructive Urological Surgery"
      description="Advanced reconstruction for complex urethral and genital conditions"
      image="https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=600&fit=crop"
      details="The Reconstructive Surgery service deals with complex problems affecting the urethra, bladder outlet and genitalia. Using specialised techniques and grafts, our surgeons aim to restore urinary and sexual function and improve quality of life."
      procedures={[
        'Urethroplasty for anterior and posterior urethral strictures',
        'Repair of urethral trauma and false passages',
        'Surgery for urinary fistulae (e.g. vesicovaginal, urethrocutaneous)',
        'Correction of penile curvature and structural abnormalities',
        'Revision of previous failed reconstructive procedures',
        'Combined reconstructive procedures with other specialties where required'
      ]}
      benefits={[
        'Care delivered by surgeons experienced in reconstructive urology',
        'Individualised surgical planning based on stricture site and length',
        'Use of contemporary graft and flap techniques',
        'Focus on functional and cosmetic outcomes',
        'Comprehensive pre-operative counselling and post-operative follow-up',
        'Multidisciplinary input for complex cases'
      ]}
    />
  );
}
