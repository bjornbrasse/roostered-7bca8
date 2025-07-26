import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel.js";
import {
  type MutationCtx,
  mutation,
  type QueryCtx,
  query,
} from "./_generated/server.js";
import { getOrganisationBySlug } from "./organisation.js";

export const departmentObject = {
  name: v.string(),
  organisationId: v.id("organisations"),
  slug: v.optional(v.string()),
};

// QUERIES

export const listByOrganisationId = query({
  args: { organisationId: v.string() },
  handler: async (ctx, args) => {
    const departments = await ctx.db
      .query("departments")
      .filter((q) => q.eq(q.field("organisationId"), args.organisationId))
      .collect();
    return departments;
  },
});

export const findBySlugs = query({
  args: { organisationSlug: v.string(), departmentSlug: v.string() },
  handler: async (ctx, args) => {
    const department = await getDepartmentBySlugs(ctx, args);
    if (!department) throw new ConvexError("Department not found");
    const schedules = await ctx.db
      .query("schedules")
      .filter((q) => q.eq(q.field("departmentId"), department._id))
      .collect();

    // const departmentEmployees = await getDepartmentEmployees(
    // 	ctx,
    // 	department._id,
    // )

    const tasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("departmentId"), department._id))
      .collect();

    // return { ...department, departmentEmployees, schedules, tasks }
    return { ...department, schedules, tasks };
  },
});

// export const getEmployees = query({
// 	args: { departmentSlug: v.string(), organisationSlug: v.string() },
// 	handler: async (ctx, args) => {
// 		const department = await getDepartmentBySlugs(ctx, args)
// 		if (!department) throw new ConvexError('Department not found')

// 		return await getDepartmentEmployees(ctx, department._id)
// 	},
// })

// MUTATIONS

export const create = mutation({
  args: {
    name: v.string(),
    organisationId: v.string(),
    slug: v.optional(v.string()),
  },
  handler: async ({ db }, args) => {
    await db.insert("departments", {
      ...args,
      organisationId: args.organisationId as Id<"organisations">,
    });
  },
});

// HELPERS

export async function getDepartmentBySlugs(
  ctx: QueryCtx | MutationCtx,
  slugs: { departmentSlug: string; organisationSlug: string },
) {
  const organisation = await getOrganisationBySlug(ctx, slugs.organisationSlug);
  if (!organisation) throw new ConvexError("Organisation not found");
  const department = await ctx.db
    .query("departments")
    .filter((q) =>
      q.and(
        q.eq(q.field("organisationId"), organisation._id),
        q.eq(q.field("slug"), slugs.departmentSlug),
      ),
    )
    .unique();
  return department;
}

// export async function getDepartmentEmployees(
// 	ctx: QueryCtx,
// 	departmentId: Id<'departments'>,
// ) {
// 	return (
// 		await asyncMap(
// 			await ctx.db
// 				.query('departmentEmployees')
// 				.filter((q) => q.eq(q.field('departmentId'), departmentId))
// 				.collect(),
// 			async (departmentEmployee) => {
// 				const user = await ctx.db.get(departmentEmployee.userId)
// 				return user ? { ...departmentEmployee, user } : null
// 			},
// 		)
// 	).filter((departmentEmployee) => departmentEmployee !== null)
// }
