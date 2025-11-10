export interface NavItem {
  label: string;
  href: string;
  subItems?: NavItem[];
}

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  qualifications: string;
  specialization: string;
  image: string;
  bio?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  details?: string;
}

export interface NewsEvent {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content?: string;
  category: 'news' | 'event';
}

export interface SuccessStory {
  id: string;
  title: string;
  patientName: string;
  story: string;
  image?: string;
  date: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  pdf?: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  appointmentPhone: string;
  email: string;
  appointmentEmail: string;
  timings: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  cta?: {
    text: string;
    link: string;
  };
}
