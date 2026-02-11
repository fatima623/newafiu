import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function WardsPage() {
  return (
    <ServiceDetailTemplate
      title="Wards"
      description="Modern inpatient facilities with 24/7 nursing care"
      image="/wards.jpg"
      details="Our inpatient wards provide comfortable and well-equipped facilities for patients requiring hospitalization. With round-the-clock nursing care and modern amenities, we ensure that patients receive the best possible care during their stay. Our wards are designed to promote healing and recovery in a comfortable environment."
      procedures={[
        'Post-operative care and monitoring',
        'Inpatient medical management',
        'Pre-operative preparation',
        'Pain management',
        'Wound care and dressing',
        'Catheter care and management'
      ]}
      benefits={[
        '24/7 nursing care',
        'Modern and comfortable rooms',
        'Advanced monitoring equipment',
        'Dedicated medical staff',
        'Visitor-friendly policies',
        'Nutritious meal services'
      ]}
    />
  );
}
