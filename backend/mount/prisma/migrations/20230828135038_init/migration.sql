/*
  Warnings:

  - Added the required column `mode` to the `Games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Games" ADD COLUMN     "mode" INTEGER NOT NULL;
