/*
  Warnings:

  - You are about to drop the column `lessonLessonID` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `classID` on the `Lesson` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_studentStudentID_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_teacherTeacherID_fkey";

-- DropIndex
DROP INDEX "Event_lessonLessonID_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "lessonLessonID";

-- AlterTable
ALTER TABLE "Grade" ALTER COLUMN "studentStudentID" DROP NOT NULL,
ALTER COLUMN "teacherTeacherID" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "classID";

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_studentStudentID_fkey" FOREIGN KEY ("studentStudentID") REFERENCES "Student"("studentID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_teacherTeacherID_fkey" FOREIGN KEY ("teacherTeacherID") REFERENCES "Teacher"("teacherID") ON DELETE SET NULL ON UPDATE CASCADE;
