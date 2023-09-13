-- DropForeignKey
ALTER TABLE "Games" DROP CONSTRAINT "Games_playerA_fkey";

-- DropForeignKey
ALTER TABLE "Games" DROP CONSTRAINT "Games_playerB_fkey";

-- AlterTable
ALTER TABLE "Games" ALTER COLUMN "playerA" DROP NOT NULL,
ALTER COLUMN "playerA" SET DEFAULT -1,
ALTER COLUMN "playerB" DROP NOT NULL,
ALTER COLUMN "playerB" SET DEFAULT -1;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_playerA_fkey" FOREIGN KEY ("playerA") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_playerB_fkey" FOREIGN KEY ("playerB") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
