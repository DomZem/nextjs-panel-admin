import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { productAccessoryRouter } from "./routers/product-accessory";
import { productRouter } from "./routers/product";
import { orderRouter } from "./routers/order";
import { userRouter } from "./routers/user";
import { authRouter } from "./routers/auth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
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
