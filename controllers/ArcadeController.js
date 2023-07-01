const haversineDistance = require("../helpers/haversineDistance");
const { Arcade } = require("../models");

module.exports = class ArcadeController {
	static async mainPage(req, res, next) {
		try {
			const userLat = parseFloat(req.query.lat);
			const userLng = parseFloat(req.query.lng);
			const arcades = await Arcade.findWithBrand();
			arcades.forEach((arcade) => {
				const distance = haversineDistance(
					arcade.lat,
					arcade.lng,
					userLat,
					userLng
				);
				arcade.distance = distance;
			});
			arcades.sort((a, b) => a.rating - b.rating);
			res.status(200).json(arcades.slice(0, 5));
		} catch (error) {
			next(error);
		}
	}
};
