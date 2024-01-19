-- CreateTable
CREATE TABLE `Peripheral` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `serial_number` VARCHAR(191) NOT NULL,
    `stats_id` INTEGER NOT NULL,
    `manufac_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Peripheral_serial_number_key`(`serial_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Peripheral` ADD CONSTRAINT `Peripheral_manufac_id_fkey` FOREIGN KEY (`manufac_id`) REFERENCES `Manufacture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peripheral` ADD CONSTRAINT `Peripheral_stats_id_fkey` FOREIGN KEY (`stats_id`) REFERENCES `StatsAsset`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
