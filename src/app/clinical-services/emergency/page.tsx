import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function EmergencyPage() {
  return (
    <ServiceDetailTemplate
      title="Emergency"
      description="Urgent urological evaluation and support for acute presentations"
      image="https://images.unsplash.com/photo-1580281657527-47f249e8f7b5?w=1200&h=600&fit=crop"
      details="Emergency services provide timely assessment and initial management for acute urological conditions, with appropriate coordination for investigations, procedures and admission when required."
      procedures={[
        'Initial assessment and triage',
        'Pain management and stabilisation',
        'Emergency catheterisation and bladder decompression',
        'Urgent imaging and laboratory investigations',
        'Coordination for emergency procedures and admissions',
        'Follow-up planning and referral where required'
      ]}
      benefits={[
        '24/7 urgent support for acute urological conditions',
        'Rapid assessment and timely decision-making',
        'Coordination with diagnostics and surgical teams',
        'Prompt relief of pain and urinary obstruction',
        'Appropriate admission and inpatient care pathways',
        'Clear post-emergency follow-up guidance'
      ]}
    />
  );
}
