const prisma = require("../prisma/prismaConfig");

module.exports = class Bookmark {
	static async findAll(id) {
		try {
			const bookmarks = await prisma.user.findUnique({
				where: { id },
				select: {
					Bookmark: {
						select: {
							Arcade: true
						}
					}
				}
			});
			return bookmarks;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	static async addBookmark(UserId, ArcadeId) {
		try {
			UserId = +UserId;
			ArcadeId = +ArcadeId;
			const arcade = await prisma.arcade.findUnique({
				where: { id: ArcadeId }
			});
			if (!arcade)
				throw { name: "notFound", message: "Arcade not found" };
			const status = await prisma.bookmark.create({
				data: {
					ArcadeId,
					UserId
				}
			});
			return status;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	static async deleteBookmark(UserId, ArcadeId) {
		try {
			const deleteStatus = await prisma.bookmark.deleteMany({
				where: {
					UserId,
					ArcadeId
				}
			});
			return deleteStatus;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
};
