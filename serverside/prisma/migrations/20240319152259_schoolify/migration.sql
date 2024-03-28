-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classClassID_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "classClassID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classClassID_fkey" FOREIGN KEY ("classClassID") REFERENCES "Class"("classID") ON DELETE SET NULL ON UPDATE CASCADE;
