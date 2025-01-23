import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { hash } from "@node-rs/argon2";

const db = new PrismaClient();

const USERS_COUNT = 55;
const PRODUCTS_COUNT = 55;

async function main() {
  // clean up
  await db.user.deleteMany();
  await db.product_accessory.deleteMany();
  await db.product.deleteMany();

  const hashedUserPassowrd = await hash("Test1234!");

  // create users
  await Promise.all(
    Array.from({ length: USERS_COUNT }).map(async () => {
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

  // create products with accessories
  await Promise.all(
    Array.from({ length: PRODUCTS_COUNT }).map(async () => {
      await db.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productName(),
          vat_percentage: faker.number.float({
            min: 5,
            max: 25,
            multipleOf: 0.5,
          }),
          category: Math.random() > 0.5 ? "EARPHONES" : "HEADPHONES",
          price_cents: faker.number.float({
            min: 100_00,
            max: 1000_00,
            multipleOf: 0.01,
          }),
          quantity: faker.number.int({ min: 1, max: 500 }),
          card_image_url: "",
          features_content: "",
          accessories: {
            createMany: {
              data: Array.from({
                length: faker.number.int({ min: 1, max: 5 }),
              }).map(() => ({
                name: faker.commerce.product(),
                quantity: faker.number.int({ min: 1, max: 5 }),
              })),
            },
          },
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
