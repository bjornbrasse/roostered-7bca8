import { v } from "convex/values";
import type { Id } from "./_generated/dataModel.js";
import { mutation, type QueryCtx, query } from "./_generated/server.js";

const createTaskInput = {
  // daysOfTheWeek: v.optional(v.string()), // "0111110"
  departmentId: v.id("departments"),
  description: v.optional(v.string()),
  // hoursPerDay: v.optional(v.number()),
  name: v.string(),
  nameShort: v.string(),
  styles: v.optional(
    v.object({
      backgroundColor: v.optional(v.string()),
    }),
  ),
};

export const taskObject = {
  ...createTaskInput,
  scheduleId: v.optional(v.id("schedules")),
  authorId: v.optional(v.string()),
  updatedAt: v.optional(v.float64()),
};

export const departmentTasks = query({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    return await getDepartmentTasks(ctx, args.departmentId);
  },
});

// export const getDepartmentTasksNotInSchedule = query({
//   args: {
//     organisationSlug: v.string(),
//     departmentSlug: v.string(),
//     scheduleSlug: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const departmentTasks = getDepartmentTasks(ctx, {
//     return await ctx.db
//       .query('tasks')
//       .withIndex('by_departmentId', (q) =>
//         q.eq('departmentId', args.departmentId)
//       )
//       .collect();
//   },
// });

// export const getScheduleTasks = query({
// 	args: {
// 		organisationSlug: v.string(),
// 		departmentSlug: v.string(),
// 		scheduleSlug: v.string(),
// 	},
// 	handler: async (ctx, args) => {
// 		const schedule = await getScheduleBySlugs(ctx, args)
// 		if (!schedule) throw new ConvexError('Schedule not found')
// 		return await ctx.db
// 			.query('scheduleTasks')
// 			.withIndex('by_scheduleId', (q) => q.eq('scheduleId', schedule._id))
// 			.collect()
// 	},
// })

// MUTATIONS

export const create = mutation({
  args: { ...createTaskInput, scheduleId: v.optional(v.id("schedules")) },
  handler: async (ctx, args) => {
    return ctx.db.insert("tasks", {
      ...args,
      authorId: "k573cfjyxs8a7g7skx75dnzfj976f8zm",
      updatedAt: new Date().getTime(),
    });
  },
});

// HELPERS

function getDepartmentTasks(ctx: QueryCtx, departmentId: Id<"departments">) {
  return ctx.db
    .query("tasks")
    .withIndex("by_departmentId", (q) => q.eq("departmentId", departmentId))
    .collect();
}
