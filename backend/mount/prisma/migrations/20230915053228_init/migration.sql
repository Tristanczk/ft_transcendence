/*
  Warnings:

  - Added the required column `aborted` to the `Games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Games" ADD COLUMN     "aborted" BOOLEAN NOT NULL;
