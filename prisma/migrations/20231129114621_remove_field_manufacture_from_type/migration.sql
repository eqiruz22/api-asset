/*
  Warnings:

  - You are about to drop the column `manufatureId` on the `type` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `type` DROP FOREIGN KEY `Type_manufatureId_fkey`;

-- AlterTable
ALTER TABLE `type` DROP COLUMN `manufatureId`;
