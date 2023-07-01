const prisma = require("../prisma/prismaConfig");

const validateInput = (data) => {
	for (let val of data) {
		if (!val) return false;
	}
	return true;
};

module.exports = class Arcade {
	static async findWithBrand() {
		try {
			const arcades = await prisma.arcade.findMany({
				include: {
					Brand: true
				}
			});
			return arcades;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	static async findDetail(id) {
		try {
			id = +id;
			if (!id) throw { name: "notFound", message: "Arcade not found" };
			const arcade = await prisma.arcade.findUnique({
				where: { id },
				include: {
					ArcadeGame: {
						select: {
							reportCount: true,
							Game: true
						}
					},
					Session: {
						select: {
							id: true,
							date: true,
							User: {
								select: {
									id: true,
									username: true
								}
							}
						}
					}
				}
			});
			if (!arcade)
				throw { name: "notFound", message: "Arcade not found" };
			return arcade;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	static async createArcade(data) {
		try {
			const validInput = validateInput(data);
			if (!validInput)
				throw {
					name: "invalidInput",
					message: "One of the required fields is empty"
				};
			const { name, lat, lng, BrandId, games } = data;
			if (!games.length)
				throw {
					name: "invalidInput",
					message: "At least one game is required"
				};
			const newArcade = await prisma.arcade.create({
				data: {
					name,
					lat,
					lng,
					Brand: {
						connect: { id: BrandId }
					},
					rating: 0,
					ratingCount: 0
				}
			});
			let arcadeGameData = [];
			games.forEach((game) => {
				arcadeGameData.push({
					reportCount: 0,
					ArcadeId: newArcade.id,
					GameId: game.id
				});
			});
			const creationStatus = await prisma.arcadeGame.createMany({
				data: arcadeGameData
			});
			return creationStatus;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
};
