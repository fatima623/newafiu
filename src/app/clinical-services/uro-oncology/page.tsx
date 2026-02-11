import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function UroOncologyPage() {
  return (
    <ServiceDetailTemplate
      title="Dialysis"
      description="Hemodialysis services for patients with acute and chronic kidney disease"
      image="/dialysis.jpg"
      details="Our Dialysis unit provides safe, effective hemodialysis for patients with acute and chronic kidney disease. Under the supervision of experienced nephrologists and trained dialysis nurses, we focus on patient comfort, infection control and meticulous monitoring during every session."
      procedures={[
        'Regular maintenance hemodialysis sessions',
        'Emergency hemodialysis for acute kidney injury',
        'Dialysis access care and monitoring',
        'Pre- and post-dialysis clinical assessment',
        'Fluid and electrolyte management',
        'Patient counselling and education on renal diet and lifestyle'
      ]}
      benefits={[
        'Supervision by experienced nephrologists',
        'Dedicated and trained dialysis nursing staff',
        'Strict infection control and safety protocols',
        'Continuous monitoring during treatment',
        'Individualized dialysis prescriptions',
        'Supportive education for patients and families'
      ]}
    />
  );
}
