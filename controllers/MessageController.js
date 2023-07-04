const admin = require("../firebase_config/firebase_sdk");
const User = require("../models/User");

module.exports = class MessageController {
	static async messageSend(req, res, next) {
		try {
			const { id: senderId } = req.additionalData;
			const { receiverId, message } = req.body;
			const foundTarget = await User.findByPk(receiverId);
			if (!foundTarget)
				throw { name: "notFound", message: "Target user is not found" };
			if (senderId == receiverId)
				throw {
					name: "invalidInput",
					message: "Can not send message to self"
				};
			const senderMessagesRef = admin
				.database()
				.ref(`user_messages/${senderId}`);
			senderMessagesRef.push({
				senderId,
				receiverId: +receiverId,
				message,
				time: new Date().getTime(),
				asSender: true
			});

			const receiverMessagesRef = admin
				.database()
				.ref(`user_messages/${receiverId}`);
			receiverMessagesRef.push({
				senderId,
				receiverId: +receiverId,
				message,
				time: new Date().getTime(),
				asSender: false
			});
			const messagePayload = {
				notification: {
					title: `New message from ${senderId}`,
					body: message
				},
				topic: receiverId
			};
			admin
				.messaging()
				.send(messagePayload)
				.then((response) => {
					res.status(201).json({ message: "Message sent successfully." });
				})
				.catch((error) => {
					console.error(error);
					res.status(500).json({ error: "Failed to send message." });
				});
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
	static async fetchInbox(req, res, next) {
		try {
			const { id } = req.additionalData;
			const userMessagesRef = admin.database().ref(`user_messages/${id}`);
			userMessagesRef.once("value", function (snapshot) {
				const allMessages = snapshot.val();
				const latestMessages = {};
				for (const messageId in allMessages) {
					const message = allMessages[messageId];
					const partnerId = message.asSender
						? message.receiverId
						: message.senderId;
					if (
						latestMessages[partnerId] &&
						latestMessages[partnerId].time > message.time
					) {
						continue;
					}
					latestMessages[partnerId] = message;
				}
				res.status(200).json({ messages: latestMessages });
			});
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
	static async fetchChat(req, res, next) {
		try {
			const { id: currentUserId } = req.additionalData;
			const chatPartnerId = req.params.id;
			const foundTarget = await User.findByPk(chatPartnerId);
			if (!foundTarget)
				throw { name: "notFound", message: "Target user is not found" };
			const userMessagesRef = admin
				.database()
				.ref("user_messages/" + currentUserId);
			userMessagesRef.once("value", function (snapshot) {
				const allMessages = snapshot.val();
				const chatMessages = {};
				for (const messageId in allMessages) {
					const message = allMessages[messageId];
					if (
						(message.senderId == currentUserId &&
							message.receiverId == chatPartnerId) ||
						(message.senderId == chatPartnerId &&
							message.receiverId == currentUserId)
					) {
						chatMessages[messageId] = message;
					}
				}
				res.status(200).json({ messages: chatMessages });
			});
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
};
