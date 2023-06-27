const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const router = require("./router");
const errorHandling = require("./middlewares/errorHandling");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandling);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
