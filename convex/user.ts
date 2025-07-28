import { v } from "convex/values";
import z from "zod";
import {
  userInputSchema,
  userSchema,
} from "../src/features/user/user-model.ts";
import type { Id } from "./_generated/dataModel";
import { zMutation, zQuery } from "./utils.ts";

export const userObject = {
  firstName: v.string(),
  lastName: v.string(),
  email: v.string(),
  organisationId: v.id("organisations"),
};

export const getByEmail = zQuery({
  args: { email: userSchema.shape.email },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const hasPassword = zQuery({
  args: { _id: userSchema.shape._id },
  handler: async (ctx, args) => {
    const userCredentials = await ctx.db
      .query("userCredentials")
      .withIndex("by_userId", (q) => q.eq("userId", args._id as Id<"users">))
      .unique();
    return !!userCredentials?.passwordHash;
  },
});

export const get_WITH_CREDENTIALS = zQuery({
  args: { email: userSchema.shape.email },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (!user) return null;
    const userCredentials = await ctx.db
      .query("userCredentials")
      .withIndex("by_userId", (q) => q.eq("userId", user._id as Id<"users">))
      .unique();
    return { ...user, passwordHash: userCredentials?.passwordHash ?? null };
  },
});

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

export const createPassword = zMutation({
  args: { userId: userSchema.shape._id, passwordHash: z.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("userCredentials", {
      userId: args.userId as Id<"users">,
      passwordHash: args.passwordHash,
    });
  },
});
