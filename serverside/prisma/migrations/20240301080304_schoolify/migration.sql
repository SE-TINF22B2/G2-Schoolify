-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('Admin', 'Teacher', 'Student');

-- CreateTable
CREATE TABLE "User_Login_Data" (
    "user_Login_DataID" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "userRole" NOT NULL,

    CONSTRAINT "User_Login_Data_pkey" PRIMARY KEY ("user_Login_DataID")
);

-- CreateTable
CREATE TABLE "Student" (
    "studentID" SERIAL NOT NULL,
    "user_Login_DataID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "classID" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("studentID")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "teacherID" SERIAL NOT NULL,
    "user_Login_DataID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("teacherID")
);

-- CreateTable
CREATE TABLE "Admin" (
    "adminID" SERIAL NOT NULL,
    "user_Login_DataID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminID")
);

-- CreateTable
CREATE TABLE "Role" (
    "roleID" SERIAL NOT NULL,
    "teacherID" INTEGER NOT NULL,
    "classID" INTEGER NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("roleID")
);

-- CreateTable
CREATE TABLE "Class" (
    "classID" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "year" TEXT NOT NULL,
    "letter" TEXT NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("classID")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "lessonID" SERIAL NOT NULL,
    "classID" INTEGER NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("lessonID")
);

-- CreateTable
CREATE TABLE "Absent" (
    "absentID" SERIAL NOT NULL,
    "dateFrom" TEXT NOT NULL,
    "dateTo" TEXT NOT NULL,
    "user_Login_DataID" INTEGER NOT NULL,

    CONSTRAINT "Absent_pkey" PRIMARY KEY ("absentID")
);

-- CreateTable
CREATE TABLE "Subject" (
    "subjectID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "testID" INTEGER NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("subjectID")
);

-- CreateTable
CREATE TABLE "Test" (
    "testID" SERIAL NOT NULL,
    "topic" TEXT NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("testID")
);

-- CreateTable
CREATE TABLE "Event" (
    "eventID" SERIAL NOT NULL,
    "topic" TEXT NOT NULL,
    "testID" INTEGER NOT NULL,
    "teacherID" INTEGER NOT NULL,
    "classID" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "dateFrom" TEXT NOT NULL,
    "dateTo" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("eventID")
);

-- CreateTable
CREATE TABLE "Grade" (
    "gradeID" SERIAL NOT NULL,
    "grade" DOUBLE PRECISION NOT NULL,
    "testTestID" INTEGER,
    "studentStudentID" INTEGER,
    "teacherTeacherID" INTEGER,
    "subjectSubjectID" INTEGER,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("gradeID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Login_Data_email_key" ON "User_Login_Data"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_user_Login_DataID_key" ON "Student"("user_Login_DataID");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_user_Login_DataID_key" ON "Teacher"("user_Login_DataID");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_user_Login_DataID_key" ON "Admin"("user_Login_DataID");

-- CreateIndex
CREATE UNIQUE INDEX "Absent_user_Login_DataID_key" ON "Absent"("user_Login_DataID");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_testID_key" ON "Subject"("testID");

-- CreateIndex
CREATE UNIQUE INDEX "Event_testID_key" ON "Event"("testID");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_user_Login_DataID_fkey" FOREIGN KEY ("user_Login_DataID") REFERENCES "User_Login_Data"("user_Login_DataID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classID_fkey" FOREIGN KEY ("classID") REFERENCES "Class"("classID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_user_Login_DataID_fkey" FOREIGN KEY ("user_Login_DataID") REFERENCES "User_Login_Data"("user_Login_DataID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_user_Login_DataID_fkey" FOREIGN KEY ("user_Login_DataID") REFERENCES "User_Login_Data"("user_Login_DataID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_teacherID_fkey" FOREIGN KEY ("teacherID") REFERENCES "Teacher"("teacherID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_classID_fkey" FOREIGN KEY ("classID") REFERENCES "Class"("classID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_classID_fkey" FOREIGN KEY ("classID") REFERENCES "Class"("classID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absent" ADD CONSTRAINT "Absent_user_Login_DataID_fkey" FOREIGN KEY ("user_Login_DataID") REFERENCES "User_Login_Data"("user_Login_DataID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_testID_fkey" FOREIGN KEY ("testID") REFERENCES "Test"("testID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_testID_fkey" FOREIGN KEY ("testID") REFERENCES "Test"("testID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_teacherID_fkey" FOREIGN KEY ("teacherID") REFERENCES "Teacher"("teacherID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_classID_fkey" FOREIGN KEY ("classID") REFERENCES "Class"("classID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_testTestID_fkey" FOREIGN KEY ("testTestID") REFERENCES "Test"("testID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_studentStudentID_fkey" FOREIGN KEY ("studentStudentID") REFERENCES "Student"("studentID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_teacherTeacherID_fkey" FOREIGN KEY ("teacherTeacherID") REFERENCES "Teacher"("teacherID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_subjectSubjectID_fkey" FOREIGN KEY ("subjectSubjectID") REFERENCES "Subject"("subjectID") ON DELETE SET NULL ON UPDATE CASCADE;
