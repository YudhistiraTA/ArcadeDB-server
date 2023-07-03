const Bookmark = require("../models/Bookmark");

module.exports = class BookmarkController {
	static async findAll(req, res, next) {
		try {
			const { id } = req.additionalData;
			const data = await Bookmark.findAll(id);
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	}
	static async addBookmark(req, res, next) {
		try {
			const { id: ArcadeId } = req.params;
			const { id: UserId, premium } = req.additionalData;
			const data = await Bookmark.findAll(UserId);
			const foundBookmark = data.Bookmark.find(
				(el) => el.Arcade.id === +ArcadeId
			);
			if (foundBookmark)
				throw {
					name: "constraintError",
					message: "Arcade has already been bookmarked"
				};
			if (data.Bookmark.length > 10) {
				throw {
					name: "premiumError",
					message: "Bookmark limit for free user is 10"
				};
			}
			const status = await Bookmark.addBookmark(UserId, ArcadeId);
			res.status(200).json(status);
		} catch (error) {
			next(error);
		}
	}
	static async deleteBookmark(req, res, next) {
		try {
			const { id: UserId } = req.additionalData;
			const { id: ArcadeId } = req.params;
			const status = await Bookmark.deleteBookmark(+UserId, +ArcadeId);
			res.status(200).json(status);
		} catch (error) {
			next(error);
		}
	}
};
