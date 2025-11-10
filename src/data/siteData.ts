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
      { label: 'OPD', href: '/clinical-services/opd' },
      { label: 'Daycare', href: '/clinical-services/daycare' },
      { label: 'Endourology', href: '/clinical-services/endourology' },
      { label: 'Uro-Oncology', href: '/clinical-services/uro-oncology' },
      { label: 'Reconstructive Urology', href: '/clinical-services/reconstructive' },
      { label: 'Wards', href: '/clinical-services/wards' },
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
  {
    label: 'Lab Reports',
    href: '/lab-reports',
  },
];

export const heroSlides: HeroSlide[] = [
  {
    id: '1',
    image: '/afiubuilding.jpg',
    title: 'Excellence in Urological Care',
    subtitle: 'Armed Forces Institute of Urology - Leading the way in advanced urological treatments',
    cta: {
      text: 'Book Appointment',
      link: '/hospital-visit/booking',
    },
  },
  {
    id: '2',
    image: '/facilities.jpg',
    title: 'State-of-the-Art Facilities',
    subtitle: 'Equipped with the latest technology for comprehensive urological care',
    cta: {
      text: 'Our Services',
      link: '/clinical-services',
    },
  },
  {
    id: '3',
    image: '/team.jpg',
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
    name: 'Dr. Muhammad Ahmed',
    designation: 'Consultant Urologist & Director AFIU',
    qualifications: 'MBBS, FCPS (Urology), FRCS (Urology)',
    specialization: 'Uro-Oncology, Endourology',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    bio: 'Dr. Ahmed is a highly experienced urologist with over 20 years of clinical experience in advanced urological procedures.',
  },
  {
    id: '2',
    name: 'Dr. Fatima Khan',
    designation: 'Senior Consultant Urologist',
    qualifications: 'MBBS, FCPS (Urology), Fellowship in Uro-Oncology',
    specialization: 'Uro-Oncology, Female Urology',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    bio: 'Dr. Khan specializes in female urology and minimally invasive urological procedures.',
  },
  {
    id: '3',
    name: 'Dr. Ali Hassan',
    designation: 'Consultant Urologist',
    qualifications: 'MBBS, FCPS (Urology), FRCS',
    specialization: 'Endourology, Stone Disease',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    bio: 'Dr. Hassan is an expert in endourological procedures and management of complex stone disease.',
  },
  {
    id: '4',
    name: 'Dr. Sarah Malik',
    designation: 'Consultant Urologist',
    qualifications: 'MBBS, FCPS (Urology)',
    specialization: 'Pediatric Urology, Reconstructive Urology',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    bio: 'Dr. Malik specializes in pediatric urology and reconstructive urological procedures.',
  },
  {
    id: '5',
    name: 'Dr. Imran Siddiqui',
    designation: 'Senior Consultant Urologist',
    qualifications: 'MBBS, FCPS (Urology), Fellowship in Andrology',
    specialization: 'Andrology, Male Infertility',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
    bio: 'Dr. Siddiqui is a renowned expert in male reproductive health and infertility treatment.',
  },
  {
    id: '6',
    name: 'Dr. Ayesha Rahman',
    designation: 'Consultant Urologist',
    qualifications: 'MBBS, FCPS (Urology)',
    specialization: 'Urodynamics, Neurourology',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop',
    bio: 'Dr. Rahman specializes in functional urology and neurourological disorders.',
  },
];

export const services: Service[] = [
  {
    id: 'opd',
    title: 'OPD',
    description: 'Comprehensive outpatient diagnostic and consultation services',
    icon: 'Stethoscope',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop',
    details: 'Our OPD provides comprehensive urological consultations and diagnostic services with state-of-the-art facilities.',
  },
  {
    id: 'daycare',
    title: 'Daycare',
    description: 'Same-day procedures and treatments in a comfortable setting',
    icon: 'Clock',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop',
    details: 'Our daycare facility offers minor procedures and treatments that do not require overnight hospitalization.',
  },
  {
    id: 'endourology',
    title: 'Endourology',
    description: 'Minimally invasive procedures for kidney stones and urinary tract conditions',
    icon: 'Activity',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=600&fit=crop',
    details: 'Advanced endourological procedures including PCNL, URS, and laser lithotripsy for stone disease.',
  },
  {
    id: 'uro-oncology',
    title: 'Uro-Oncology',
    description: 'Comprehensive cancer care for urological malignancies',
    icon: 'Heart',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop',
    details: 'Specialized treatment for prostate, bladder, kidney, and testicular cancers with latest surgical techniques.',
  },
  {
    id: 'reconstructive',
    title: 'Reconstructive Urology',
    description: 'Advanced surgical reconstruction for complex urological conditions',
    icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=600&fit=crop',
    details: 'Expert reconstruction procedures for urethral strictures, fistulas, and congenital abnormalities.',
  },
  {
    id: 'wards',
    title: 'Wards',
    description: 'Modern inpatient facilities with 24/7 nursing care',
    icon: 'Building',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop',
    details: 'Well-equipped wards with modern amenities and round-the-clock medical care.',
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
  address: 'Armed Forces Institute of Urology, CMH Medical Complex, Rawalpindi - Pakistan 46000',
  phone: '+92 51 9270076',
  appointmentPhone: '+92 51 9270077',
  email: 'info@afiu.org.pk',
  appointmentEmail: 'appointments@afiu.org.pk',
  timings: 'Monday - Friday: 8:00 AM - 4:00 PM | Saturday: 8:00 AM - 12:00 PM',
};

export const statistics = [
  { label: 'Years of Excellence', value: '25+' },
  { label: 'Successful Surgeries', value: '10,000+' },
  { label: 'Expert Doctors', value: '20+' },
  { label: 'Happy Patients', value: '50,000+' },
];
