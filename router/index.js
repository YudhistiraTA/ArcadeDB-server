const express = require("express");
const UserController = require("../controllers/UserController");
const ArcadeController = require("../controllers/ArcadeController");
const { authentication } = require("../middlewares/authentication");
const router = express.Router();

router.get("/users", UserController.findAll);
router.get("/users/:id", UserController.findOne);
router.post("/users/register", UserController.create);
router.post("/users/login", UserController.login);
router.get("/main", ArcadeController.mainPage);
router.get("/detail/:id", ArcadeController.detailPage);

router.use(authentication)
router.get('/midtrans',UserController.transaction)


module.exports = router;
