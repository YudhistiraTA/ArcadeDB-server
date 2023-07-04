const prisma = require("../prisma/prismaConfig");

const validateInput = (data) => {
	for (let val in data) {
		if (!data[val]) return false;
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
			return newArcade;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	static async createRating(UserId, ArcadeId, rating) {
		try {
			const foundRecord = await prisma.userRatings.findFirst({
				where: { UserId, ArcadeId }
			});

			if (foundRecord)
				throw {
					name: "constraintError",
					message: "You have already rated this arcade"
				};
			const arcade = await prisma.arcade.findUniqueOrThrow({
				where: { id: ArcadeId }
			});
			if (!arcade)
				throw { name: "notFound", message: "Arcade not found" };
			await prisma.userRatings.create({
				data: {
					UserId,
					ArcadeId
				}
			});
			const newRating =
				(arcade.rating * arcade.ratingCount + rating) /
				(arcade.ratingCount + 1);
			const updatedArcade = await prisma.arcade.update({
				where: { id: ArcadeId },
				data: {
					rating: newRating,
					ratingCount: {
						increment: 1
					}
				}
			});
			return updatedArcade;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	static async createReport(UserId, ArcadeGameId) {
		try {
			const arcadeGame = await prisma.arcadeGame.findUniqueOrThrow({
				where: { id: ArcadeGameId }
			});
			if (!arcadeGame)
				throw { name: "notFound", message: "Invalid arcade game data" };
			const foundRecord = await prisma.userReport.findFirst({
				where: { UserId, ArcadeGameId }
			});
			if (foundRecord)
				throw {
					name: "constraintError",
					message: "You have already reported this arcade game"
				};
			await prisma.userReport.create({
				data: {
					UserId,
					ArcadeGameId
				}
			});
			const updatedArcadeGame = await prisma.arcadeGame.update({
				where: { id: ArcadeGameId },
				data: {
					reportCount: {
						increment: 1
					}
				}
			});
			return updatedArcadeGame;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	static async deleteArcadeGame(id) {
		try {
			const deletedArcadeGame = await prisma.arcadeGame.delete({
				where: { id }
			});
			return deletedArcadeGame;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
};
