/*
  Warnings:

  - You are about to drop the column `user_Login_DataID` on the `Absent` table. All the data in the column will be lost.
  - You are about to drop the column `user_Login_DataID` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `classID` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `teacherID` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `testID` on the `Event` table. All the data in the column will be lost.
  - The `dateFrom` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dateTo` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `classID` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `teacherID` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `classID` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `user_Login_DataID` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `testID` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `user_Login_DataID` on the `Teacher` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_Login_DataUser_Login_DataID]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[testTestID]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_Login_DataUser_Login_DataID]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_Login_DataUser_Login_DataID]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_Login_DataUser_Login_DataID` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classClassID` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherTeacherID` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Made the column `studentStudentID` on table `Grade` required. This step will fail if there are existing NULL values in that column.
  - Made the column `teacherTeacherID` on table `Grade` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `duration` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classClassID` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_Login_DataUser_Login_DataID` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_Login_DataUser_Login_DataID` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Absent" DROP CONSTRAINT "Absent_user_Login_DataID_fkey";

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_user_Login_DataID_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_classID_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_teacherID_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_testID_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_studentStudentID_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_teacherTeacherID_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_classID_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_classID_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_teacherID_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classID_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_user_Login_DataID_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_testID_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_user_Login_DataID_fkey";

-- DropIndex
DROP INDEX "Absent_user_Login_DataID_key";

-- DropIndex
DROP INDEX "Admin_user_Login_DataID_key";

-- DropIndex
DROP INDEX "Event_testID_key";

-- DropIndex
DROP INDEX "Student_user_Login_DataID_key";

-- DropIndex
DROP INDEX "Subject_testID_key";

-- DropIndex
DROP INDEX "Teacher_user_Login_DataID_key";

-- AlterTable
ALTER TABLE "Absent" DROP COLUMN "user_Login_DataID",
ADD COLUMN     "user_Login_DataUser_Login_DataID" INTEGER;

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "user_Login_DataID",
ADD COLUMN     "user_Login_DataUser_Login_DataID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "classID",
DROP COLUMN "teacherID",
DROP COLUMN "testID",
ADD COLUMN     "classClassID" INTEGER NOT NULL,
ADD COLUMN     "teacherTeacherID" INTEGER NOT NULL,
ADD COLUMN     "testTestID" INTEGER,
DROP COLUMN "dateFrom",
ADD COLUMN     "dateFrom" TIMESTAMP(3),
DROP COLUMN "dateTo",
ADD COLUMN     "dateTo" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Grade" ALTER COLUMN "studentStudentID" SET NOT NULL,
ALTER COLUMN "teacherTeacherID" SET NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "classClassID" INTEGER,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "subjectSubjectID" INTEGER;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "classID",
DROP COLUMN "teacherID",
ADD COLUMN     "classClassID" INTEGER,
ADD COLUMN     "teacherTeacherID" INTEGER;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "classID",
DROP COLUMN "user_Login_DataID",
ADD COLUMN     "classClassID" INTEGER NOT NULL,
ADD COLUMN     "user_Login_DataUser_Login_DataID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "testID";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "user_Login_DataID",
ADD COLUMN     "user_Login_DataUser_Login_DataID" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ClassbockEntry" (
    "classbockEntry" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,
    "classClassID" INTEGER,

    CONSTRAINT "ClassbockEntry_pkey" PRIMARY KEY ("classbockEntry")
);

-- CreateTable
CREATE TABLE "FoodWeek" (
    "foodWeekID" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoodWeek_pkey" PRIMARY KEY ("foodWeekID")
);

-- CreateTable
CREATE TABLE "Food" (
    "foodID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "calories" TEXT NOT NULL,
    "allergies" TEXT NOT NULL,
    "extra" TEXT NOT NULL,
    "foodWeekFoodWeekID" INTEGER,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("foodID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_user_Login_DataUser_Login_DataID_key" ON "Admin"("user_Login_DataUser_Login_DataID");

-- CreateIndex
CREATE UNIQUE INDEX "Event_testTestID_key" ON "Event"("testTestID");

-- CreateIndex
CREATE UNIQUE INDEX "Student_user_Login_DataUser_Login_DataID_key" ON "Student"("user_Login_DataUser_Login_DataID");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_user_Login_DataUser_Login_DataID_key" ON "Teacher"("user_Login_DataUser_Login_DataID");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_user_Login_DataUser_Login_DataID_fkey" FOREIGN KEY ("user_Login_DataUser_Login_DataID") REFERENCES "User_Login_Data"("user_Login_DataID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classClassID_fkey" FOREIGN KEY ("classClassID") REFERENCES "Class"("classID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_user_Login_DataUser_Login_DataID_fkey" FOREIGN KEY ("user_Login_DataUser_Login_DataID") REFERENCES "User_Login_Data"("user_Login_DataID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_user_Login_DataUser_Login_DataID_fkey" FOREIGN KEY ("user_Login_DataUser_Login_DataID") REFERENCES "User_Login_Data"("user_Login_DataID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_teacherTeacherID_fkey" FOREIGN KEY ("teacherTeacherID") REFERENCES "Teacher"("teacherID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_classClassID_fkey" FOREIGN KEY ("classClassID") REFERENCES "Class"("classID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassbockEntry" ADD CONSTRAINT "ClassbockEntry_classClassID_fkey" FOREIGN KEY ("classClassID") REFERENCES "Class"("classID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_classClassID_fkey" FOREIGN KEY ("classClassID") REFERENCES "Class"("classID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_subjectSubjectID_fkey" FOREIGN KEY ("subjectSubjectID") REFERENCES "Subject"("subjectID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absent" ADD CONSTRAINT "Absent_user_Login_DataUser_Login_DataID_fkey" FOREIGN KEY ("user_Login_DataUser_Login_DataID") REFERENCES "User_Login_Data"("user_Login_DataID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_testTestID_fkey" FOREIGN KEY ("testTestID") REFERENCES "Test"("testID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_teacherTeacherID_fkey" FOREIGN KEY ("teacherTeacherID") REFERENCES "Teacher"("teacherID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_classClassID_fkey" FOREIGN KEY ("classClassID") REFERENCES "Class"("classID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_studentStudentID_fkey" FOREIGN KEY ("studentStudentID") REFERENCES "Student"("studentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_teacherTeacherID_fkey" FOREIGN KEY ("teacherTeacherID") REFERENCES "Teacher"("teacherID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_foodWeekFoodWeekID_fkey" FOREIGN KEY ("foodWeekFoodWeekID") REFERENCES "FoodWeek"("foodWeekID") ON DELETE SET NULL ON UPDATE CASCADE;
