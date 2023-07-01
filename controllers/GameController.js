const { Game } = require("../models");

module.exports = class gameController {
  static async findAllGame(req, res, next) {
    try {
      const data = await Game.findAll();
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
