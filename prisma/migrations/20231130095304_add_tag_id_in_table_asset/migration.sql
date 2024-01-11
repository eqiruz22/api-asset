/*
  Warnings:

  - A unique constraint covering the columns `[tag_id]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tag_id` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `asset` ADD COLUMN `tag_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Asset_tag_id_key` ON `Asset`(`tag_id`);
