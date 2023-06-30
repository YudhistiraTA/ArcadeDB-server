/*
  Warnings:

  - Added the required column `BrandId` to the `Arcade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `arcade` ADD COLUMN `BrandId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Arcade` ADD CONSTRAINT `Arcade_BrandId_fkey` FOREIGN KEY (`BrandId`) REFERENCES `Brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
