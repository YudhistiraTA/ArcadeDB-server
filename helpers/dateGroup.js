module.exports = function groupSessionsByDate(sessions) {
	return sessions.reduce((acc, session) => {
		const date = new Date(session.date);
		const formattedDate = `${date.getFullYear()}-${
			date.getMonth() + 1
		}-${date.getDate()}`;
		const { date: _, id: __, ...sessionData } = session;
		if (!acc[formattedDate]) {
			acc[formattedDate] = [];
		}
		acc[formattedDate].push(sessionData);
		return acc;
	}, {});
};
