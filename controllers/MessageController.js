const admin = require("../firebase_config/firebase_sdk");

module.exports = class MessageController {
	static async messageSend(req, res, next) {
		try {
			const { id: senderId } = req.additionalData;
			const { receiverId, message } = req.body;
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
					res.json({ message: "Message sent successfully." });
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
};
