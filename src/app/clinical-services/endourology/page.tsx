import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function EndourologyPage() {
  return (
    <ServiceDetailTemplate
      title="Surgeries"
      description="Endourological and minimally invasive surgeries for kidney stones and urinary tract conditions"
      image="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&h=600&fit=crop"
      details="Our surgical services focus on minimally invasive and endourological procedures for the treatment of kidney stones and other urinary tract conditions. Using advanced endoscopic techniques and laser technology, we provide effective treatment with minimal discomfort and faster recovery times. Our experienced team performs hundreds of successful procedures annually."
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
        'Shorter hospital stay',
        'High success rates',
        'Advanced technology'
      ]}
    />
  );
}
