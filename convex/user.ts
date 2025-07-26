import { v } from "convex/values";
import { userInputSchema } from "../src/features/user/user-model.ts";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { zMutation } from "./utils.ts";

export const userObject = {
  firstName: v.string(),
  lastName: v.string(),
  email: v.string(),
  organisationId: v.id("organisations"),
};

// export const get = query({
// 	args: { userId: v.id('users') },
// 	handler: async (ctx, args) => {
// 		return await ctx.db.get(args.userId)
// 	},
// })

// export const list = query({
// 	handler: async (ctx) => {
// 		return await ctx.db.query('users').collect()
// 	},
// })

// MUTATIONS

export const create = zMutation({
  args: userInputSchema,
  handler: async (ctx, { organisationId, ...data }) => {
    await ctx.db.insert("users", {
      ...data,
      organisationId: organisationId as Id<"organisations">,
    });
  },
});
