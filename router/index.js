const express = require("express");
const UserController = require("../controllers/UserController");
const ArcadeController = require("../controllers/ArcadeController");
const GameController = require("../controllers/GameController");
const router = express.Router();

router.get("/users", UserController.findAll);
router.get("/users/:id", UserController.findOne);
router.post("/users/register", UserController.create);
router.post("/users/login", UserController.login);

router.get("/main", ArcadeController.mainPage);
router.get("/detail/:id", ArcadeController.detailPage);
router.get("/games", GameController.findAll);
router.get("/brands", GameController.findBrand);

module.exports = router;
