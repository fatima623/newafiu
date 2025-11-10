import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function EndourologyPage() {
  return (
    <ServiceDetailTemplate
      title="Endourology"
      description="Minimally invasive procedures for kidney stones and urinary tract conditions"
      image="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&h=600&fit=crop"
      details="Our Endourology department specializes in minimally invasive procedures for the treatment of kidney stones and other urinary tract conditions. Using advanced endoscopic techniques and laser technology, we provide effective treatment with minimal discomfort and faster recovery times. Our experienced team performs hundreds of successful endourological procedures annually."
      procedures={[
        'PCNL (Percutaneous Nephrolithotomy)',
        'URS (Ureteroscopy) with Laser Lithotripsy',
        'RIRS (Retrograde Intrarenal Surgery)',
        'Flexible Ureteroscopy',
        'Holmium Laser Stone Fragmentation',
        'DJ Stent Insertion and Removal'
      ]}
      benefits={[
        'Minimally invasive approach',
        'Faster recovery time',
        'Less post-operative pain',
        'Shorter hospital stay',
        'High success rates',
        'Advanced laser technology'
      ]}
    />
  );
}
