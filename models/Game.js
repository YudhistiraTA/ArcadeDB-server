const prisma = require("../prisma/prismaConfig");

module.exports = class Game {
	static async findAll() {
		const games = await prisma.game.findMany();
		return games;
	}
	static async findBrand() {
		const brands = await prisma.brand.findMany();
		return brands;
	}
	static async findDetail(id) {
		try {
			id = +id;
			if (!id) throw { name: "notFound", message: "Game not found" };
			const game = await prisma.game.findUnique({
				where: { id },
				include: {
					ArcadeGame: {
						select: {
							reportCount: true,
							Arcade: {
								include: {
									Brand: true
								}
							}
						}
					}
				}
			});
			if (!game) throw { name: "notFound", message: "Game not found" };
			return game;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
};
