-- CreateTable
CREATE TABLE `UserRatings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `UserId` INTEGER NOT NULL,
    `ArcadeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `UserId` INTEGER NOT NULL,
    `ArcadeGameId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRatings` ADD CONSTRAINT `UserRatings_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRatings` ADD CONSTRAINT `UserRatings_ArcadeId_fkey` FOREIGN KEY (`ArcadeId`) REFERENCES `Arcade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserReport` ADD CONSTRAINT `UserReport_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserReport` ADD CONSTRAINT `UserReport_ArcadeGameId_fkey` FOREIGN KEY (`ArcadeGameId`) REFERENCES `ArcadeGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
