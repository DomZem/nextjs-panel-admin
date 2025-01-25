import { productAccessoryRouter } from "./routers/product/product-accessory";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userAddressRouter } from "./routers/user/user-address";
import { productRouter } from "./routers/product/product";
import { orderRouter } from "./routers/order/order";
import { userRouter } from "./routers/user/user";
import { authRouter } from "./routers/auth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  userAddress: userAddressRouter,
  product: productRouter,
  productAccessory: productAccessoryRouter,
  order: orderRouter,
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
