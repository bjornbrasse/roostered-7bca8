import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// export const get = query({
// 	args: { userId: v.id('users') },
// 	handler: async (ctx, args) => {
// 		return await ctx.db.get(args.userId)
// 	},
// })

// export const list = query({
// 	handler: async (ctx) => {
// 		return await ctx.db.query('users').collect()
// 	},
// })

export const create = mutation({
	args: { firstName: v.string(), lastName: v.string(), email: v.string() },
	handler: async (ctx, args) => {
		await ctx.db.insert('users', args)
	},
})
