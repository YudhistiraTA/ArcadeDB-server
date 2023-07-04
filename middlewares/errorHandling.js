module.exports = (error, req, res, next) => {
	let code = 0;
	console.log(error.name);
	switch (error.name) {
		case "constraintError":
		case "uniqueEmail":
		case "uniqueUsername":
		case "emailFormat":
		case "invalidInput":
			code = 400;
			break;
		case "premiumError":
		case "invalidLogin":
		case "Unauthenticated":
		case "JsonWebTokenError":
			code = 401;
			break;
		case "notFound":
		case "NotFoundError":
		case "notFoundError":
			code = 404;
			break;
		default:
			code = 500;
	}
	res.status(code).json({
		message: error.message || "Internal server error"
	});
};
