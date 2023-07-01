const prisma = require("../prisma/prismaConfig");

module.exports = class Game {
    static async findAll() {
        try {
            const games = await prisma.game.findMany();
            return games;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}