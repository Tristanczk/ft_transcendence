/*
  Warnings:

  - You are about to drop the `ActiveConnection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ActiveConnection";

-- CreateTable
CREATE TABLE "Connections" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUser" INTEGER NOT NULL,
    "idConnection" TEXT NOT NULL,

    CONSTRAINT "Connections_pkey" PRIMARY KEY ("id")
);
