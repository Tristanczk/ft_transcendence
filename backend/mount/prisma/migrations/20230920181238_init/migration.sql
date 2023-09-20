/*
  Warnings:

  - Added the required column `idOwner` to the `Channels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Channels" ADD COLUMN     "idOwner" INTEGER NOT NULL;
