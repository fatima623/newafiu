import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function ReconstructivePage() {
  return (
    <ServiceDetailTemplate
      title="ESWL (Lithotripsy)"
      description="Non-invasive shock-wave treatment for kidney and ureteric stones"
      image="https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=600&fit=crop"
      details="Our ESWL (Extra-corporeal Shock Wave Lithotripsy) service offers non-invasive treatment for selected kidney and ureteric stones. High-energy shock waves are focused on the stone to break it into smaller fragments that can pass naturally through the urinary tract, avoiding open surgery in many cases."
      procedures={[
        'Evaluation and selection of patients suitable for ESWL',
        'Image-guided targeting of renal and ureteric stones',
        'Shock-wave lithotripsy sessions under monitoring',
        'Post-procedure assessment and imaging',
        'Medical management to aid stone fragment passage',
        'Follow-up planning to prevent stone recurrence'
      ]}
      benefits={[
        'Non-invasive, no surgical incision required',
        'Usually performed as a day care procedure',
        'Shorter recovery time and early return to routine activities',
        'Reduced risk of complications compared to open surgery',
        'Image-guided precision targeting of stones',
        'Comprehensive follow-up and preventive counselling'
      ]}
    />
  );
}
