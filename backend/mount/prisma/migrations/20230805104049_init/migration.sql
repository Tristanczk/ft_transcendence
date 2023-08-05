-- AlterTable
ALTER TABLE "User" ADD COLUMN     "doubleAuthentication" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "secret" TEXT;

-- RenameIndex
ALTER INDEX "User_nickName_key" RENAME TO "User_nickname_key";
