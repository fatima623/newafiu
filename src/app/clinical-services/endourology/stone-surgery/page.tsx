import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function StoneSurgeryPage() {
  return (
    <ServiceDetailTemplate
      title="Stone Surgery"
      description="Comprehensive surgical management of kidney, ureteric and bladder stones"
      image="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&h=600&fit=crop"
      details="Our Stone Surgery service offers a complete range of minimally invasive and endourological procedures for kidney, ureteric and bladder stones. Treatment plans are tailored according to stone size, location, composition and patient factors to ensure safe stone clearance with early recovery."
      procedures={[
        'PCNL (Percutaneous Nephrolithotomy) for large renal stones',
        'Mini-PCNL and ultra-mini PCNL techniques',
        'URS (Ureteroscopy) with laser lithotripsy for ureteric stones',
        'RIRS (Retrograde Intrarenal Surgery) using flexible scopes',
        'Endoscopic treatment of bladder stones',
        'Placement and removal of DJ stents as needed'
      ]}
      benefits={[
        'Minimally invasive options tailored to stone size and location',
        'High stone-clearance rates with modern endoscopic technology',
        'Reduced pain, smaller incisions and shorter hospital stay',
        'Early return to normal activities',
        'Comprehensive metabolic evaluation and prevention advice',
        'Multidisciplinary care involving urologists, nephrologists and radiologists'
      ]}
    />
  );
}
