const prisma = require("../prisma/prismaConfig");

module.exports = class ProfilePicture {
	static async findAll() {
		const data = await prisma.profilePicture.findMany();
		return data;
	}
};
