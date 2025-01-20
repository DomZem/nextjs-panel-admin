import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { hash } from "@node-rs/argon2";

const db = new PrismaClient();

async function main() {
  // clean up
  await db.user.deleteMany();

  // create users

  const hashedUserPassowrd = await hash("Test1234!");

  await Promise.all(
    Array.from({ length: 55 }).map(async () => {
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
          password: hashedUserPassowrd,
        },
      });
    }),
  );

  // create admin user
  await db.user.create({
    data: {
      name: "admin",
      email: "admin@gmail.com",
      emailVerified: new Date(),
      role: "ADMIN",
      password: hashedUserPassowrd,
    },
  });
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
