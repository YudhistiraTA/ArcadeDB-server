const prisma = require("../prisma/prismaConfig");
const bcrypt = require("bcrypt");

function validateEmail(email) {
	var emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
	return emailRegex.test(email);
}

function validateInput(data) {
	for (let key in data) {
		if (!data[key]) return { status: false, key };
	}
	return { status: true };
}

function capitalizeFirstWord(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function exclude(user, keys) {
	return Object.fromEntries(
		Object.entries(user).filter(([key]) => !keys.includes(key))
	);
}

module.exports = class User {
	static async findAll() {
		const users = await prisma.user.findMany();
		return users.map((user) => exclude(user, ["password"]));
	}
	static async findOne(option) {
		try {
			const result = await prisma.user.findUnique(option);
			return result;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	static async findByPk(id) {
		try {
			id = +id;
			if (!id)
				throw { name: "invalidInput", message: "Invalid ID requested" };
			const user = await prisma.user.findUnique({
				where: { id },
				select: {
					id: true,
					username: true,
					followerCount: true,
					followingCount: true,
					premium: true,
					Session: {
						select: {
							date: true,
							Arcade: {
								select: {
									Brand: {
										select: { name: true, imageUrl: true }
									},
									id: true,
									name: true,
									lat: true,
									lng: true,
									rating: true,
									ratingCount: true
								}
							}
						}
					},
					ProfilePicture: {
						select: {
							imageUrl: true
						}
					}
				}
			});
			return exclude(user, ["password"]);
		} catch (error) {
			if (
				error.message === "Cannot convert undefined or null to object"
			) {
				error.message = `User with ID ${id} not found`;
				error.name = "notFound";
			}
			throw error;
		}
	}
	static async create(data) {
		try {
			const validation = validateInput(data);
			if (!validation.status)
				throw {
					name: "constraintError",
					message:
						capitalizeFirstWord(validation.key) + " is required"
				};
			const emailTaken = await prisma.user.findUnique({
				where: {
					email: data.email
				}
			});
			if (emailTaken)
				throw {
					name: "uniqueEmail",
					message: "Email is already taken"
				};
			if (!validateEmail(data.email))
				throw {
					name: "emailFormat",
					message: "Email format is invalid"
				};
			data.password = bcrypt.hashSync(data.password, 10);
			const creationStatus = await prisma.user.create({ data });
			return creationStatus;
		} catch (error) {
			throw error;
		}
	}
	static async expireSub(id) {
		try {
			const status = await prisma.user.update({where: {id}, data: {premium: false, subscriptionDeadline: null}});
			return status;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
};
