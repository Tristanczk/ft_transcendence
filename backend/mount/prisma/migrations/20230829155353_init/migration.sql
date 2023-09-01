/*
  Warnings:

  - Added the required column `varEloA` to the `Games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `varEloB` to the `Games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Games" ADD COLUMN     "varEloA" INTEGER NOT NULL,
ADD COLUMN     "varEloB" INTEGER NOT NULL;
