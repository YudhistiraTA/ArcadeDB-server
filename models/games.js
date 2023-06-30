const prisma = require("../prisma/prismaConfig");

module.exports = class Game {
  static async findAllGame() {
    try {
      const game = await prisma.game.findMany();
      return game;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async findOneGame(option) {
    try {
      const result = await prisma.game.findUnique(option);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};
