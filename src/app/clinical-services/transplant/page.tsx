import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function TransplantPage() {
  return (
    <ServiceDetailTemplate
      title="Renal Transplant Service"
      description="Multidisciplinary care for patients undergoing kidney transplantation"
      image="https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=600&fit=crop"
      details="The Renal Transplant Service offers comprehensive care for patients with end-stage renal disease who are candidates for kidney transplantation. A multidisciplinary team of nephrologists, urologists, anaesthetists and specialised nurses works together to provide safe surgery and long-term follow-up."
      procedures={[
        'Pre-transplant evaluation and work-up of recipients',
        'Donor assessment and counselling',
        'Living related and other approved transplant procedures',
        'Renal transplant surgery and immediate post-operative care',
        'Immunosuppression management and monitoring',
        'Long-term follow-up and graft function surveillance'
      ]}
      benefits={[
        'Multidisciplinary transplant team',
        'Individualised assessment and counselling for patients and donors',
        'Standardised protocols for peri-operative care',
        'Close monitoring to minimise complications and rejection',
        'Education on medication adherence and lifestyle after transplant',
        'Supportive follow-up focused on long-term graft survival'
      ]}
    />
  );
}
