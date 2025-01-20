import { createTRPCRouter, publicProcedure } from "../trpc";
import { loginSchema } from "~/common/validations/auth";
import { verify } from "@node-rs/argon2";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    try {
      const user = await ctx.db.user.findFirst({
        where: {
          email: input.email,
        },
        select: {
          password: true,
        },
      });

      if (!user) {
        return {
          status: "error",
          message: "Not found user with this email",
          code: "EMAIL_NOT_FOUND",
        } as const;
      }

      const isValidPassword = await verify(user.password, input.password);

      if (!isValidPassword) {
        return {
          status: "error",
          message: "Invalid password",
          code: "INVALID_PASSWORD",
        } as const;
      }

      return {
        status: "success",
        message: "Login success",
      } as const;
    } catch (e) {
      return {
        status: "error",
        message: e instanceof Error ? e.message : "Unknown error",
      } as const;
    }
  }),
});
