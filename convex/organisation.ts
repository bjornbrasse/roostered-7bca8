import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel.js";
import { mutation, type QueryCtx, query } from "./_generated/server.js";

export const organisationObject = {
  name: v.string(),
  nameShort: v.optional(v.string()),
  slug: v.string(),
};

// QUERIES

export const getById = query({
  args: { organisationId: v.string() },
  handler: async (ctx, args) => {
    const organisation = await ctx.db.get(
      args.organisationId as Id<"organisations">,
    );
    // if (!organisation) throw new ConvexError("Organisation not found");
    return organisation;
  },
});

export async function getOrganisationBySlug(ctx: QueryCtx, _slug: string) {
  const organisation = await ctx.db
    .query("organisations")
    .filter((q) => q.eq(q.field("slug"), "etz"))
    .unique();
  return organisation;
}

export const get = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const organisation = await getOrganisationBySlug(ctx, args.slug);
    if (!organisation) throw new ConvexError("Organisation not found");
    const departments = await ctx.db
      .query("departments")
      .filter((q) => q.eq(q.field("organisationId"), organisation._id))
      .collect();
    return { ...organisation, departments };
  },
});

export const list = query({
  handler: async ({ db }) => {
    return db.query("organisations").collect();
  },
});

// MUTATIONS

export const create = mutation({
  args: organisationObject,
  handler: async (ctx, args) => {
    return await ctx.db.insert("organisations", args);
  },
});
