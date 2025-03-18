import { faker } from "@faker-js/faker";
import { hash } from "@node-rs/argon2";
import {
  OrderStatus,
  PrismaClient,
  ProductCategory,
  TransactionMethod,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";

const db = new PrismaClient();

const USERS_COUNT = 10;
const PRODUCTS_COUNT = 50;

async function main() {
  // clean up
  await db.order_item.deleteMany();
  await db.order.deleteMany();
  await db.product_accessory.deleteMany();
  await db.product.deleteMany();
  await db.user_address.deleteMany();
  await db.user_transaction.deleteMany();
  await db.user.deleteMany();
  await db.region_country.deleteMany();
  await db.region.deleteMany();

  const hashedUserPassword = await hash("Test1234!");

  await db.region.create({
    data: {
      name: "Europe",
      countries: {
        createMany: {
          data: [
            { name: "Germany", iso_2_code: "DE" },
            { name: "France", iso_2_code: "FR" },
            { name: "Italy", iso_2_code: "IT" },
          ],
        },
      },
    },
  });

  await db.region.create({
    data: {
      name: "Asia",
      countries: {
        createMany: {
          data: [
            { name: "China", iso_2_code: "CN" },
            { name: "Japan", iso_2_code: "JP" },
            { name: "India", iso_2_code: "IN" },
          ],
        },
      },
    },
  });

  await db.region.create({
    data: {
      name: "North America",
      countries: {
        createMany: {
          data: [
            { name: "United States", iso_2_code: "US" },
            { name: "Canada", iso_2_code: "CA" },
            { name: "Mexico", iso_2_code: "MX" },
          ],
        },
      },
    },
  });

  await db.region.create({
    data: {
      name: "South America",
      countries: {
        createMany: {
          data: [
            { name: "Brazil", iso_2_code: "BR" },
            { name: "Argentina", iso_2_code: "AR" },
            { name: "Colombia", iso_2_code: "CO" },
          ],
        },
      },
    },
  });

  const countries = await db.region_country.findMany({
    select: {
      id: true,
    },
  });

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
              region_country_id:
                countries[Math.floor(Math.random() * countries.length)]!.id,
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
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                method: getRandomEnum(TransactionMethod),
                type: getRandomEnum(TransactionType),
                status: getRandomEnum(TransactionStatus),
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
          category: getRandomEnum(ProductCategory),
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
          status: getRandomEnum(OrderStatus),
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

  await db.user.create({
    data: {
      name: "admin",
      email: "admin@gmail.com",
      emailVerified: new Date(),
      image: faker.image.avatarGitHub(),
      role: "ADMIN",
      password: hashedUserPassword,
    },
  });

  console.log("database has been seeded 🌱");
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

export const getRandomEnum = <T extends object>(enumObj: T): T[keyof T] => {
  const values = Object.values(enumObj) as unknown as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * values.length);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return values[randomIndex];
};
