import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { hash } from "@node-rs/argon2";

const db = new PrismaClient();

const USERS_COUNT = 55;
const PRODUCTS_COUNT = 55;

async function main() {
  // clean up
  await db.order_item.deleteMany();
  await db.order.deleteMany();
  await db.product_accessory.deleteMany();
  await db.product.deleteMany();
  await db.user_address.deleteMany();
  await db.user_transaction.deleteMany();
  await db.user.deleteMany();

  const hashedUserPassword = await hash("Test1234!");

  // create users
  await Promise.all(
    Array.from({ length: USERS_COUNT }).map(async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      await db.user.create({
        data: {
          name: `${firstName} ${lastName}`,
          email: faker.internet.email({ firstName, lastName }),
          image: faker.image.avatarGitHub(),
          emailVerified:
            Math.random() > 0.5
              ? faker.date.between({
                  from: "2000-01-01",
                  to: Date.now(),
                })
              : null,
          addresses: {
            create: {
              city: faker.location.city(),
              country: faker.location.country(),
              street_address: faker.location.street(),
              zip_code: faker.location.zipCode(),
            },
          },
          transactions: {
            createMany: {
              data: Array.from({
                length: faker.number.int({ min: 30, max: 50 }),
              }).map(() => ({
                amount_cents: faker.number.int({ min: 1, max: 2_000 }),
                description: "",
                method: Math.random() > 0.5 ? "BLIK" : "CREDIT_CARD",
                type: Math.random() > 0.5 ? "DEPOSIT" : "WITHDRAW",
                status: Math.random() > 0.5 ? "SUCCESS" : "FAILED",
              })),
            },
          },
          password: hashedUserPassword,
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

  await Promise.all(
    Array.from({ length: PRODUCTS_COUNT }).map(async () => {
      const user = await db.user.findFirstOrThrow({
        select: {
          id: true,
        },
      });

      let orderTotalCents = 0;

      const order = await db.order.create({
        data: {
          total_cents: orderTotalCents,
          status: Math.random() > 0.5 ? "PENDING" : "SHIPPED",
          user_id: user.id,
        },
      });

      await Promise.all(
        Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(
          async () => {
            const product = await db.product.findFirstOrThrow({
              select: {
                id: true,
                price_cents: true,
              },
            });

            const quantity = faker.number.int({ min: 1, max: 5 });

            const orderItemTotalCents = Math.round(
              product.price_cents * quantity,
            );

            await db.order_item.create({
              data: {
                quantity,
                order_id: order.id,
                product_id: product.id,
                price_cents: orderItemTotalCents,
              },
            });

            orderTotalCents += orderItemTotalCents;
          },
        ),
      );

      await db.order.update({
        where: {
          id: order.id,
        },
        data: {
          total_cents: orderTotalCents,
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
      password: hashedUserPassword,
    },
  });

  console.log("Database has been seeded 🌱");
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
