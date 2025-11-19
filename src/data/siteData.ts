import { NavItem, Faculty, Service, NewsEvent, SuccessStory, Publication, ContactInfo, HeroSlide } from '@/types';

export const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About Us',
    href: '/about',
    subItems: [
      { label: 'Mission Statement', href: '/about/mission' },
      { label: 'Brief History', href: '/about/history' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    label: 'Faculty',
    href: '/faculty',
  },
  {
    label: 'Clinical Services',
    href: '/clinical-services',
    subItems: [
      { label: 'OPD (Outpatient Department)', href: '/clinical-services/opd' },
      { label: 'Day Care', href: '/clinical-services/daycare' },
      {
        label: 'Surgeries',
        href: '/clinical-services/endourology',
        subItems: [
          { label: 'Stone Surgery', href: '/clinical-services/endourology/stone-surgery' },
          { label: 'Tumor Surgery', href: '/clinical-services/endourology/tumor-surgery' },
          { label: 'Laparoscopic Surgery', href: '/clinical-services/endourology/laparoscopic-surgery' },
          { label: 'Reconstructive Surgery', href: '/clinical-services/endourology/reconstructive-surgery' },
          { label: 'Andrology', href: '/clinical-services/endourology/andrology' },
          { label: 'Pediatric (Paeds) Urology', href: '/clinical-services/endourology/pediatric-urology' },
        ],
      },
      { label: 'Dialysis', href: '/clinical-services/uro-oncology' },
      { label: 'ESWL (Lithotripsy)', href: '/clinical-services/reconstructive' },
      { label: 'Wards', href: '/clinical-services/wards' },
      { label: 'Urodynamic Studies (UDS)', href: '/clinical-services/uds' },
      { label: 'Radiology Department', href: '/clinical-services/radio' },
      { label: 'Renal Transplant Service', href: '/clinical-services/transplant' },
    ],
  },
  {
    label: 'Educational Resources',
    href: '/educational-resources',
    subItems: [
      { label: 'Patient Education', href: '/educational-resources/patient-education' },
      { label: 'Physicians', href: '/educational-resources/physicians' },
      { label: 'Institutional Guidelines', href: '/educational-resources/guidelines' },
    ],
  },
  {
    label: 'News & Events',
    href: '/news-events',
  },
  {
    label: 'Success Stories',
    href: '/success-stories',
  },
  {
    label: 'Research Publications',
    href: '/research-publications',
  },
  {
    label: 'Careers',
    href: '/careers',
  },
  {
    label: 'Donations',
    href: '/donations',
  },
  {
    label: 'Your Hospital Visit',
    href: '/hospital-visit',
    subItems: [
      { label: 'Booking your appointment', href: '/hospital-visit/booking' },
      { label: 'Travelling to AFIU', href: '/hospital-visit/travelling' },
      { label: 'Outpatient Appointment', href: '/hospital-visit/outpatient' },
      { label: 'Inpatient Admission', href: '/hospital-visit/inpatient' },
      { label: 'Visitor Policy', href: '/hospital-visit/visitor-policy' },
      { label: 'Hospital Facilities', href: '/hospital-visit/facilities' },
      { label: 'Virtual Tour', href: '/hospital-visit/virtual-tour' },
    ],
  },
];

export const heroSlides: HeroSlide[] = [
  {
    id: '1',
    image: '/afiubuilding.jpg',
    title: 'Excellence in Urological Care',
    subtitle: 'Armed Forces Institute of Urology (AFIU) Rawalpindi - Transforming Urology with Compassion and Science',
    cta: {
      text: 'Book Appointment',
      link: '/hospital-visit/booking',
    },
  },
  {
    id: '2',
    image: '/services.jpg',
    title: 'State-of-the-Art Facilities',
    subtitle: 'Equipped with the latest technology for comprehensive urological care',
    cta: {
      text: 'Our Services',
      link: '/clinical-services',
    },
  },
  {
    id: '3',
    image: '/faculty.jpg',
    title: 'Expert Medical Team',
    subtitle: 'Highly qualified specialists dedicated to your health and wellbeing',
    cta: {
      text: 'Meet Our Faculty',
      link: '/faculty',
    },
  },
]; 

