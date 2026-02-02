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

// Surgery Types
export interface SurgeryProcedure {
  id: number;
  name: string;
  slug: string;
  fullName?: string;
  overview?: string;
  indications?: string;
  procedureDetails?: string;
  recovery?: string;
  risks?: string;
  tags?: string[];
  relatedProcedures?: SurgeryProcedure[];
}

export interface SurgerySubcategory {
  id: number;
  name: string;
  slug: string;
  overview?: string;
  procedures: SurgeryProcedure[];
}

export interface SurgeryCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  subcategories: SurgerySubcategory[];
}

// Appointment Types
export interface AppointmentSlot {
  slotNumber: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
  isCancelled: boolean;
  isExpired: boolean;
}

export interface DoctorForBooking {
  id: number;
  name: string;
  designation: string;
  image?: string;
  isAvailable: boolean;
  availabilityNote?: string;
}

export interface AppointmentBooking {
  id: number;
  doctorId: number;
  doctorName: string;
  patientName: string;
  patientCnic: string;
  patientPhone: string;
  patientEmail: string;
  appointmentDate: string;
  slotStartTime: string;
  slotEndTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'EXPIRED';
  notes?: string;
}
