const { PrismaClient } = require('@prisma/client')
const  games  = require("../db/games")
const prisma = new PrismaClient();

async function main() {
  for (let game of games) {
    await prisma.game.create({
      data: game,
    });
  }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
