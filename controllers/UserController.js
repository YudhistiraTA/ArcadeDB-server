const User = require("../models/User");
const bcrypt = require("bcrypt");
const prisma = require("../prisma/prismaConfig");
const { generateToken } = require("../helpers/jwt");
const midtransClient = require("midtrans-client");
const ProfilePicture = require("../models/ProfilePictures");
module.exports = class UserController {
	static async findAll(req, res, next) {
		try {
			const data = await User.findAll();
			res.status(200).json(data);
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
	static async create(req, res, next) {
		try {
			let { username, email, password, ProfilePictureId } = req.body;
			if (!ProfilePictureId) ProfilePictureId = 1;
			else ProfilePictureId = +ProfilePictureId;
			const status = await User.create({
				username,
				email,
				password,
				ProfilePictureId
			});
			delete status.password;
			res.status(201).json(status);
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
			if (!data)
				throw {
					name: "invalidLogin",
					message: "Invalid email / password"
				};
			const valid = bcrypt.compareSync(password, data.password);
			if (!valid)
				throw {
					name: "invalidLogin",
					message: "Invalid email / password"
				};
			const token = generateToken({
				id: data.id,
				email: data.email
			});
			res.status(200).json({
				token
			});
		} catch (error) {
			next(error);
		}
	}
	static async profile(req, res, next) {
		try {
			const {id} = req.additionalData;
			const data = await User.findByPk(id);
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	}
	static async transaction(req, res, next) {
		try {
			const findUser = await User.findByPk(req.additionalData.id);

			let snap = new midtransClient.Snap({
				isProduction: false,
				serverKey: "SB-Mid-server-_8c1DQYqomT2roIxrzfzMs68"
			});

			let parameter = {
				transaction_details: {
					order_id:
						"TRANSACTION_" +
						Math.floor(1000000 + Math.random() * 9000000),
					gross_amount: 200000
				},
				credit_card: {
					secure: true
				},
				customer_details: {
					email: findUser.email
				}
			};

			const midtrans_token = await snap.createTransaction(parameter);
			res.status(201).json(midtrans_token);
		} catch (err) {
			console.log(err);
			next(err);
		}
	}
	static async findAllPfps(req, res, next) {
		try {
			const data = await ProfilePicture.findAll();
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	}
	static async followUser(req, res, next) {
		try {
			const { id: FollowerId } = req.additionalData;
			const { id: FollowedId } = req.params;
			const status = await User.createFollow(+FollowerId, +FollowedId);
			res.status(201).json(status);
		} catch (error) {
			next(error);
		}
	}
	static async unfollowUser(req, res, next) {
		try {
			const { id: FollowerId } = req.additionalData;
			const { id: FollowedId } = req.params;
			const status = await User.removeFollow(+FollowerId, +FollowedId);
			res.status(201).json(status);
		} catch (error) {
			next(error);
		}
	}
	static async followedList(req, res, next) {
		try {
			const { id: FollowerId } = req.additionalData;
			const data = await User.followingList(FollowerId);
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	}
	static async followerList(req, res, next) {
		try {
			const { id: FollowedId } = req.additionalData;
			const data = await User.followerList(FollowedId);
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	}
};
