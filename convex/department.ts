import { ConvexError, v } from "convex/values";
import z from "zod";
import { userInputSchema } from "../src/features/user/user-model.ts";
import type { Id } from "./_generated/dataModel.js";
import {
  type MutationCtx,
  mutation,
  type QueryCtx,
  query,
} from "./_generated/server.js";
import { organisationGetById } from "./organisation.ts";
import { zMutation } from "./utils.js";

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

export const getById = query({
  args: { depId: v.string() },
  handler: async (ctx, args) => {
    const department = await ctx.db.get(args.depId as Id<"departments">);
    if (!department) throw new ConvexError("Department not found");
    return department;
  },
});

// export const findBySlugs = query({
//   args: { organisationSlug: v.string(), departmentSlug: v.string() },
//   handler: async (ctx, args) => {
//     const department = await getDepartmentBySlugs(ctx, args);
//     if (!department) throw new ConvexError("Department not found");
//     const schedules = await ctx.db
//       .query("schedules")
//       .filter((q) => q.eq(q.field("departmentId"), department._id))
//       .collect();

//     // const departmentEmployees = await getDepartmentEmployees(
//     // 	ctx,
//     // 	department._id,
//     // )

//     const tasks = await ctx.db
//       .query("tasks")
//       .filter((q) => q.eq(q.field("departmentId"), department._id))
//       .collect();

//     // return { ...department, departmentEmployees, schedules, tasks }
//     return { ...department, schedules, tasks };
//   },
// });

export const getEmployees = query({
  args: { departmentId: v.string() },
  handler: async (ctx, args) => {
    const department = await ctx.db.get(args.departmentId as Id<"departments">);
    if (!department) return [];
    const departmentEmployees = await ctx.db
      .query("departmentEmployees")
      .withIndex("by_departmentId")
      .filter((q) => q.eq(q.field("departmentId"), department._id))
      .collect();
    const employees = await Promise.all(
      departmentEmployees.map(async (departmentEmployee) => {
        return await ctx.db.get(departmentEmployee.userId);
      }),
    );
    return employees
      .filter((e): e is NonNullable<typeof e> => e !== null)
      .map((employee) => ({
        _id: employee._id,
        email: employee.email,
        firstName: employee.firstName,
        lastName: employee.lastName,
      }));
  },
});

export const getSchedules = query({
  args: { departmentId: v.string() },
  handler: async (ctx, args) => {
    const department = await ctx.db.get(args.departmentId as Id<"departments">);
    if (!department) throw new ConvexError("Department not found");
    return await ctx.db
      .query("schedules")
      .withIndex("by_departmentId")
      .filter((q) => q.eq(q.field("departmentId"), department._id))
      .collect();
  },
});

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

export const addEmployee = zMutation({
  args: userInputSchema.omit({ organisationId: true }).extend({
    departmentId: z.string().cuid2(),
  }),
  handler: async (ctx, args) => {
    const department = await ctx.db.get(args.departmentId as Id<"departments">);
    if (!department) throw new ConvexError("Department not found");

    // Add later: check if user with email already exists

    const userId = await ctx.db.insert("users", {
      ...args,
      organisationId: department.organisationId,
    });

    await ctx.db.insert("departmentEmployees", {
      userId: userId,
      departmentId: department._id,
    });
  },
});

// HELPERS

export async function departmentGetBySlug(
  ctx: QueryCtx | MutationCtx,
  args: { slug: string; organisationId: string },
) {
  const organisation = await organisationGetById(ctx, args);
  if (!organisation) throw new ConvexError("Organisation not found");
  return await ctx.db
    .query("departments")
    .filter((q) =>
      q.and(
        q.eq(q.field("organisationId"), organisation._id),
        q.eq(q.field("slug"), args.slug),
      ),
    )
    .unique();
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
