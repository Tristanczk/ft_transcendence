/*
  Warnings:

  - Added the required column `name` to the `Channels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Channels" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "content" TEXT NOT NULL;
