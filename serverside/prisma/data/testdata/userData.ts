import { userRole } from '@prisma/client';

export default async function create(prisma) {
  const mockpassword = '1234';

  const studentEmails = [
    'studentmail1@test.de',
    'studentmail2@test.de',
    'studentmail3@test.de',
    'studentmail4@test.de',
  ];

  const teacherEmails = ['teachermail1@test.de', 'teachermail2@test.de'];
  const adminEmail = 'adminmail1@test.de';

  // Create the admin
  const adminLoginData = await prisma.user_Login_Data.upsert({
    where: { email: adminEmail },
    update: { password: mockpassword },
    create: {
      email: adminEmail,
      password: mockpassword,
      role: userRole.Admin,
    },
  });

  await prisma.admin.upsert({
    where: { adminID: 1 },
    update: {
      name: 'Admin1',
      lastname: 'Surname1',
      user_Login_DataID: adminLoginData.user_Login_DataID,
    },
    create: {
      name: 'Admin1',
      lastname: 'Surname1',
      user_Login_DataID: adminLoginData.user_Login_DataID,
    },
  });

  // Create teachers
  for (let i = 0; i < teacherEmails.length; i++) {
    const teacherLoginData = await prisma.user_Login_Data.upsert({
      where: { email: teacherEmails[i] },
      update: { password: mockpassword },
      create: {
        email: teacherEmails[i],
        password: mockpassword,
        role: userRole.Teacher,
      },
    });

    await prisma.teacher.upsert({
      where: { teacherID: i + 1 },
      update: {
        name: `Teacher${i + 1}`,
        lastname: `Surname${i + 1}`,
        user_Login_DataID: teacherLoginData.user_Login_DataID,
      },
      create: {
        name: `Teacher${i + 1}`,
        lastname: `Surname${i + 1}`,
        user_Login_DataID: teacherLoginData.user_Login_DataID,
      },
    });
  }
  //Create Class
  const classA = await prisma.class.upsert({
    where: { classID: 1 },
    update: {
      roomNumber: 101,
      letter: 'A',
      year: '10',
    },
    create: {
      roomNumber: 101,
      letter: 'A',
      year: '10',
    },
  });
  const classB = await prisma.class.upsert({
    where: { classID: 2 },
    update: {
      roomNumber: 102,
      letter: 'B',
      year: '10',
    },
    create: {
      roomNumber: 102,
      letter: 'B',
      year: '10',
    },
  });

  // Create students
  for (let i = 0; i < studentEmails.length; i++) {
    const studentLoginData = await prisma.user_Login_Data.upsert({
      where: { email: studentEmails[i] },
      update: { password: mockpassword },
      create: {
        email: studentEmails[i],
        password: mockpassword,
        role: userRole.Student,
      },
    });

    await prisma.student.upsert({
      where: { studentID: i + 1 },
      update: {
        name: `Student${i + 1}`,
        lastname: `Surname${i + 1}`,
        class: {
          connect: {
            classID: i > 1 ? classB.classID : classA.classID,
          },
        },
        user_Login_Data: {
          connect: {
            user_Login_DataID: studentLoginData.user_Login_DataID,
          },
        },
      },
      create: {
        name: `Student${i + 1}`,
        lastname: `Surname${i + 1}`,
        class: {
          connect: {
            classID: i > 1 ? classB.classID : classA.classID,
          },
        },
        user_Login_Data: {
          connect: {
            user_Login_DataID: studentLoginData.user_Login_DataID,
          },
        },
      },
    });
  }
}
