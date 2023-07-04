const prisma = require("../prisma/prismaConfig");

module.exports = class ProfilePicture {
	static async findAll() {
		const data = await prisma.profilePicture.findMany();
		return data;
	}
	static async findByPk(id) {
		try {
			const data = await prisma.profilePicture.findUniqueOrThrow({
				where: { id }
			});
			if (!data)
				throw {
					name: "notFound",
					message: "This profile picture is not available"
				};
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
};
