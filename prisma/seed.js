const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const path = require('path');
const { stat, readFile, readdir } = require('fs/promises');

const prisma = new PrismaClient();

function encodePublicPath(fileName) {
  return encodeURI(`/${fileName}`);
}

const facultyData = [
  {
    name: 'Dr. Haroon Sabir Khan',
    designation: 'Consultant Urologist & Transplant Surgeon',
    qualifications: 'MBBS, FCPS (Surgery), FCPS (Urology), FEBU (Europe), MHPE (RIU)',
    specialization: null,
    specializationCategory: 'UROLOGIST',
    image: '/person.png',
  },
  {
    name: 'Dr. Badar Murtaza',
    designation: 'Brigadier (Professor) – Consultant Urologist & Transplant Surgeon',
    qualifications:
      'MBBS, FCPS (Surgery), FCPS (URE), FCPS (Urology), MCPS, HPE, Certificate of Medical Teaching (UHS), Diploma in Reproductive and Sexual Medicine (Lambert)',
    specialization: null,
    specializationCategory: 'UROLOGIST',
    image: '/person.png',
  },
  {
    name: 'Dr. Hussain Ahmad',
    designation: 'Brigadier (Professor) – Consultant Urologist & Transplant Surgeon',
    qualifications: 'MBBS, FCPS (Surgery), FCPS (Urology), FRCS (Urology)',
    specialization: null,
    specializationCategory: 'UROLOGIST',
    image: '/person.png',
  },
  {
    name: 'Dr. Qamar Zia',
    designation: 'Brigadier (Associate Professor) – Consultant Urologist & Transplant Surgeon',
    qualifications: 'MBBS, MRCS (Ed), FCPS (Pak), FACS (USA), FRCS (Eng), FRCS (Ed), FRCS (Urol)',
    specialization: null,
    specializationCategory: 'UROLOGIST',
    image: '/person.png',
  },
  {
    name: 'Dr. Khubaib Shahzad',
    designation: 'Brigadier (Professor) – Consultant Urologist & Transplant Surgeon',
    qualifications:
      'MBBS, FCPS (Surgery), FCPS (Urology), Advanced Certification in Medical Education (ACMED), Foundation University Islamabad',
    specialization: null,
    specializationCategory: 'UROLOGIST',
    image: '/person.png',
  },
  {
    name: 'Dr. Faran Kiani',
    designation: 'Colonel – Consultant Urologist & Transplant Surgeon',
    qualifications: 'MBBS, FCPS (Surgery), FRCS Ed (Urology)',
    specialization: null,
    specializationCategory: 'UROLOGIST',
    image: '/person.png',
  },
  {
    name: 'Dr. Nauman Kashif',
    designation: 'FRCP (Glasgow), Consultant Nephrologist , Head of Department of Nephrology',
    qualifications: 'MBBS (QAU), FCPS (Medicine), FCPS (Nephrology), CHPE - NUMS, MASN (USA)',
    specialization: null,
    specializationCategory: 'NEPHROLOGIST',
    image: '/person.png',
  },
  {
    name: 'Dr. Farrukh Islam',
    designation: 'Consultant Nephrologist',
    qualifications: 'MBBS (QAU), MCPS, FCPS (Medicine), FCPS (Nephrology)',
    specialization: null,
    specializationCategory: 'NEPHROLOGIST',
    image: '/person.png',
  },
  {
    name: 'Brig Amir Sohail',
    designation: 'HOD Anesthesia, Consultant Anesthetist & Pain Specialist',
    qualifications: 'MBBS, FCPS Anesthesiology, CHPE, MSc Pain Medicine',
    specialization: null,
    specializationCategory: 'ANAESTHETIC',
    image: '/person.png',
  },
  {
    name: 'Col Ashfaq Ahmed',
    designation: 'Consultant Anesthetist',
    qualifications: 'MBBS, FCPS Anesthesiology',
    specialization: null,
    specializationCategory: 'ANAESTHETIC',
    image: '/person.png',
  },
  {
    name: 'Maj Jawad UL Hassan',
    designation: 'Consultant Anesthetist',
    qualifications: 'MBBS, FCPS Anesthesiology',
    specialization: null,
    specializationCategory: 'ANAESTHETIC',
    image: '/person.png',
  },
  {
    name: 'Maj Muhammad Mazhar UL Haq',
    designation: 'Consultant Anesthetist',
    qualifications: 'MBBS, FCPS Anesthesiology, CHPE',
    specialization: null,
    specializationCategory: 'ANAESTHETIC',
    image: '/person.png',
  },
  {
    name: 'Ltcol Amer Hayat Haider',
    designation: 'Classified Radiologist',
    qualifications: 'MBBS (AAU), DMA (NUML), DIPRAD (AFPGMI), FCPS (DGR)',
    specialization: null,
    specializationCategory: 'RADIOLOGIST',
    image: '/person.png',
  },
  {
    name: 'Maj Bareeha Elahi',
    designation: 'Classified Radiologist',
    qualifications: 'MBBS, FCPS',
    specialization: null,
    specializationCategory: 'RADIOLOGIST',
    image: '/person.png',
  },
];

