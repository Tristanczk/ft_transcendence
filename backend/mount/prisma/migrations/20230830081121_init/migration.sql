/*
  Warnings:

  - Added the required column `initEloA` to the `Games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initEloB` to the `Games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Games" ADD COLUMN     "initEloA" INTEGER NOT NULL,
ADD COLUMN     "initEloB" INTEGER NOT NULL;
