/*
  Warnings:

  - Added the required column `location` to the `Peripheral` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `peripheral` ADD COLUMN `location` VARCHAR(191) NOT NULL;
