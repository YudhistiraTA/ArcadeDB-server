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
			const result = await prisma.user.findUnique(option)
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
			const user = await prisma.user.findUnique({ where: { id } });
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
};
