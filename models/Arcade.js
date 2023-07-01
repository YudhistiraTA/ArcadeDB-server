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
};
