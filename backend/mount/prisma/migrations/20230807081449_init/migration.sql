/*
  Warnings:

  - You are about to drop the column `doubleAuthentication` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "doubleAuthentication",
ADD COLUMN     "twoFactorAuthentication" BOOLEAN NOT NULL DEFAULT false;
