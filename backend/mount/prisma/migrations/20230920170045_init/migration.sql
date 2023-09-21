-- AlterTable
ALTER TABLE "User" ADD COLUMN     "invites" TEXT[] DEFAULT ARRAY[]::TEXT[];
