const dateGroup = require("../helpers/dateGroup");
const haversineDistance = require("../helpers/haversineDistance");
const Arcade = require("../models/Arcade");
const Session = require("../models/Session");

module.exports = class ArcadeController {
	static async mainPage(req, res, next) {
		try {
			const userLat = parseFloat(req.query.lat);
			const userLng = parseFloat(req.query.lng);
			const allArcades = await Arcade.findWithBrand();
			let arcadesWithin10Km = [];

			allArcades.forEach((arcade) => {
				const distance = haversineDistance(
					arcade.lat,
					arcade.lng,
					userLat,
					userLng
				);
				if (distance <= 10) {
					arcade.distance = distance;
					arcadesWithin10Km.push(arcade);
				}
			});
			arcadesWithin10Km.sort((a, b) => a.rating - b.rating);
			res.status(200).json(arcadesWithin10Km.slice(0, 5));
		} catch (error) {
			next(error);
		}
	}
	static async detailPage(req, res, next) {
		try {
			const { id } = req.params;
			const arcade = await Arcade.findDetail(id);
			arcade.Session = dateGroup(arcade.Session);
			res.status(200).json(arcade);
		} catch (error) {
			next(error);
		}
	}
	static async createArcade(req, res, next) {
		try {
			const { name, lat, lng, BrandId, games } = req.body;
			const status = await Arcade.createArcade({
				name,
				lat,
				lng,
				BrandId,
				games
			});
			res.status(201).json(status);
		} catch (error) {
			next(error);
		}
	}
	static async addSession(req, res, next) {
		try {
			const { id: ArcadeId } = req.params;
			const { id: UserId } = req.additionalData;
			const { date:dateRaw } = req.body;
			const date = new Date(Date.parse(dateRaw));
			const status = await Session.create(+UserId, +ArcadeId, date);
			res.status(201).json(status);
		} catch (error) {
			next(error);
		}
	}
};
