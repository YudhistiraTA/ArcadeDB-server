const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const router = require("./router");
const errorHandling = require("./middlewares/errorHandling");
const { registerSuccess } = require("./helpers/nodemailer");
const cron = require("node-cron");
const  User  = require("./models/User");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandling);

app.listen(port, () => {
  cron.schedule("0 0 1 * *", async () => {
    try {
      console.log("---------------------");
      console.log("Running Cron Job");

      const user = await User.findAll({
        attributes: {
          exclude: ["id", "username", "password", "createdAt", "updatedAt"],
        },
      });
      user.forEach((element) => {
        registerSuccess(element.email);
        console.log(element.email);
      });
      //   console.log(user);
    } catch (error) {
      console.log(error);
    }
  });
  console.log(`Example app listening on port ${port}`);
});
