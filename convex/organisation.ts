import { v } from "convex/values";
import type { Id } from "./_generated/dataModel.js";
import { mutation, type QueryCtx, query } from "./_generated/server.js";

export const organisationObject = {
  name: v.string(),
  nameShort: v.optional(v.string()),
  slug: v.string(),
};

// QUERIES

export const getById = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const organisation = await ctx.db.get(args.orgId as Id<"organisations">);
    if (!organisation) return null;
    const departments = await ctx.db
      .query("departments")
      .withIndex("by_organisationId", (q) =>
        q.eq("organisationId", organisation._id),
      )
      .collect();
    return { ...organisation, departments };
  },
});

export async function getBySlug(ctx: QueryCtx, _slug: string) {
  const organisation = await ctx.db
    .query("organisations")
    .filter((q) => q.eq(q.field("slug"), "etz"))
    .unique();
  return organisation;
}

// export const get = query({
//   args: { slug: v.string() },
//   handler: async (ctx, args) => {
//     const organisation = await getOrganisationBySlug(ctx, args.slug);
//     if (!organisation) throw new ConvexError("Organisation not found");
//     const departments = await ctx.db
//       .query("departments")
//       .filter((q) => q.eq(q.field("organisationId"), organisation._id))
//       .collect();
//     return { ...organisation, departments };
//   },
// });

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

// HELPERS

export async function organisationGetById(
  ctx: QueryCtx,
  args: { organisationId: string },
) {
  return await ctx.db.get(args.organisationId as Id<"organisations">);
}

export async function organisationGetBySlug(
  ctx: QueryCtx,
  args: { slug: string },
) {
  return await ctx.db
    .query("organisations")
    .withIndex("by_slug", (q) => q.eq("slug", args.slug))
    .unique();
}
