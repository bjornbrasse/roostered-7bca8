import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel.js";
import {
  type MutationCtx,
  mutation,
  type QueryCtx,
  query,
} from "./_generated/server.js";
import { departmentGetBySlug } from "./department.js";
import { organisationGetBySlug } from "./organisation.js";
// import { getDepartmentBySlugs } from "./department.js";
// import { getOrganisationBySlug } from "./organisation.js";

export const scheduleObject = {
  departmentId: v.id("departments"),
  name: v.string(),
  slug: v.optional(v.string()),
};

export const scheduleSlugs = {
  organisationSlug: v.string(),
  departmentSlug: v.string(),
  scheduleSlug: v.string(),
};

// QUERIES

export const get = query({
  args: scheduleSlugs,
  handler: async (ctx, args) => {
    return await scheduleGetBySlugs(ctx, args);
  },
});

export const listSchedulesByDepartmentId = query({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    const schedules = await ctx.db
      .query("schedules")
      .filter((q) => q.eq(q.field("departmentId"), args.departmentId))
      .collect();
    return schedules;
  },
});

export const listTasks = query({
  args: { scheduleId: v.string() },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_scheduleId", (q) =>
        q.eq("scheduleId", args.scheduleId as Id<"schedules">),
      )
      .collect();
    return tasks;
  },
});

export const findFirst = query({
  args: scheduleSlugs,
  handler: async (ctx, args) => {
    const schedule = await scheduleGetBySlugs(ctx, args);
    if (!schedule) return null;

    const department = await ctx.db.get(schedule.departmentId);
    // const scheduleTasks = await getScheduleTasks(ctx, schedule._id)
    // const scheduleMembers = await getScheduleMembers(
    // 	ctx,
    // 	schedule._id,
    // 	scheduleTasks,
    // )

    // const locks = await ctx.db
    // 	.query('scheduleLocks')
    // 	.withIndex('by_scheduleId', (q) => q.eq('scheduleId', schedule._id))
    // 	.collect()

    return {
      ...schedule,
      // locks,
      // scheduleMembers,
      // scheduleTasks,
      department,
    };
  },
});

// MUTATIONS

export const create = mutation({
  args: scheduleObject,
  handler: async ({ db }, args) => {
    return db.insert("schedules", args);
  },
});

// HELPERS

export async function scheduleGetBySlugs(
  ctx: QueryCtx | MutationCtx,
  args: {
    organisationSlug: string;
    departmentSlug: string;
    scheduleSlug: string;
  },
) {
  const organisation = await organisationGetBySlug(ctx, {
    slug: args.organisationSlug,
  });
  if (!organisation) return null;
  const department = await departmentGetBySlug(ctx, {
    slug: args.departmentSlug,
    organisationId: organisation._id,
  });
  if (!department) return null;
  return await ctx.db
    .query("schedules")
    .withIndex("by_slug_and_departmentId", (q) =>
      q.eq("slug", args.scheduleSlug).eq("departmentId", department._id),
    )
    .first();
}

// export async function getScheduleMembers(
// 	ctx: QueryCtx,
// 	scheduleId: Id<'schedules'>,
// 	scheduleTasks: Array<{ task: { _id: Id<'tasks'> } }>,
// ) {
// 	return (
// 		await asyncMap(
// 			await ctx.db
// 				.query('scheduleMembers')
// 				.withIndex('by_scheduleId', (q) => q.eq('scheduleId', scheduleId))
// 				.collect(),
// 			async (scheduleMember) => {
// 				if (!scheduleMember) return null
// 				const user = await ctx.db.get(scheduleMember.userId)
// 				const competences = (
// 					await ctx.db
// 						.query('competences')
// 						.withIndex('by_userId', (q) =>
// 							q.eq('userId', scheduleMember.userId),
// 						)
// 						.collect()
// 				).filter((competence) =>
// 					scheduleTasks.some(
// 						(scheduleTask) => scheduleTask.task._id === competence.taskId,
// 					),
// 				)

// 				return user
// 					? { ...scheduleMember, user: { ...user, competences } }
// 					: null
// 			},
// 		)
// 	).filter((scheduleEmployee) => scheduleEmployee !== null)
// }

// export async function getScheduleTasks(
// 	ctx: QueryCtx,
// 	scheduleId: Id<'schedules'>,
// ) {
// 	return (
// 		await asyncMap(
// 			await ctx.db
// 				.query('scheduleTasks')
// 				.withIndex('by_scheduleId', (q) => q.eq('scheduleId', scheduleId))
// 				.collect(),
// 			async (scheduleTask) => {
// 				if (!scheduleTask) return null
// 				const task = await ctx.db.get(scheduleTask.taskId)

// 				return task ? { ...scheduleTask, task } : null
// 			},
// 		)
// 	).filter((scheduleTask) => scheduleTask !== null)
// }
