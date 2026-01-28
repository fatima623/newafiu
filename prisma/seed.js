const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

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
