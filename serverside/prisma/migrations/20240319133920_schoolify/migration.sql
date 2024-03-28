/*
  Warnings:

  - You are about to drop the column `lessonLessonID` on the `Test` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[testTestID]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_lessonLessonID_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_lessonLessonID_fkey";

-- DropIndex
DROP INDEX "Test_lessonLessonID_key";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "testTestID" INTEGER;

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "lessonLessonID";

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_testTestID_key" ON "Lesson"("testTestID");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_testTestID_fkey" FOREIGN KEY ("testTestID") REFERENCES "Test"("testID") ON DELETE SET NULL ON UPDATE CASCADE;
