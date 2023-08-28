-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isConnected" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ActiveConnection" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUser" INTEGER NOT NULL,
    "nbTabs" INTEGER NOT NULL,

    CONSTRAINT "ActiveConnection_pkey" PRIMARY KEY ("id")
);
