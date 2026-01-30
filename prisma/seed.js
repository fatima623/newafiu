const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const path = require('path');
const { stat } = require('fs/promises');

const prisma = new PrismaClient();

function encodePublicPath(fileName) {
  return encodeURI(`/${fileName}`);
}

const facultyData = [
  {
    name: 'Dr. Haroon Sabir Khan',
    designation: 'Consultant Urologist & Transplant Surgeon',
    qualifications: 'MBBS, FCPS (Surgery), FCPS (Urology), FEBU (Europe), MHPE (RIU)',
    specialization: 'FEBU (Europe), MHPE (RIU)',
    image: '/person.png',
  },
  {
    name: 'Dr. Badar Murtaza',
    designation: 'Consultant Urologist & Transplant Surgeon',
    qualifications: 'MBBS, FCPS (Surgery), FRCS (IRE), FCPS (Urology), MCPS-HPE',
    specialization: null,
    image: '/person.png',
  },
  {
    name: 'Dr. Hussain Ahmad',
    designation: 'Consultant Urologist & Transplant Surgeon',
    qualifications: 'MBBS, FCPS (Surgery), FCPS (Urology), OJT Urology UHB-UK',
    specialization: null,
    image: '/person.png',
  },
  {
    name: 'Dr. Qamar Zia',
    designation: 'Consultant Urologist & Transplant Surgeon',
    qualifications: 'MBBS, MRCS (Ed), FCPS General Surgery (Pak), FCPS (Urology) FACS (USA), FRCS (Ed), FRCS (Urology)',
    specialization: null,
    image: '/person.png',
  },
  {
    name: 'Dr. Khubaib Shahzad',
    designation: 'Consultant Urologist & Transplant Surgeon',
    qualifications: 'MBBS, FCPS (Surgery), FRCS Ed (Urology)',
    specialization: null,
    image: '/person.png',
  },
  {
    name: 'Dr. Faran Kiani',
    designation: 'Consultant Urologist & Transplant Surgeon',
    qualifications: 'MBBS, FCPS (Surgery), FCPS (Urology)',
    specialization: null,
    image: '/person.png',
  },
  {
    name: 'Dr. Nauman Kashif',
    designation: 'FRCP (Glasgow), Consultant Nephrologist , Head of Department of Nephrology',
    qualifications: 'MBBS (QAU), FCPS (Medicine), FCPS (Nephrology), CHPE - NUMS, MASN (USA)',
    specialization: null,
    image: '/person.png',
  },
  {
    name: 'Dr. Farrukh Islam',
    designation: 'Consultant Nephrologist',
    qualifications: 'MBBS (QAU), MCPS, FCPS (Medicine), FCPS (Nephrology)',
    specialization: null,
    image: '/person.png',
  },
];

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
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
      // eslint-disable-next-line no-console
      console.log(`Faculty already exists: ${faculty.name}`);
    }
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
      applyBy: null,
      isPublished: true,
    },
    {
      code: 'resident_urologist',
      title: 'Resident Urologist',
      department: 'Clinical Services',
      type: 'Full-time',
      location: null,
      description: null,
      applyBy: null,
      isPublished: true,
    },
    {
      code: 'nursing_staff',
      title: 'Nursing Staff',
      department: 'Nursing',
      type: 'Full-time',
      location: null,
      description: null,
      applyBy: null,
      isPublished: true,
    },
    {
      code: 'lab_technician',
      title: 'Lab Technician',
      department: 'Laboratory',
      type: 'Full-time',
      location: null,
      description: null,
      applyBy: null,
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
        applyBy: j.applyBy,
        isPublished: j.isPublished,
      },
      create: {
        code: j.code,
        title: j.title,
        department: j.department,
        type: j.type,
        location: j.location,
        description: j.description,
        applyBy: j.applyBy,
        isPublished: j.isPublished,
      },
    });

    // eslint-disable-next-line no-console
    console.log(`Seeded careers job: ${j.code}`);
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
        bookingCutoffMinutes: 30,
      },
    });
    // eslint-disable-next-line no-console
    console.log('Seeded appointment settings');
  } else {
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
