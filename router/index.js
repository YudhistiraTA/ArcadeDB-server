const express = require("express");
const UserController = require("../controllers/UserController");
const router = express.Router();

router.get("/users", UserController.findAll);
router.get("/users/:id", UserController.findOne);
router.post("/users/register", UserController.create);
router.post("/users/login", UserController.login);

module.exports = router;