function toSlug(input) {
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toCodeFromFileName(fileName) {
  const base = String(fileName).replace(/\.[^/.]+$/, '');
  return base
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function mimeTypeFromFileName(fileName) {
  const ext = String(path.extname(fileName)).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return 'image/jpeg';
}

function titleFromFilename(filename) {
  const base = String(filename).replace(/\.[^/.]+$/, '');
  return base
    .replace(/^[0-9]+-/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });

  // eslint-disable-next-line no-console
  console.log(`Seeded admin user: ${username}`);

  // Seed faculty data
  for (const faculty of facultyData) {
    const existing = await prisma.faculty.findFirst({
      where: { name: faculty.name },
    });

    if (!existing) {
      await prisma.faculty.create({
        data: faculty,
      });
      // eslint-disable-next-line no-console
      console.log(`Seeded faculty: ${faculty.name}`);
    } else {
      await prisma.faculty.update({
        where: { id: existing.id },
        data: faculty,
      });
      // eslint-disable-next-line no-console
      console.log(`Updated faculty: ${faculty.name}`);
    }
  }

  await prisma.faculty.updateMany({
    data: { specialization: null },
  });

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  try {
    const entries = await readdir(uploadsDir, { withFileTypes: true });
    const pdfFiles = entries
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.pdf'))
      .map((e) => e.name)
      .sort();

    for (const fileName of pdfFiles) {
      const pdfUrl = encodePublicPath(`uploads/${fileName}`);
      const existingByUrl = await prisma.patientEducation.findFirst({
        where: { pdfUrl },
      });
      const title = titleFromFilename(fileName) || fileName;

      if (!existingByUrl) {
        await prisma.patientEducation.create({
          data: { title, description: null, pdfUrl },
        });
      } else {
        await prisma.patientEducation.update({
          where: { id: existingByUrl.id },
          data: { title: existingByUrl.title || title, description: existingByUrl.description ?? null, pdfUrl },
        });
      }
    }
  } catch {
  }

  // eslint-disable-next-line no-console
  console.log('Faculty seeding complete!');

  const defaultPatientEducation = [
    {
      title: 'Informed consent for TURP',
      publicFileName: 'Informed consent for TURP.pdf',
    },
    {
      title: 'Informed consent for SPC',
      publicFileName: 'Informed consent for SPC.pdf',
    },
    {
      title: 'Informed consent for Cystolitholapaxy',
      publicFileName: 'Informed consent for Cystolitholapaxy.pdf',
    },
    {
      title: 'Informed consent for TRUS Biopsy',
      publicFileName: 'Informed consent for TRUS Biopsy.pdf',
    },
    {
      title: 'Informed consent for Radical Cystectomy and Ileal Conduit',
      publicFileName: 'Informed consent for Radical Cystectomy and Ileal Conduit.pdf',
    },
    {
      title: 'Informed consent for Cystoscopy and Biopsy',
      publicFileName: 'Informed consent for Cystoscopy and Biopsy.pdf',
    },
  ];

  for (const d of defaultPatientEducation) {
    const pdfUrl = encodePublicPath(d.publicFileName);

    const existing = await prisma.patientEducation.findFirst({
      where: { title: d.title },
    });

    if (!existing) {
      await prisma.patientEducation.create({
        data: { title: d.title, description: null, pdfUrl },
      });
      // eslint-disable-next-line no-console
      console.log(`Seeded patient education: ${d.title}`);
    } else {
      await prisma.patientEducation.update({
        where: { id: existing.id },
        data: { title: d.title, description: existing.description ?? null, pdfUrl },
      });
      // eslint-disable-next-line no-console
      console.log(`Patient education already exists: ${d.title}`);
    }
  }

  const defaultForms = [
    {
      code: 'job_application',
      title: 'AFIU Job Application Forms',
      publicFileName: 'AFIU job Application Forms.docx',
      sortOrder: 1,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    {
      code: 'residency_training',
      title: 'APPLICATION FORM FOR RESIDENCY TRAINING AT AFIU',
      publicFileName: 'APPLICATION FORM FOR RESIDENCY TRAINING AT AFIU.docx',
      sortOrder: 2,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
  ];

  for (const d of defaultForms) {
    const fileUrl = encodePublicPath(d.publicFileName);
    const filePath = path.join(process.cwd(), 'public', d.publicFileName);

    let size = 0;
    try {
      const st = await stat(filePath);
      size = st.size;
    } catch {
      size = 0;
    }

    await prisma.careersForm.upsert({
      where: { code: d.code },
      update: {
        title: d.title,
        fileUrl,
        originalName: d.publicFileName,
        mimeType: d.mimeType,
        size,
        sortOrder: d.sortOrder,
      },
      create: {
        code: d.code,
        title: d.title,
        fileUrl,
        originalName: d.publicFileName,
        mimeType: d.mimeType,
        size,
        sortOrder: d.sortOrder,
      },
    });

    // eslint-disable-next-line no-console
    console.log(`Seeded careers form: ${d.code}`);
  }

  const defaultJobs = [
    {
      code: 'consultant_urologist',
      title: 'Consultant Urologist',
      department: 'Clinical Services',
      type: 'Full-time',
      location: null,
      description: null,
      requirements: 'MBBS with relevant postgraduate qualification in Urology. Valid registration. Minimum relevant experience preferred.',
      responsibilities: 'Provide clinical care, outpatient consultations, and surgical services. Participate in teaching and clinical governance activities.',
      applyBy: null,
      hiringStartsAt: null,
      applyLink: null,
      isPublished: true,
    },
    {
      code: 'resident_urologist',
      title: 'Resident Urologist',
      department: 'Clinical Services',
      type: 'Full-time',
      location: null,
      description: null,
      requirements: 'Relevant residency/house job experience. Strong clinical knowledge and willingness to work in a tertiary care environment.',
      responsibilities: 'Assist consultants in patient care, maintain documentation, support procedures/rounds, and participate in on-call duties as required.',
      applyBy: null,
      hiringStartsAt: null,
      applyLink: null,
      isPublished: true,
    },
    {
      code: 'nursing_staff',
      title: 'Nursing Staff',
      department: 'Nursing',
      type: 'Full-time',
      location: null,
      description: null,
      requirements: 'Registered Nurse (RN) with valid certification. Relevant hospital experience preferred.',
      responsibilities: 'Provide nursing care, administer medications as prescribed, assist in procedures, and ensure patient safety and comfort.',
      applyBy: null,
      hiringStartsAt: null,
      applyLink: null,
      isPublished: true,
    },
    {
      code: 'lab_technician',
      title: 'Lab Technician',
      department: 'Laboratory',
      type: 'Full-time',
      location: null,
      description: null,
      requirements: 'Relevant diploma/degree in medical laboratory technology. Knowledge of lab safety and standard procedures.',
      responsibilities: 'Perform laboratory tests, maintain equipment, follow quality control protocols, and support reporting workflows.',
      applyBy: null,
      hiringStartsAt: null,
      applyLink: null,
      isPublished: true,
    },
  ];

  for (const j of defaultJobs) {
    await prisma.careersJob.upsert({
      where: { code: j.code },
      update: {
        title: j.title,
        department: j.department,
        type: j.type,
        location: j.location,
        description: j.description,
        requirements: j.requirements,
        responsibilities: j.responsibilities,
        applyBy: j.applyBy,
        hiringStartsAt: j.hiringStartsAt,
        applyLink: j.applyLink,
        isPublished: j.isPublished,
      },
      create: {
        code: j.code,
        title: j.title,
        department: j.department,
        type: j.type,
        location: j.location,
        description: j.description,
        requirements: j.requirements,
        responsibilities: j.responsibilities,
        applyBy: j.applyBy,
        hiringStartsAt: j.hiringStartsAt,
        applyLink: j.applyLink,
        isPublished: j.isPublished,
      },
    });

    // eslint-disable-next-line no-console
    console.log(`Seeded careers job: ${j.code}`);
  }

  const categorizedGallery = [
    {
      category: 'OPD',
      photos: ['UROLOGY OPD.jpg', 'counter.jpg', 'counter-2.jpg'],
    },
    {
      category: 'DAY_CARE',
      photos: ['dialysis.jpg', 'dialysis-2.jpg', 'waiting area.jpg', 'waiting area-2.jpg', 'waiting area-3.jpg'],
    },
    {
      category: 'SURGERIES',
      photos: ['Endo OT.jpg', 'OT.jpg'],
    },
    {
      category: 'DIALYSIS',
      photos: ['dialysis.jpg', 'dialysis-2.jpg'],
    },
    {
      category: 'ESWL',
      photos: ['random-1.jpg', 'random-2.jpg'],
    },
    {
      category: 'WARDS',
      photos: ['wards.jpg', 'ward-2.jpg'],
    },
    {
      category: 'URODYNAMIC_STUDIES',
      photos: ['UDS.jpg'],
    },
    {
      category: 'RADIOLOGY_DEPARTMENT',
      photos: ['radio.jpg', 'radio-2.jpg', 'radio-3.jpg'],
    },
    {
      category: 'RENAL_TRANSPLANT_SERVICE',
      photos: ['random-3.jpg', 'random-4.jpg'],
    },
    {
      category: 'OTHERS',
      photos: ['pharmacy.jpg', 'pharmacy-2.jpg', 'pharmacy-3.jpg'],
    },
  ];

  for (let idx = 0; idx < categorizedGallery.length; idx++) {
    const c = categorizedGallery[idx];

    for (let pIdx = 0; pIdx < c.photos.length; pIdx++) {
      const fileName = c.photos[pIdx];
      const filePath = path.join(process.cwd(), 'public', fileName);
      const code = `${c.category}-${toCodeFromFileName(fileName)}`;

      let buffer = null;
      try {
        buffer = await readFile(filePath);
      } catch {
        // eslint-disable-next-line no-console
        console.log(`Gallery photo missing in public folder: ${fileName}`);
        continue;
      }

      await prisma.galleryItem.upsert({
        where: { code },
        update: {
          category: c.category,
          originalName: fileName,
          mimeType: mimeTypeFromFileName(fileName),
          data: buffer,
          title: null,
          sortOrder: pIdx,
        },
        create: {
          category: c.category,
          code,
          originalName: fileName,
          mimeType: mimeTypeFromFileName(fileName),
          data: buffer,
          title: null,
          sortOrder: pIdx,
        },
      });
    }
  }

  const defaultNewsEvents = [
    {
      title: 'AFIU Updates',
      date: '2026-01-01',
      excerpt: 'Updates and announcements from AFIU.',
      imageUrl: null,
      content: null,
      category: 'news',
      showInBanner: false,
      bannerExpiresAt: null,
    },
    {
      title: 'OPD Timings',
      date: '2026-01-15',
      excerpt: 'Private OPD timings: Mon-Fri 3:00 PM - 6:00 PM.',
      imageUrl: null,
      content: null,
      category: 'news',
      showInBanner: true,
      bannerExpiresAt: null,
    },
  ];

  for (const n of defaultNewsEvents) {
    const dt = new Date(n.date);
    const existing = await prisma.newsEvent.findFirst({
      where: {
        title: n.title,
        date: dt,
      },
    });

    if (!existing) {
      await prisma.newsEvent.create({
        data: {
          title: n.title,
          date: dt,
          excerpt: n.excerpt,
          imageUrl: n.imageUrl,
          content: n.content,
          category: n.category,
          showInBanner: n.showInBanner,
          bannerExpiresAt: n.bannerExpiresAt,
        },
      });
    } else {
      await prisma.newsEvent.update({
        where: { id: existing.id },
        data: {
          excerpt: n.excerpt,
          imageUrl: n.imageUrl,
          content: n.content,
          category: n.category,
          showInBanner: n.showInBanner,
          bannerExpiresAt: n.bannerExpiresAt,
        },
      });
    }
  }

  const existingGalleryItemCount = await prisma.galleryItem.count();
  if (existingGalleryItemCount === 0) {
    try {
      const fallbackFileName = 'afiulogo.png';
      const filePath = path.join(process.cwd(), 'public', fallbackFileName);
      const buffer = await readFile(filePath);
      await prisma.galleryItem.create({
        data: {
          category: 'OTHERS',
          code: 'OTHERS-AFIU_LOGO',
          originalName: fallbackFileName,
          mimeType: mimeTypeFromFileName(fallbackFileName),
          data: buffer,
          title: 'AFIU',
          sortOrder: 0,
        },
      });
    } catch {
      // eslint-disable-next-line no-console
      console.log('Fallback gallery image missing in public folder: afiulogo.png');
    }
  }

  // Seed Appointment Settings
  const existingSettings = await prisma.appointmentSettings.findFirst();
  if (!existingSettings) {
    await prisma.appointmentSettings.create({
      data: {
        maxAppointmentsPerDay: 10,
        slotDurationMinutes: 15,
        startTime: '15:00',
        endTime: '18:00',
        allowedDays: '1,2,3,4,5',
        bookingCutoffMinutes: 15,
      },
    });
    // eslint-disable-next-line no-console
    console.log('Seeded appointment settings');
  } else {
    await prisma.appointmentSettings.update({
      where: { id: existingSettings.id },
      data: {
        maxAppointmentsPerDay: 10,
        slotDurationMinutes: 15,
        startTime: '15:00',
        endTime: '18:00',
        allowedDays: '1,2,3,4,5',
        bookingCutoffMinutes: 15,
      },
    });
    // eslint-disable-next-line no-console
    console.log('Appointment settings already exist');
  }
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
