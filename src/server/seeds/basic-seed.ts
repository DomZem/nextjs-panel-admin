import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const db = new PrismaClient();

async function main() {
  // clean up
  await db.user.deleteMany();

  // create users
  await Promise.all(
    Array.from({ length: 2 }).map(async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      await db.user.create({
        data: {
          name: `${firstName} ${lastName}`,
          email: faker.internet.email({ firstName, lastName }),
          emailVerified: faker.date.between({
            from: "2000-01-01",
            to: Date.now(),
          }),
        },
      });
    }),
  );
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
