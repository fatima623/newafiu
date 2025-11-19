import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function TumorSurgeryPage() {
  return (
    <ServiceDetailTemplate
      title="Tumor Surgery"
      description="Surgical management of urological tumours involving kidney, bladder, prostate and testis"
      image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=600&fit=crop"
      details="The Tumor Surgery service provides operative treatment for a wide range of urological cancers. Working closely with oncology and radiology teams, we offer organ-preserving and radical procedures based on international guidelines and individual patient needs."
      procedures={[
        'Radical and partial nephrectomy for renal tumours',
        'Transurethral resection of bladder tumour (TURBT)',
        'Radical cystectomy with urinary diversion (where indicated)',
        'Radical prostatectomy for prostate cancer',
        'Orchiectomy and retroperitoneal lymph node dissection for testicular tumours',
        'Lymph node dissections for advanced urological malignancies'
      ]}
      benefits={[
        'Multidisciplinary approach with tumour boards and joint decision-making',
        'Use of organ-preserving techniques where appropriate',
        'Adherence to evidence-based oncological guidelines',
        'Access to advanced imaging and peri-operative care',
        'Comprehensive counselling of patients and families',
        'Structured follow-up and surveillance programmes'
      ]}
    />
  );
}
