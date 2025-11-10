# AFIU Website - Armed Forces Institute of Urology

A modern, responsive website for the Armed Forces Institute of Urology (AFIU), built with Next.js, TypeScript, and Tailwind CSS.

## 🎯 Project Overview

This website is a complete frontend clone of the AFBMTC website structure, redesigned with AFIU branding (Blue & White theme). It includes all navigation menus, pages, and sections from the reference website.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Fonts:** Inter (Google Fonts)

## 📁 Project Structure

```
afiu-website/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── about/                    # About Us pages
│   │   │   ├── mission/
│   │   │   └── history/
│   │   ├── faculty/                  # Faculty pages
│   │   ├── clinical-services/        # All clinical service pages
│   │   │   ├── opd/
│   │   │   ├── daycare/
│   │   │   ├── endourology/
│   │   │   ├── uro-oncology/
│   │   │   ├── reconstructive/
│   │   │   └── wards/
│   │   ├── educational-resources/    # Educational pages
│   │   ├── news-events/              # News & Events
│   │   ├── success-stories/          # Patient success stories
│   │   ├── research-publications/    # Research papers
│   │   ├── careers/                  # Career opportunities
│   │   ├── donations/                # Donation information
│   │   ├── hospital-visit/           # Hospital visit guides
│   │   │   ├── booking/
│   │   │   ├── travelling/
│   │   │   ├── outpatient/
│   │   │   ├── inpatient/
│   │   │   ├── visitor-policy/
│   │   │   ├── facilities/
│   │   │   └── virtual-tour/
│   │   ├── lab-reports/              # Lab reports access
│   │   ├── contact/                  # Contact page
│   │   └── page.tsx                  # Homepage
│   ├── components/
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/                       # Reusable UI components
│   │       ├── HeroSlider.tsx
│   │       ├── ServiceCard.tsx
│   │       ├── FacultyCard.tsx
│   │       ├── NewsCard.tsx
│   │       └── ServiceDetailTemplate.tsx
│   ├── data/
│   │   └── siteData.ts               # All site data and content
│   └── types/
│       └── index.ts                  # TypeScript type definitions
├── public/                           # Static assets
└── package.json

```

## 🎨 Design Features

- **Color Scheme:** Blue (#2563eb) & White
- **Responsive Design:** Mobile, tablet, and desktop optimized
- **Smooth Animations:** Fade-in and slide-in effects
- **Modern UI:** Clean, professional hospital-institutional look
- **Interactive Elements:** Hover effects, dropdown menus, image sliders

## 📄 Pages Included

### Main Navigation
- **Home** - Hero slider, services, faculty, statistics, news
- **About Us** - Mission, History, Contact
- **Faculty** - Team of urological specialists
- **Clinical Services** - OPD, Daycare, Endourology, Uro-Oncology, Reconstructive, Wards
- **Educational Resources** - Patient education, Physician resources, Guidelines
- **News & Events** - Latest updates and announcements
- **Success Stories** - Patient testimonials
- **Research Publications** - Academic publications
- **Careers** - Job opportunities and applications
- **Donations** - Support AFIU
- **Your Hospital Visit** - Complete visitor guide
- **Lab Reports** - Online report access
- **Contact** - Contact form and information

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd afiu-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Key Features

### Components
- **Header:** Top bar with contact info and quick links
- **Navbar:** Responsive navigation with dropdown menus
- **Footer:** Multi-column footer with links and social media
- **Hero Slider:** Auto-rotating image slider with CTAs
- **Service Cards:** Grid display of clinical services
- **Faculty Cards:** Team member profiles with images
- **News Cards:** Latest news and events display

### Functionality
- Responsive mobile menu
- Smooth scroll navigation
- Form submissions (Contact, Appointments, Careers)
- Dynamic routing for faculty and news details
- Image placeholders from Unsplash
- Custom animations and transitions

## 🎨 Customization

### Update Content
Edit `src/data/siteData.ts` to modify:
- Navigation menu items
- Hero slider content
- Faculty information
- Services and departments
- News and events
- Contact information
- Statistics

### Change Colors
Edit `src/app/globals.css` to update the color scheme:
```css
:root {
  --primary: #2563eb;        /* Main blue color */
  --primary-dark: #1e40af;   /* Darker blue */
  --secondary: #3b82f6;      /* Secondary blue */
  --accent: #0ea5e9;         /* Accent color */
}
```

### Add New Pages
1. Create a new folder in `src/app/`
2. Add a `page.tsx` file
3. Update navigation in `src/data/siteData.ts`

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## 🔧 Technologies Used

- **Next.js 16:** React framework with App Router
- **TypeScript:** Type-safe development
- **Tailwind CSS 4:** Utility-first CSS framework
- **Lucide React:** Beautiful icon library
- **Inter Font:** Modern, professional typography

## 📝 Notes

- All images are placeholders from Unsplash
- Forms show alerts (no backend integration)
- Lab reports feature is placeholder only
- Virtual tour section is placeholder
- No database or CMS integration (frontend only)

## 🚀 Deployment

This project can be deployed to:
- **Vercel** (Recommended)
- **Netlify**
- **AWS Amplify**
- Any Node.js hosting platform

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 📞 Support

For questions or issues, please contact the development team.

## 📄 License

This project is for the Armed Forces Institute of Urology (AFIU).

---

**Built with ❤️ for AFIU**
