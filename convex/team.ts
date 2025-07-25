import { ConvexError, v } from 'convex/values'
import { type Id } from './_generated/dataModel.js'
import { mutation, query } from './_generated/server'

export const get = query({
	args: { teamId: v.string() },
	handler: async (ctx, args) => {
		const team = await ctx.db.get(args.teamId as Id<'teams'>)
		if (!team) throw new ConvexError('Team not found')
		return team
	},
})

export const list = query({
	handler: async (ctx) => {
		return await ctx.db.query('teams').collect()
	},
})

export const create = mutation({
	args: { name: v.string() },
	handler: async (ctx, args) => {
		await ctx.db.insert('teams', { name: args.name })
	},
})

export const createMember = mutation({
	args: {
		teamId: v.string(),
		user: v.object({
			firstName: v.string(),
			lastName: v.string(),
			email: v.string(),
		}),
	},
	handler: async (ctx, args) => {
		let userId = (
			await ctx.db
				.query('users')
				.withIndex('byEmail', (q) => q)
				.unique()
		)?._id
		if (!userId) {
			userId = await ctx.db.insert('users', {
				firstName: args.user.firstName,
				lastName: args.user.lastName,
				email: args.user.email,
			})
		}
		if (!userId) throw new ConvexError('User creation failed')
		await ctx.db.insert('team_members', {
			teamId: args.teamId as Id<'teams'>,
			userId,
		})
	},
})
