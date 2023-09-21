/*
  Warnings:

  - You are about to drop the column `nbTabs` on the `ActiveConnection` table. All the data in the column will be lost.
  - Added the required column `idConnection` to the `ActiveConnection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActiveConnection" DROP COLUMN "nbTabs",
ADD COLUMN     "idConnection" TEXT NOT NULL;
