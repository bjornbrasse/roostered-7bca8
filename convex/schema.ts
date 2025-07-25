import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { assignmentObject } from './assignment.js'
import { organisationObject } from './organisation.js'
import { scheduleObject } from './schedule.js'
import { departmentObject } from './department.js'
import { taskObject } from './task.js'
import { sessionObject } from './session.js'

export default defineSchema({
	assignments: defineTable(assignmentObject).index('by_taskId', ['taskId']),
	departments: defineTable(departmentObject),
	organisations: defineTable(organisationObject),
	schedules: defineTable(scheduleObject),
	sessions: defineTable(sessionObject),
	tasks: defineTable(taskObject).index('by_departmentId', ['departmentId']),
	teams: defineTable({ name: v.string() }),
	team_members: defineTable({
		teamId: v.id('teams'),
		userId: v.id('users'),
	}),
	users: defineTable({
		firstName: v.string(),
		lastName: v.string(),
		email: v.string(),
	}).index('by_email', ['email']),
})
