const express = require("express");
const UserController = require("../controllers/UserController");
const ArcadeController = require("../controllers/ArcadeController");
const router = express.Router();

router.get("/users", UserController.findAll);
router.get("/users/:id", UserController.findOne);
router.post("/users/register", UserController.create);
router.post("/users/login", UserController.login);

router.get("/main", ArcadeController.mainPage);

module.exports = router;
