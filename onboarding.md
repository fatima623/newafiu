# 🎉 Welcome to AFIU Website Project, Memoona!

**Hey Amina Abid (a.k.a. Memoona)!** Welcome aboard! 🚀

This guide will walk you through everything you need to know to get started with the AFIU (Armed Forces Institute of Urology) website project. Don't worry if things seem overwhelming at first — we've all been there!

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Prerequisites](#-prerequisites)
4. [Step-by-Step Setup Guide](#-step-by-step-setup-guide)
5. [Project Structure](#-project-structure)
6. [Understanding the Codebase](#-understanding-the-codebase)
7. [Database Setup (MySQL with XAMPP)](#-database-setup-mysql-with-xampp)
8. [Running the Project](#-running-the-project)
9. [Admin Panel Guide](#-admin-panel-guide)
10. [Common Development Tasks](#-common-development-tasks)
11. [Troubleshooting](#-troubleshooting)
12. [FAQs](#-faqs)
13. [Useful Commands Cheatsheet](#-useful-commands-cheatsheet)
14. [Resources & Learning](#-resources--learning)

---

## 🏥 Project Overview

AFIU Website is a modern, responsive hospital website for the Armed Forces Institute of Urology. It features:

- **Public-facing pages**: Home, About, Faculty, Clinical Services, News & Events, Gallery, etc.
- **Admin Dashboard**: For managing gallery albums, patient education materials, and news/events
- **Authentication System**: Secure admin login with JWT tokens
- **Database Integration**: MySQL database via Prisma ORM

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.10 | React framework (App Router) |
| **React** | 19.2.0 | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS styling |
| **Prisma** | 6.0.0 | Database ORM |
| **MySQL** | (via XAMPP) | Database |
| **Lucide React** | 0.553.0 | Icon library |
| **bcryptjs** | 3.0.3 | Password hashing |
| **jose** | 6.1.3 | JWT authentication |

---

## ✅ Prerequisites

Before you begin, make sure you have these installed on your computer:

### 1. Node.js (v18 or higher)
- Download from: https://nodejs.org/
- Verify installation:
  ```bash
  node --version   # Should show v18.x.x or higher
  npm --version    # Should show 9.x.x or higher
  ```

### 2. XAMPP (for MySQL)
- Download from: https://www.apachefriends.org/
- We only need **MySQL** from XAMPP (Apache is optional)

### 3. Git
- Download from: https://git-scm.com/
- Verify installation:
  ```bash
  git --version
  ```

### 4. Code Editor
- **VS Code** (Recommended): https://code.visualstudio.com/
- Recommended VS Code Extensions:
  - **Tailwind CSS IntelliSense**
  - **Prisma**
  - **ES7+ React/Redux/React-Native snippets**
  - **TypeScript Importer**
  - **Auto Rename Tag**

---

## 🚀 Step-by-Step Setup Guide

### Step 1: Clone/Get the Project

If you have the project folder, navigate to it. Otherwise:
```bash
git clone <repository-url>
cd afiu-website
```

### Step 2: Install Dependencies

Open your terminal in the project folder and run:
```bash
npm install
```

This will install all required packages. It may take a few minutes. ☕

> **Note**: If you see warnings (yellow text), that's usually fine. Only red errors need attention.

### Step 3: Set Up XAMPP & MySQL Database

#### 3.1 Start XAMPP
1. Open **XAMPP Control Panel**
2. Click **Start** next to **MySQL**
3. Wait until the MySQL row turns green

#### 3.2 Create the Database
1. Click **Admin** next to MySQL (opens phpMyAdmin in browser)
2. Or go to: http://localhost/phpmyadmin
3. Click **"New"** in the left sidebar
4. Enter database name: `afiu`
5. Click **Create**

> **Important**: The database name MUST be `afiu` (lowercase) to match our configuration.

### Step 4: Configure Environment Variables

The project already has a `.env` file with:
```env
DATABASE_URL="mysql://root@localhost:3306/afiu"
```

This is the default XAMPP MySQL configuration:
- **User**: `root`
- **Password**: (empty by default)
- **Host**: `localhost`
- **Port**: `3306`
- **Database**: `afiu`

> **If your XAMPP MySQL has a password**, update the `.env` file:
> ```env
> DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/afiu"
> ```

### Step 5: Set Up Database Tables (Prisma)

Run these commands in order:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push
```

You should see: `Your database is now in sync with your Prisma schema.`

### Step 6: Seed the Admin User

```bash
npm run db:seed
```

This creates the default admin user:
- **Username**: `admin`
- **Password**: `admin123`

> **To create a custom admin user**, run:
> ```bash
> set ADMIN_USERNAME=yourname
> set ADMIN_PASSWORD=yourpassword
> npm run db:seed
> ```

### Step 7: Run the Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 16.0.10
- Local:        http://localhost:3000
```

### Step 8: Open in Browser

- **Main Website**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard (after login)

🎉 **Congratulations! You're all set up!**

---

## 📁 Project Structure

```
afiu-website/
├── .env                          # Environment variables (DATABASE_URL)
├── package.json                  # Dependencies and scripts
├── prisma/
│   ├── schema.prisma             # Database schema (tables definition)
│   └── seed.js                   # Admin user seeder
├── public/                       # Static files (images, logos)
│   ├── afiulogo.png
│   ├── afiubuilding.jpg
│   └── uploads/                  # Uploaded files (gallery, PDFs)
├── src/
│   ├── app/                      # All pages (Next.js App Router)
│   │   ├── page.tsx              # Homepage (/)
│   │   ├── layout.tsx            # Root layout (Header, Footer)
│   │   ├── globals.css           # Global styles
│   │   ├── about/                # /about pages
│   │   ├── admin/                # Admin section
│   │   │   ├── login/            # Admin login page
│   │   │   └── dashboard/        # Admin dashboard pages
│   │   ├── api/                  # API routes (backend)
│   │   │   ├── auth/login/       # Authentication API
│   │   │   ├── gallery/          # Gallery CRUD API
│   │   │   ├── news-events/      # News & Events API
│   │   │   ├── patient-education/# Patient Education API
│   │   │   └── upload/           # File upload API
│   │   ├── clinical-services/    # Clinical services pages
│   │   ├── faculty/              # Faculty pages
│   │   ├── gallery/              # Public gallery page
│   │   ├── news-events/          # Public news page
│   │   └── ... (other pages)
│   ├── components/
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx        # Top header bar
│   │   │   ├── Navbar.tsx        # Navigation menu
│   │   │   ├── Footer.tsx        # Footer
│   │   │   └── NewsBanner.tsx    # News ticker banner
│   │   └── ui/                   # Reusable UI components
│   │       ├── HeroSlider.tsx    # Homepage slider
│   │       ├── ServiceCard.tsx   # Service display card
│   │       ├── FacultyCard.tsx   # Faculty member card
│   │       └── NewsCard.tsx      # News item card
│   ├── data/
│   │   └── siteData.ts           # Static site data (nav, faculty, services)
│   ├── lib/
│   │   ├── auth.ts               # Authentication utilities (JWT)
│   │   └── prisma.ts             # Prisma client instance
│   └── types/
│       └── index.ts              # TypeScript type definitions
└── tsconfig.json                 # TypeScript configuration
```

---

## 🧠 Understanding the Codebase

### How Next.js App Router Works

In Next.js 16, the `app/` directory uses **file-based routing**:

| File Path | URL Route |
|-----------|-----------|
| `app/page.tsx` | `/` (homepage) |
| `app/about/page.tsx` | `/about` |
| `app/faculty/page.tsx` | `/faculty` |
| `app/admin/login/page.tsx` | `/admin/login` |
| `app/api/auth/login/route.ts` | `/api/auth/login` (API) |

### Key Files Explained

#### `src/data/siteData.ts`
Contains all static content: navigation items, faculty list, services, contact info. **Edit this file to update website content.**

#### `src/lib/prisma.ts`
Creates a single Prisma client instance for database operations.

#### `src/lib/auth.ts`
Handles JWT token creation, verification, and session management.

#### `src/app/api/auth/login/route.ts`
The authentication API with three methods:
- `POST` - Login (authenticate user)
- `GET` - Get current session (check if logged in)
- `DELETE` - Logout (clear session)

### Database Models (Prisma Schema)

Located in `prisma/schema.prisma`:

| Model | Purpose |
|-------|---------|
| `AdminUser` | Admin login credentials |
| `GalleryAlbum` | Photo album metadata |
| `GalleryImage` | Individual images in albums |
| `PatientEducation` | Educational PDFs/documents |
| `NewsEvent` | News articles and events |

---

## 🗄 Database Setup (MySQL with XAMPP)

### Viewing Your Database

1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click on `afiu` database in the left sidebar
3. You'll see tables: `AdminUser`, `GalleryAlbum`, `GalleryImage`, `NewsEvent`, `PatientEducation`

### Prisma Studio (Visual Database Editor)

Run this command to open a visual database editor:
```bash
npx prisma studio
```
Opens at: http://localhost:5555

This is super helpful for viewing and editing data without writing SQL!

### Common Database Commands

```bash
# View current database schema
npx prisma db pull

# Push schema changes to database
npx prisma db push

# Reset database (WARNING: deletes all data!)
npx prisma db push --force-reset

# Generate Prisma Client after schema changes
npx prisma generate

# Seed admin user
npm run db:seed
```

---

## 🏃 Running the Project

### Development Mode (with hot reload)
```bash
npm run dev
```
- Opens at: http://localhost:3000
- Changes auto-refresh in browser

### Production Build
```bash
npm run build    # Build the project
npm start        # Run production server
```

### Linting (Code Quality Check)
```bash
npm run lint
```

---

## 👩‍💼 Admin Panel Guide

### Accessing Admin Panel

1. Go to: http://localhost:3000/admin/login
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. You'll be redirected to the dashboard

### Admin Features

| Section | What You Can Do |
|---------|-----------------|
| **Dashboard** | Overview and quick stats |
| **Gallery** | Create albums, upload images |
| **Patient Education** | Upload educational PDFs |
| **News & Events** | Create/edit news articles and events |

### Logout Behavior
When admin logs out, they are redirected to the **main website homepage** (`/`), not the login page.

---

## 💻 Common Development Tasks

### Adding a New Page

1. Create a folder in `src/app/` (e.g., `new-page/`)
2. Create `page.tsx` inside it:
   ```tsx
   export default function NewPage() {
     return (
       <div className="container mx-auto px-4 py-8">
         <h1 className="text-3xl font-bold">New Page</h1>
       </div>
     );
   }
   ```
3. Access at: http://localhost:3000/new-page

### Adding Navigation Item

Edit `src/data/siteData.ts`:
```typescript
export const navItems: NavItem[] = [
  // ... existing items
  {
    label: 'New Page',
    href: '/new-page',
  },
];
```

### Adding a New Faculty Member

Edit `src/data/siteData.ts`:
```typescript
export const faculty: Faculty[] = [
  // ... existing faculty
  {
    id: '9',
    name: 'Dr. New Doctor',
    designation: 'Consultant Urologist',
    qualifications: 'MBBS, FCPS (Urology)',
    specialization: 'Endourology',
    image: '/person.png',
  },
];
```

### Uploading Images

1. Place images in `public/` folder
2. Reference as `/image-name.jpg` in code
3. For uploaded content, use `public/uploads/`

---

## 🔧 Troubleshooting

### ❌ "XAMPP MySQL won't start"

**Cause**: Another program is using port 3306 (often another MySQL installation)

**Solution**:
1. Open XAMPP Control Panel
2. Click **Config** next to MySQL
3. Click **my.ini**
4. Find `port=3306` and change to `port=3307`
5. Save and restart MySQL
6. Update `.env`:
   ```env
   DATABASE_URL="mysql://root@localhost:3307/afiu"
   ```

### ❌ "Can't connect to MySQL server"

**Checklist**:
1. Is XAMPP MySQL running? (green in Control Panel)
2. Is the database `afiu` created?
3. Is `.env` file correct?

**Try**:
```bash
npx prisma db push
```

### ❌ "Module not found" errors

**Solution**:
```bash
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### ❌ "Port 3000 already in use"

**Solution** (Windows PowerShell):
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace <PID> with actual number)
taskkill /PID <PID> /F

# Or just use a different port
npm run dev -- -p 3001
```

### ❌ "Prisma Client not generated"

**Solution**:
```bash
npx prisma generate
```

### ❌ "Admin login not working"

**Checklist**:
1. Did you run `npm run db:seed`?
2. Check credentials: `admin` / `admin123`
3. Check if AdminUser exists in database (use Prisma Studio)

**Reset admin user**:
```bash
npm run db:seed
```

### ❌ "Images not showing"

**Checklist**:
1. Is the image in `public/` folder?
2. Is the path correct? (should start with `/`)
3. Check file extension matches exactly (case-sensitive)

### ❌ "TypeScript errors"

**Solution**:
```bash
# Restart TypeScript server in VS Code
# Press Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Or rebuild
npm run build
```

### ❌ "Changes not reflecting"

**Try**:
1. Hard refresh: `Ctrl + Shift + R`
2. Clear `.next` folder:
   ```bash
   Remove-Item -Recurse -Force .next
   npm run dev
   ```

---

## ❓ FAQs

### Q: Where do I change the website content?
**A**: Most static content is in `src/data/siteData.ts`. Dynamic content (gallery, news) is managed through the admin panel and stored in the database.

### Q: How do I add a new admin user?
**A**: Currently, you need to either:
1. Modify `prisma/seed.js` and run `npm run db:seed`
2. Or insert directly via phpMyAdmin (password must be bcrypt hashed)

### Q: Why is the website using blue color theme?
**A**: AFIU's brand colors are blue (#1e3a5f / blue-950) and white. Colors are defined in Tailwind classes throughout components.

### Q: How do I change the logo?
**A**: Replace `public/afiulogo.png` with your new logo (keep the same filename), or update the path in `src/components/layout/Navbar.tsx`.

### Q: What's the difference between `app/` and `pages/`?
**A**: This project uses Next.js **App Router** (`app/` directory). The older `pages/` directory is not used. App Router is the modern approach with better features.

### Q: How do I add a new API endpoint?
**A**: Create a `route.ts` file in `src/app/api/your-endpoint/`:
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello!' });
}
```

### Q: Where are uploaded files stored?
**A**: In `public/uploads/`. The upload API saves files there.

### Q: How does authentication work?
**A**: 
1. User submits credentials to `/api/auth/login`
2. Server validates against database (bcrypt comparison)
3. If valid, creates JWT token and sets HTTP-only cookie
4. Subsequent requests include cookie automatically
5. Protected routes check for valid session

### Q: Can I use a different database?
**A**: Yes! Prisma supports PostgreSQL, SQLite, SQL Server, etc. Update `prisma/schema.prisma` provider and `.env` DATABASE_URL.

### Q: How do I deploy this website?
**A**: 
- **Vercel** (easiest for Next.js)
- **Netlify**
- Any Node.js hosting with MySQL database

See `DEPLOYMENT_CHECKLIST.md` for detailed steps.

---

## 📝 Useful Commands Cheatsheet

```bash
# ===== Development =====
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Run production build
npm run lint             # Check code quality

# ===== Database (Prisma) =====
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema to database
npx prisma studio        # Open visual database editor
npm run db:seed          # Seed admin user

# ===== Troubleshooting =====
Remove-Item -Recurse -Force node_modules   # Delete node_modules
Remove-Item -Recurse -Force .next          # Delete build cache
npm install                                 # Reinstall dependencies

# ===== Git =====
git status               # Check changed files
git add .                # Stage all changes
git commit -m "message"  # Commit changes
git pull                 # Get latest changes
git push                 # Push your changes
```

---

## 📚 Resources & Learning

### Official Documentation
- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Prisma**: https://www.prisma.io/docs
- **TypeScript**: https://www.typescriptlang.org/docs

### Tutorials
- Next.js App Router: https://nextjs.org/learn
- Tailwind CSS Crash Course: Search "Tailwind CSS tutorial" on YouTube
- Prisma Quickstart: https://www.prisma.io/docs/getting-started/quickstart

### Project-Specific Docs
- `README.md` - Project overview
- `QUICK_START.md` - Quick setup guide
- `FEATURES.md` - Feature documentation
- `PROJECT_SUMMARY.md` - Complete project summary

---

## 😄 A Little Something to Brighten Your Day

Hey Memoona! Since you're diving into code all day, here are a couple of jokes to keep you smiling:

---

> **Why do programmers prefer dark mode?**
> 
> Because light attracts bugs! 🐛💡

---

> **A SQL query walks into a bar, walks up to two tables and asks...**
> 
> "Can I join you?" 🍺📊

---

Remember: Every expert was once a beginner. Don't hesitate to ask questions, break things (that's how we learn!), and most importantly — have fun coding! 

You've got this, Memoona! 💪✨

---

## 📞 Need Help?

If you're stuck:
1. Check this guide first
2. Search the error message on Google/Stack Overflow
3. Ask your team lead or senior developer
4. Check the official documentation

---

**Welcome to the team! Happy coding! 🎉**

*Last updated: January 2026*