export const faculty: Faculty[] = [
  {
    id: '1',
    name: 'Dr. Haroon Sabir Khan',
    designation: 'Consultant Urologist & Transplant Surgeon',
    qualifications: 'MBBS, FCPS (Surgery), FCPS (Urology)',
    specialization: 'FEBU (Europe), MHPE (RIU)',
    image: '/person.png',
  },
  {
    id: '2',
    name: 'Dr.Badar Murtaza',
    designation: 'Consultant Urologist & Transplant Surgeon',
    qualifications: 'MBBS, FCPS (Surgery), FRCS (IRE), FCPS (Urology), MCPS-HPE',
    specialization: 'no data',
    image: '/person.png',
  },
  {
    id: '3',
    name: 'Dr. Hussain Ahmad',
    designation: 'Consultant Urologist & Transplant Surgeon',
    qualifications: 'MBBS, FCPS (Surgery), FCPS (Urology), OJT Urology UHB-UK',
    specialization: 'no data',
    image: '/person.png',
  },
  {
    id: '4',
    name: 'Dr. Qamar Zia',
    designation: 'Consultant Urologist & Transplant Surgeon',
    qualifications: 'MBBS, MRCS (Ed), FCPS General Surgery (Pak), FCPS (Urology) FACS (USA), FRCS (Ed), FRCS (Urology)',
    specialization: 'no data',
    image: '/person.png',
  },
  {
    id: '5',
    name: 'Dr. Khubaib Shahzad',
    designation: 'Consultant Urologist & Transplant Surgeon',
    qualifications: 'MBBS, FCPS (Surgery), FRCS Ed (Urology)',
    specialization: 'no data',
    image: '/person.png',
  },
  {
    id: '6',
    name: 'Dr. Faran Kiani',
    designation: 'Consultant Urologist & Transplant Surgeon',
    qualifications: 'MBBS, FCPS (Surgery), FCPS (Urology)',
    specialization: 'no data',
    image: '/person.png',
  },
  {
    id: '7',
    name: 'Dr. Nauman Kashif',
    designation: 'FRCP (Glasgow), Consultant Nephrologist , Head of Department of Nephrology',
    qualifications: 'MBBS (QAU), FCPS (Medicine), FCPS (Nephrology), CHPE - NUMS, MASN (USA)',
    specialization: 'no data',
    image: '/person.png',
  },
  {
    id: '8',
    name: 'Dr. Farrukh Islam',
    designation: 'Consultant Nephrologist',
    qualifications: 'MBBS (QAU), MCPS, FCPS (Medicine), FCPS (Nephrology)',
    specialization: 'no data',
    image: '/person.png',
  },
];

export const services: Service[] = [
  {
    id: 'opd',
    title: 'OPD (Outpatient Department)',
    description: 'Comprehensive outpatient consultations, evaluation and follow-up for urology and nephrology patients.',
    icon: 'Stethoscope',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop',
    details: 'Our OPD provides scheduled and walk-in consultations, diagnostic work-up, counselling and follow-up care. Patients are seen by experienced specialists using evidence-based protocols in a patient-friendly environment.',
  },
  {
    id: 'daycare',
    title: 'Day Care',
    description: 'Same-day procedures and treatments in a dedicated, comfortable setting.',
    icon: 'Clock',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop',
    details: 'The Day Care unit performs minor and selected intermediate procedures that do not require overnight admission, allowing patients to return home the same day under close monitoring and strict safety protocols.',
  },
  {
    id: 'endourology',
    title: 'Surgeries',
    description: 'Endourological and minimally invasive surgeries for kidney stones and urinary tract conditions.',
    icon: 'Activity',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=600&fit=crop',
    details: 'Our surgical services include PCNL, URS, RIRS, TURP and other advanced procedures for stone disease, prostatic enlargement and obstructive uropathy, performed with modern imaging and laser technology.',
  },
  {
    id: 'uro-oncology',
    title: 'Dialysis',
    description: 'Hemodialysis services for patients with acute and chronic kidney disease.',
    icon: 'Heart',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop',
    details: 'The Dialysis unit provides regular and emergency hemodialysis with continuous monitoring by trained nephrologists and dialysis nurses, with a strong focus on infection control and patient education.',
  },
  {
    id: 'reconstructive',
    title: 'ESWL (Lithotripsy)',
    description: 'Non-invasive shock-wave treatment for kidney and ureteric stones.',
    icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=600&fit=crop',
    details: 'Extra-corporeal shock wave lithotripsy (ESWL) is used to fragment stones without open surgery, allowing rapid recovery, shorter hospital stay and early return to routine activities.',
  },
  {
    id: 'wards',
    title: 'Wards',
    description: 'Modern inpatient facilities with 24/7 medical and nursing care.',
    icon: 'Building',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop',
    details: 'Our wards provide post-operative care, medical management and pre-procedure optimization in a clean, safe and supportive environment, with round-the-clock coverage by multidisciplinary teams.',
  },
  {
    id: 'uds',
    title: 'Urodynamic Studies (UDS)',
    description: 'Specialized testing of bladder and lower urinary tract function.',
    icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=600&fit=crop',
    details: 'The Urodynamic laboratory performs uroflowmetry, cystometry, pressure-flow studies and related tests to evaluate incontinence, voiding dysfunction, neurogenic bladder and complex lower urinary tract symptoms.',
  },
  {
    id: 'radio',
    title: 'Radiology Department',
    description: 'Comprehensive imaging support for urological and renal conditions.',
    icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=600&fit=crop',
    details: 'Radiology services include ultrasound, Doppler, X-ray, CT and other imaging modalities, providing accurate diagnosis and image-guided interventions for urological and nephrological diseases.',
  },
  {
    id: 'transplant',
    title: 'Renal Transplant Service',
    description: 'Multidisciplinary care for patients undergoing kidney transplantation.',
    icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=600&fit=crop',
    details: 'The transplant team offers comprehensive care including pre-transplant evaluation, donor assessment, transplant surgery and long-term follow-up for recipients with end-stage renal disease.',
  },
];

