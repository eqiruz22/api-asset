-- DropForeignKey
ALTER TABLE `history` DROP FOREIGN KEY `History_assetId_fkey`;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `Asset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
