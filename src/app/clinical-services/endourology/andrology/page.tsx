import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function AndrologySurgeryPage() {
  return (
    <ServiceDetailTemplate
      title="Andrology & Men’s Health Surgery"
      description="Surgical care for male reproductive and sexual health conditions"
      image="https://images.unsplash.com/photo-1535916707207-35f97e715e1b?w=1200&h=600&fit=crop"
      details="Our Andrology service provides surgical management for male infertility, erectile dysfunction and other disorders of the male reproductive system. Care is delivered with confidentiality, respect and a focus on improving quality of life."
      procedures={[
        'Varicocele ligation for selected infertility cases',
        'Vasectomy and vasectomy reversal (where appropriate)',
        'Penile prosthesis implantation for severe erectile dysfunction',
        'Surgical correction of penile curvature (Peyronie’s disease)',
        'Microsurgical procedures for obstructive azoospermia (where available)',
        'Adjunct procedures in collaboration with fertility specialists'
      ]}
      benefits={[
        'Dedicated focus on male reproductive and sexual health',
        'Confidential and patient-centred counselling',
        'Range of surgical options tailored to individual needs',
        'Close coordination with fertility and psychology services',
        'Evidence-based protocols for andrological conditions',
        'Supportive follow-up for patients and partners'
      ]}
    />
  );
}
