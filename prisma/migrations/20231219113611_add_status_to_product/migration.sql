/*
  Warnings:

  - You are about to drop the column `statsId` on the `asset` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `asset` DROP FOREIGN KEY `Asset_statsId_fkey`;

-- AlterTable
ALTER TABLE `asset` DROP COLUMN `statsId`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `statsId` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_statsId_fkey` FOREIGN KEY (`statsId`) REFERENCES `StatsAsset`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
