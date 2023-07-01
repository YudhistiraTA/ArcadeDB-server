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
	static async findBrand(req, res, next) {
		try {
            const brands = await Game.findBrand();
            res.status(200).json(brands);
		} catch (error) {
			next(error);
		}
	}
};
