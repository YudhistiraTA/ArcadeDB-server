const prisma = require("../prisma/prismaConfig");

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
};