export const newsEvents: NewsEvent[] = [
  {
    id: '1',
    title: 'AFIU Launches New Robotic Surgery Program',
    date: '2024-10-15',
    excerpt: 'State-of-the-art robotic surgical system now available for minimally invasive urological procedures.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop',
    category: 'news',
    content: 'AFIU is proud to announce the launch of our new robotic surgery program...',
  },
  {
    id: '2',
    title: 'Free Prostate Cancer Screening Camp',
    date: '2024-11-20',
    excerpt: 'Join us for a free prostate cancer screening camp for men above 50 years.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
    category: 'event',
    content: 'AFIU is organizing a free prostate cancer screening camp...',
  },
  {
    id: '3',
    title: 'World Kidney Day Celebration',
    date: '2024-03-14',
    excerpt: 'AFIU organized awareness sessions and free consultations on World Kidney Day.',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=400&fit=crop',
    category: 'event',
    content: 'On World Kidney Day, AFIU conducted various awareness activities...',
  },
];

export const successStories: SuccessStory[] = [
  {
    id: '1',
    title: 'Successful Complex Kidney Stone Surgery',
    patientName: 'Mr. Ahmed (Patient ID: 12345)',
    story: 'After suffering from large kidney stones for years, I underwent successful PCNL surgery at AFIU. The care and expertise of the medical team was exceptional. I am now completely stone-free and living a normal life.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
    date: '2024-09-15',
  },
  {
    id: '2',
    title: 'Prostate Cancer Treatment Success',
    patientName: 'Anonymous Patient',
    story: 'I was diagnosed with prostate cancer and was treated at AFIU with robotic surgery. The recovery was quick and the results have been excellent. I am grateful to the entire team.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop',
    date: '2024-08-20',
  },
];

export const publications: Publication[] = [
  {
    id: '1',
    title: 'Outcomes of Robotic-Assisted Radical Prostatectomy: A Single Center Experience',
    authors: ['Dr. Muhammad Ahmed', 'Dr. Fatima Khan', 'Dr. Ali Hassan'],
    journal: 'Journal of Urology',
    year: 2024,
  },
  {
    id: '2',
    title: 'Management of Complex Urethral Strictures: A Comprehensive Review',
    authors: ['Dr. Sarah Malik', 'Dr. Imran Siddiqui'],
    journal: 'International Journal of Urology',
    year: 2023,
  },
  {
    id: '3',
    title: 'Minimally Invasive Treatment of Kidney Stones: Current Trends',
    authors: ['Dr. Ali Hassan', 'Dr. Ayesha Rahman'],
    journal: 'Urological Research',
    year: 2024,
  },
];

export const contactInfo: ContactInfo = {
  address: 'Armed Forces Institute of Urology (AFIU) Rawalpindi CMH Medical Complex, Rawalpindi, Pakistan',
  phone: '+92 51 5562331',
  appointmentPhone: '+92 51 5562331',
  email: 'afiu@outlook.com',
  appointmentEmail: 'afiu@outlook.com',
  timings: 'Monday - Friday: 8:00 AM - 3:00 PM | For Private Patients 3:00 PM - 6:00 PM',
};

export const statistics = [
  { label: 'Years of Excellence', value: '32+' },
  { label: 'Successful Surgeries', value: '100000+' },
  { label: 'Expert Doctors', value: '49+' },
  { label: 'Satisfied Patients', value: '100000+' },
];

export const commandant = {
  name: 'Professor Haroon Sabir Khan',
  designation: 'Consultant Urologist & Transplant Surgeon, Advisor to DG Surgery in Urology, Commandant AFIU',
  credentials: ['MBBS', 'FCPS (Surgery)', 'FCPS (Urology)', 'FEBU (Europe)', 'MHPE (RIU)'],
  image: '/person.png',   // <-- Use image from public folder
  welcomeMessage: {
    title: 'Welcome to Armed Forces Institute of Urology (AFIU)',
    description: 'At Armed Forces Institute of Urology (AFIU) Rawalpindi, we are dedicated to providing world – class healthcare with compassion, innovation and integrity. As a leading medical institution, we combine advanced medical technology, expert professionals and patient – centered care to ensure the highest standards of treatment and comfort for every individual who walks through our doors. Our mission is to promote health, healing and hope by offering comprehensive surgical and diagnostic services with modern facilities and highly – qualified staff. All department of this institute undertake the responsibility to understand and implement these standards. (ISO 9001:2015).',
    closingMessage: 'Thank you for selecting AFIU. It is our honour and privilege to take care of you and your loved ones.',
  },
};
