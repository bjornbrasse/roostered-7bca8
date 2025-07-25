import { v } from 'convex/values'
import { asyncMap } from '~/lib/utils.js'
import { query } from './_generated/server.js'

export const assignmentObject = {
	authorId: v.id('users'),
	deletedAt: v.float64(),
	deletedBy: v.id('users'),
	date: v.float64(),
	supervisors: v.optional(v.array(v.object({ userId: v.id('users') }))),
	taskId: v.id('tasks'),
	updatedAt: v.float64(),
	updateHistory: v.optional(
		v.array(
			v.object({
				date: v.float64(),
				userId: v.id('users'),
				update: v.string(),
			}),
		),
	),
	userId: v.id('users'),
}

export const get = query({
	args: {
		start: v.float64(),
		end: v.float64(),
		taskIds: v.array(v.id('tasks')),
	},
	handler: async (ctx, { start, end, taskIds }) => {
		const assignments = await asyncMap(taskIds, async (taskId) => {
			return await ctx.db
				.query('assignments')
				.withIndex('by_taskId', (q) => q.eq('taskId', taskId))
				.filter((q) =>
					q.and(q.gte(q.field('date'), start), q.lte(q.field('date'), end)),
				)
				.collect()
		})
		return assignments.flat()
	},
})
