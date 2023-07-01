const { Game } = require("../models");

module.exports = class GameController {
	static async findAll(req, res, next) {
		try {
			const games = await Game.findAll();
			res.status(200).json(games);
		} catch (error) {
			next(error);
		}
	}
};
