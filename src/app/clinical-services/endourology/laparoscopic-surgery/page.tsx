import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function LaparoscopicSurgeryPage() {
  return (
    <ServiceDetailTemplate
      title="Laparoscopic & Minimally Invasive Surgery"
      description="Keyhole surgical procedures for a variety of urological conditions"
      image="https://images.unsplash.com/photo-1535916707207-35f97e715e1b?w=1200&h=600&fit=crop"
      details="Our Laparoscopic and minimally invasive surgery service offers keyhole procedures for conditions such as kidney tumours, ureteric strictures and non-functioning kidneys. These techniques aim to reduce pain, blood loss and hospital stay while achieving excellent surgical outcomes."
      procedures={[
        'Laparoscopic nephrectomy (simple, partial and radical)',
        'Laparoscopic pyeloplasty for pelvi-ureteric junction obstruction',
        'Laparoscopic ureteric reimplantation and reconstruction',
        'Laparoscopic adrenalectomy (where indicated)',
        'Laparoscopic procedures for selected pelvic and retroperitoneal pathologies',
        'Use of advanced energy devices and imaging guidance'
      ]}
      benefits={[
        'Smaller incisions and improved cosmetic results',
        'Less post-operative pain and faster mobilisation',
        'Shorter hospital stay and quicker return to routine activities',
        'Reduced blood loss and complication rates in selected patients',
        'Enhanced visualisation of operative field with magnified views',
        'Procedures performed by trained minimally invasive surgeons'
      ]}
    />
  );
}
