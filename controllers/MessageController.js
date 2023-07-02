const admin = require("../firebase_sdk");

module.exports = class MessageController {
	static async messageSend(req, res, next) {
		try {
			const { id: senderId } = req.additionalData;
			let { receiverId, message } = req.body;
			const messagesRef = admin.database().ref("messages");
			messagesRef.push({ senderId, receiverId: +receiverId, message });
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
};
