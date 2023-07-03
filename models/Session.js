const prisma = require("../prisma/prismaConfig");

module.exports = class Session {
	static async create(UserId, ArcadeId, date) {
		try {
			if (date < new Date())
				throw {
					name: "constraintError",
					message: "Minimum date is today"
				};
			const existingSession = await prisma.session.findFirst({
				where: {
					UserId,
					ArcadeId,
					date
				}
			});
			if (existingSession) {
				throw {
					name: "constraintError",
					message: "Session on this date for you already exists"
				};
			}
			const status = await prisma.session.create({
				data: { date, ArcadeId, UserId }
			});
			return status;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
};
