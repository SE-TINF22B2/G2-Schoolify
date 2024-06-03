/*
  Warnings:

  - Added the required column `day` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "day" TIMESTAMP(3) NOT NULL;
