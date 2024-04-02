/*
  Warnings:

  - You are about to drop the column `testTestID` on the `Lesson` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lessonLessonID]` on the table `Test` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_testTestID_fkey";

-- DropIndex
DROP INDEX "Lesson_testTestID_key";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "testTestID";

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "lessonLessonID" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Test_lessonLessonID_key" ON "Test"("lessonLessonID");

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_lessonLessonID_fkey" FOREIGN KEY ("lessonLessonID") REFERENCES "Lesson"("lessonID") ON DELETE SET NULL ON UPDATE CASCADE;
