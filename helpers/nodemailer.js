const nodemailer = require("nodemailer");

function registerSuccess(email) {
	let transporter = nodemailer.createTransport({
		port: 465,
		secure: true,
		service: "gmail",
		auth: {
			user: "kobonagara@gmail.com",
			pass: "czwzkvtwwbftzgjo"
		}
	});
	let info = transporter.sendMail({
		from: "jejeshuang307@gmail.com",
		to: email,
		subject: "Register Success!",
		text: `Hello ${email}, welcome to My ArcadeDb, please enjoy`
	});
}

function deadline(email, username) {
	let transporter = nodemailer.createTransport({
		port: 465,
		secure: true,
		service: "gmail",
		auth: {
			user: "kobonagara@gmail.com",
			pass: "czwzkvtwwbftzgjo"
		}
	});
	let info = transporter.sendMail({
		from: "jejeshuang307@gmail.com",
		to: email,
		subject: "Your ArcadeDB subscription has expired!",
		text: `Hello ${username}! We regret to inform you that your ArcadeDB subscription has expired. Please subscribe again to enjoy our premium perks!`
	});
}

module.exports = { registerSuccess, deadline };
