module.exports = (error, req, res, next) => {
	let code = 0;
	switch (error.name) {
		case "constraintError":
		case "uniqueEmail":
		case "emailFormat":
        case "invalidInput":
			code = 400;
			break;
        case "invalidLogin":
            code = 401;
            break;
        case "notFound":
            code = 404;
            break;
		default:
			code = 500;
	}
	res.status(code).json({
		message: error.message || "Internal server error"
	});
};
