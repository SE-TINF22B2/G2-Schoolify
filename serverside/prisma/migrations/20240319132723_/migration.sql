/*
  Warnings:

  - A unique constraint covering the columns `[testTestID]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "testTestID" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_testTestID_key" ON "Lesson"("testTestID");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_testTestID_fkey" FOREIGN KEY ("testTestID") REFERENCES "Test"("testID") ON DELETE SET NULL ON UPDATE CASCADE;
