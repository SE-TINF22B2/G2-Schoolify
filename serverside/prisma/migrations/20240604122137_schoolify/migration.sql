/*
  Warnings:

  - You are about to drop the column `calories` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `extra` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `ingredients` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `kategorie` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeslot` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "kategorieEnum" AS ENUM ('Vegan', 'Vegetarisch', 'Rindfleisch', 'Schweinefleisch', 'Fisch');

-- AlterTable
ALTER TABLE "Food" DROP COLUMN "calories",
DROP COLUMN "extra",
DROP COLUMN "ingredients",
ADD COLUMN     "kategorie" "kategorieEnum" NOT NULL,
ADD COLUMN     "shortName" TEXT;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "duration",
DROP COLUMN "startTime",
ADD COLUMN     "day" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timeslot" INTEGER NOT NULL;
