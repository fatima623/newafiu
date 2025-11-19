import ServiceDetailTemplate from '@/components/ui/ServiceDetailTemplate';

export default function UDSPage() {
  return (
    <ServiceDetailTemplate
      title="Urodynamic Studies (UDS)"
      description="Specialized testing of bladder and lower urinary tract function"
      image="https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=600&fit=crop"
      details="Our Urodynamic Studies (UDS) service evaluates how well the bladder, urethra and sphincter are storing and releasing urine. These tests help diagnose incontinence, voiding dysfunction, neurogenic bladder and other complex lower urinary tract problems so that treatment can be tailored to each patient."
      procedures={[
        'Initial clinical evaluation and indication assessment',
        'Uroflowmetry and post-void residual measurement',
        'Filling and voiding cystometry',
        'Pressure-flow studies',
        'Urethral pressure profilometry (where indicated)',
        'Video-urodynamic studies in selected cases'
      ]}
      benefits={[
        'Detailed assessment of bladder and urethral function',
        'Helps differentiate types of incontinence and voiding disorders',
        'Guides selection of medical, surgical or behavioural treatment',
        'Improves accuracy of diagnosis in complex cases',
        'Performed by trained staff using standardized protocols',
        'Enhances long-term treatment outcomes and patient satisfaction'
      ]}
    />
  );
}
