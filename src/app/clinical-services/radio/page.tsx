import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function RadiologyPage() {
  return (
    <ServiceDetailTemplate
      title="Radiology Department"
      description="Comprehensive imaging support for urological and renal conditions"
      image="https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=600&fit=crop"
      details="The Radiology Department provides a full range of imaging services to support the diagnosis and management of urological and nephrological diseases. Using modern equipment and image-guided techniques, our team delivers timely and accurate reports to assist clinical decision making."
      procedures={[
        'Ultrasound of kidneys, ureters, bladder and prostate',
        'Doppler studies for renal and vascular assessment',
        'Plain and contrast X-ray imaging (where appropriate)',
        'CT imaging for urolithiasis and urological tumours',
        'Image-guided drainage and interventional procedures',
        'Collaborative review of imaging with clinical teams'
      ]}
      benefits={[
        'State-of-the-art imaging technology',
        'Radiologists experienced in urological and renal imaging',
        'Rapid report turnaround to support timely treatment',
        'Image-guided interventions for selected conditions',
        'Close collaboration with urology and nephrology teams',
        'Focus on patient safety and radiation dose optimisation'
      ]}
    />
  );
}
