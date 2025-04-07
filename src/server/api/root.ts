import { productAccessoryRouter } from "./routers/product/product-accessory";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userTransactionRouter } from "./routers/user/user-transaction";
import { regionCountryRouter } from "./routers/region/region-country";
import { userAddressRouter } from "./routers/user/user-address";
import { orderItemRouter } from "./routers/order/order-item";
import { productRouter } from "./routers/product/product";
import { regionRouter } from "./routers/region/region";
import { orderRouter } from "./routers/order/order";
import { userRouter } from "./routers/user/user";
import { authRouter } from "./routers/auth";
import { carRouter } from "./routers/car/car";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  userAddress: userAddressRouter,
  userTransaction: userTransactionRouter,
  product: productRouter,
  productAccessory: productAccessoryRouter,
  order: orderRouter,
  orderItem: orderItemRouter,
  region: regionRouter,
  regionCountry: regionCountryRouter,
  car: carRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
