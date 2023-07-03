const prisma = require("../prisma/prismaConfig");

module.exports = class ProfilePicture {
    static async findAll() {
        try {
            const data = await prisma.profilePicture.findMany();
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}