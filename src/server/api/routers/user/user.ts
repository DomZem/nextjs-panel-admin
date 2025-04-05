import { paginationSchema } from "~/common/validations/pagination";
import { userFormSchema } from "~/common/validations/user/user";
import { adminProcedure, createTRPCRouter } from "../../trpc";
import { UserScalarSchema } from "~/zod-schemas/models";
import { UserRole } from "@prisma/client";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getAll: adminProcedure
    .input(
      paginationSchema.merge(
        z.object({
          filters: z
            .object({
              userName: z.string().optional(),
              userEmail: z.string().optional(),
              userRole: z.nativeEnum(UserRole).optional(),
            })
            .optional(),
        }),
      ),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        name: {
          contains: input.filters?.userName?.trim()
            ? input.filters?.userName
            : undefined,
        },
        email: {
          contains: input.filters?.userEmail?.trim()
            ? input.filters?.userEmail
            : undefined,
        },
        role: input.filters?.userRole,
      };

      const users = await ctx.db.user.findMany({
        where,
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
        orderBy: {
          id: "asc",
        },
      });

      const totalUsersCount = await ctx.db.user.count({
        where,
      });

      return {
        totalPagesCount: Math.ceil(totalUsersCount / input.pageSize),
        users,
      };
    }),
  getSearchUsers: adminProcedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.name) {
        const users = await ctx.db.user.findMany({
          take: 5,
          orderBy: {
            id: "asc",
          },
          select: {
            id: true,
            name: true,
          },
        });

        return users;
      }

      const filteredUsers = await ctx.db.user.findMany({
        where: {
          name: {
            contains: input.name,
          },
        },
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      });

      return filteredUsers;
    }),
  getFilteredUsers: adminProcedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        where: {
          name: {
            contains: input.name,
          },
        },
      });

      return users;
    }),
  getOne: adminProcedure
    .input(UserScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
  createOne: adminProcedure
    .input(userFormSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user.create({
        data: input,
      });

      return result;
    }),
  updateOne: adminProcedure
    .input(userFormSchema.required({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: input,
      });

      return result;
    }),
  deleteOne: adminProcedure
    .input(UserScalarSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.user.delete({
        where: {
          id: input.id,
        },
      });

      return result;
    }),
});
