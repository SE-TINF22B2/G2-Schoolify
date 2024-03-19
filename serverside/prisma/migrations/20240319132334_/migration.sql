/*
  Warnings:

  - A unique constraint covering the columns `[lessonLessonID]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "lessonLessonID" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Event_lessonLessonID_key" ON "Event"("lessonLessonID");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_lessonLessonID_fkey" FOREIGN KEY ("lessonLessonID") REFERENCES "Lesson"("lessonID") ON DELETE SET NULL ON UPDATE CASCADE;
