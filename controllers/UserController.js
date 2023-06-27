const { User } = require("../models");
const bcrypt = require("bcrypt");
module.exports = class UserController {
	static async findAll(req, res, next) {
		try {
			const data = await User.findAll();
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	}
	static async create(req, res, next) {
		try {
			const { username, email, password } = req.body;
			const status = await User.create({ username, email, password });
			res.status(201).json({ messsage: "User registered" });
		} catch (error) {
			next(error);
		}
	}
	static async findOne(req, res, next) {
		try {
			const { id } = req.params;
			const data = await User.findByPk(id);
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	}
	static async login(req, res, next) {
		try {
			const { email, password } = req.body;
			const data = await User.findOne({ where: { email } });
            if (!data) throw {name: "invalidLogin", message: "Invalid email / password"}
			const valid = bcrypt.compareSync(password, data.password);
            if (!valid) throw {name: "invalidLogin", message: "Invalid email / password"}
            res.status(200).send("success");
		} catch (error) {
			next(error);
		}
	}
};
