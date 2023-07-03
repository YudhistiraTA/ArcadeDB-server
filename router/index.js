const express = require("express");
const UserController = require("../controllers/UserController");
const ArcadeController = require("../controllers/ArcadeController");
const { authentication } = require("../middlewares/authentication");
const GameController = require("../controllers/GameController");
const MessageController = require("../controllers/MessageController");
const BookmarkController = require("../controllers/BookmarkController");
const router = express.Router();

router.get("/users", UserController.findAll);
router.get("/users/:id", UserController.findOne);
router.post("/users/register", UserController.create);
router.post("/users/login", UserController.login);
router.get("/pfps", UserController.findAllPfps);

router.get("/main", ArcadeController.mainPage);
router.get("/detail/:id", ArcadeController.detailPage);

router.get("/games", GameController.findAll);
router.get("/games/:id", GameController.gameWithLocation);

router.get("/brands", GameController.findBrand);
router.post("/arcades", ArcadeController.createArcade);
router.get("/arcades", ArcadeController.findAll);

router.use(authentication);
router.post("/session/add/:id", ArcadeController.addSession);

router.get("/midtrans", UserController.transaction);

router.post("/sendMessage", MessageController.messageSend);
router.get("/inbox", MessageController.fetchInbox);
router.get("/chat/:id", MessageController.fetchChat);

router.get("/bookmarks", BookmarkController.findAll);
router.post("/bookmarks/:id", BookmarkController.addBookmark);
router.delete("/bookmarks/:id", BookmarkController.deleteBookmark);

module.exports = router;
