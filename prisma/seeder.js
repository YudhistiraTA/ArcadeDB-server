const prisma = require("./prismaConfig");

async function main() {
	const masterUser = await prisma.user.create({
		data: {
			email: "master@mail.com",
			username: "master",
			password:
				"$2b$10$ujkshISG1sWH8AkMnX8z.ei4Rk2ljLq1ivuK5GkSjrUz2ncpwOWpu",
			premium: true,
			subscriptionDeadline: new Date(
				new Date().setDate(new Date().getDate() + 30) // 30 days from now
			)
		}
	});
	const Aeon_BSD = await prisma.arcade.upsert({
		where: { id: 1 },
		update: {},
		create: {
			name: "Aeon BSD",
			lat: -6.3053252,
			lng: 106.6435146,
			rating: 0,
			ratingCount: 0,
			Brand: {
				create: {
					name: "Timezone",
					imageUrl:
						"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAJBmDsZQ08vJgnFytB0Sl4P4KImMYlt2c9UysaaAS&s"
				}
			},
			ArcadeGame: {
				create: [
					{
						reportCount: 0,
						Game: {
							create: {
								name: "SDVX",
								logoUrl:
									"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJM5vU0Wu694387x-PYIX10DWoIhCrcoF0m8JJTHSo&s"
							}
						}
					},
					{
						reportCount: 0,
						Game: {
							create: {
								name: "Maimai",
								logoUrl:
									"https://media.vgm.io/products/37/11473/11473-1655072914.png"
							}
						}
					}
				]
			},
			Bookmark: {
				create: {
					UserId: masterUser.id
				}
			},
			Session: {
				create: {
					UserId: masterUser.id,
					date: new Date()
				}
			}
		}
	});
	const games = await prisma.game.createMany({
		data: [
			{
				name: "Taiko no Tatsujin",
				logoUrl:
					"https://upload.wikimedia.org/wikipedia/en/3/3f/Taiko_no_Tatsujin_English_logo.png"
			},
			{
				name: "DrumMania",
				logoUrl:
					"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwu656mAj-PuMxeWE0Z9ZPqhc_K3fqLKOFGk-ammkBS4-m6Ljknr8eqVv2zeu19o8rwDM&usqp=CAU"
			},
			{
				name: "Pump It Up",
				logoUrl:
					"https://i.pinimg.com/originals/dd/cf/8d/ddcf8d13bd081dfc1cbdf2eda20113c4.png"
			},
			{
				name: "Beatmania",
				logoUrl:
					"https://s3.amazonaws.com/gt7sp-prod/decal/16/36/90/6061919871825903616_1.png"
			}
		]
	});
	const brands = await prisma.brand.createMany({
		data: [
			{
				name: "Amazone",
				imageUrl: "https://pbs.twimg.com/profile_images/960431492160618496/akedMKBR_400x400.jpg"
			},
			{
				name: "Fun World",
				imageUrl: "https://lsurecreation.files.wordpress.com/2018/01/funworld.jpg"
			}
		]
	})
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
