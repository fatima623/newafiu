# 🚀 AFIU Website - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Installation & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: **http://localhost:3000**

---

## 📁 Key Files to Know

### Update Content
- **`src/data/siteData.ts`** - All website content (faculty, services, news, contact info)

### Modify Styling
- **`src/app/globals.css`** - Global styles and color theme
- **Tailwind Classes** - Used throughout components

### Add/Edit Pages
- **`src/app/`** - All pages are here
- Each folder = a route (e.g., `about/` → `/about`)

---

## 🎨 Customize Colors

Edit `src/app/globals.css`:
```css
:root {
  --primary: #2563eb;        /* Change main blue */
  --primary-dark: #1e40af;   /* Change dark blue */
}
```

---

## 📝 Update Content

Edit `src/data/siteData.ts`:

### Add Faculty Member
```typescript
{
  id: '7',
  name: 'Dr. New Doctor',
  designation: 'Consultant Urologist',
  qualifications: 'MBBS, FCPS',
  specialization: 'Endourology',
  image: 'image-url',
}
```

### Add News Item
```typescript
{
  id: '4',
  title: 'New Event',
  date: '2024-11-15',
  excerpt: 'Description',
  image: 'image-url',
  category: 'news',
}
```

### Update Contact Info
```typescript
export const contactInfo: ContactInfo = {
  address: 'Your Address',
  phone: 'Your Phone',
  email: 'Your Email',
  // ...
}
```

---

## 🌐 Build for Production

```bash
npm run build
npm start
```

---

## 🚀 Deploy

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy!

### Deploy to Netlify
1. Build the project: `npm run build`
2. Drag `.next` folder to Netlify
3. Done!

---

## 📱 Test Responsive Design

- **Desktop:** Default view
- **Tablet:** Resize browser to ~768px
- **Mobile:** Resize browser to ~375px

Or use browser DevTools (F12) → Toggle device toolbar

---

## 🔧 Common Tasks

### Add a New Page
1. Create folder in `src/app/` (e.g., `new-page/`)
2. Add `page.tsx` file
3. Add to navigation in `src/data/siteData.ts`

### Change Logo
1. Replace logo in `src/components/layout/Navbar.tsx`
2. Update favicon in `src/app/favicon.ico`

### Add Images
1. Place images in `public/images/`
2. Reference as `/images/your-image.jpg`

---

## ⚡ Quick Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Check code quality
```

---

## 🆘 Troubleshooting

### Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Then run npm run dev again
```

### Module not found errors
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Build errors
```bash
npm run build
# Check error messages and fix accordingly
```

---

## 📞 Need Help?

- Check README.md for detailed documentation
- Review PROJECT_SUMMARY.md for complete overview
- Check Next.js docs: https://nextjs.org/docs

---

**Happy Coding! 🎉**
