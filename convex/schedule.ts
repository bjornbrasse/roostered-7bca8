import type { Id } from './_generated/dataModel.js'
import {
	mutation,
	query,
	type MutationCtx,
	type QueryCtx,
} from './_generated/server.js'
import { getDepartmentBySlugs } from './department.js'
import { getOrganisationBySlug } from './organisation.js'
import { ConvexError, v } from 'convex/values'
import { asyncMap } from '#app/lib/utils.js'

export const scheduleObject = {
	departmentId: v.id('departments'),
	name: v.string(),
	slug: v.optional(v.string()),
}

export const scheduleSlugs = {
	organisationSlug: v.string(),
	departmentSlug: v.string(),
	scheduleSlug: v.string(),
}

// QUERIES

export const get = query({
	args: {
		organisationSlug: v.string(),
		departmentSlug: v.string(),
		scheduleSlug: v.string(),
	},
	handler: async (ctx, args) => {
		const department = await getDepartmentBySlugs(ctx, {
			organisationSlug: args.organisationSlug,
			departmentSlug: args.departmentSlug,
		})
		if (!department) throw new ConvexError('Department not found!')
		return await ctx.db
			.query('schedules')
			.filter((q) =>
				q.and(
					q.eq(q.field('slug'), args.scheduleSlug),
					q.eq(q.field('departmentId'), department._id),
				),
			)
			.first()
	},
})

export const listSchedulesByDepartmentId = query({
	args: { departmentId: v.id('departments') },
	handler: async (ctx, args) => {
		const schedules = await ctx.db
			.query('schedules')
			.filter((q) => q.eq(q.field('departmentId'), args.departmentId))
			.collect()
		return schedules
	},
})

export const findFirst = query({
	args: scheduleSlugs,
	handler: async (ctx, args) => {
		const department = await getDepartmentBySlugs(ctx, { ...args })
		if (!department) throw new ConvexError('Department not found')
		const schedule = await ctx.db
			.query('schedules')
			.filter((q) =>
				q.and(
					q.eq(q.field('slug'), args.scheduleSlug),
					q.eq(q.field('departmentId'), department._id),
				),
			)
			.first()
		if (!schedule) throw new ConvexError('Schedule not found')

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
		}
	},
})

// MUTATIONS

export const create = mutation({
	args: scheduleObject,
	handler: async ({ db }, args) => {
		return db.insert('schedules', args)
	},
})

// HELPERS

export async function getScheduleBySlugs(
	ctx: QueryCtx | MutationCtx,
	args: {
		organisationSlug: string
		departmentSlug: string
		scheduleSlug: string
	},
) {
	const organisation = await getOrganisationBySlug(ctx, args.organisationSlug)
	if (!organisation) return null
	const department = await getDepartmentBySlugs(ctx, args)
	if (!department) return null
	return await ctx.db
		.query('schedules')
		.filter((q) =>
			q.and(
				q.eq(q.field('slug'), args.scheduleSlug),
				q.eq(q.field('departmentId'), department._id),
			),
		)
		.first()
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
