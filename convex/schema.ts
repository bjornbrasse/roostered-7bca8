import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { assignmentObject } from "./assignment.js";
import { departmentObject } from "./department.js";
import { organisationObject } from "./organisation.js";
import { scheduleObject } from "./schedule.js";
import { sessionObject } from "./session.js";
import { specialDateObject } from "./specialDate.js";
import { taskObject } from "./task.js";
import { userObject } from "./user.js";

export default defineSchema({
  assignments: defineTable(assignmentObject).index("by_taskId", ["taskId"]),
  departments: defineTable(departmentObject).index("by_organisationId", [
    "organisationId",
  ]),
  departmentEmployees: defineTable({
    userId: v.id("users"),
    departmentId: v.id("departments"),
  }).index("by_departmentId", ["departmentId"]),
  organisations: defineTable(organisationObject).index("by_slug", ["slug"]),
  schedules: defineTable(scheduleObject)
    .index("by_slug_and_departmentId", ["slug", "departmentId"])
    .index("by_departmentId", ["departmentId"]),
  sessions: defineTable(sessionObject),
  specialDates: defineTable(specialDateObject),
  tasks: defineTable(taskObject)
    .index("by_departmentId", ["departmentId"])
    .index("by_scheduleId", ["scheduleId"]),
  teams: defineTable({ name: v.string() }),
  team_members: defineTable({
    teamId: v.id("teams"),
    userId: v.id("users"),
  }),
  users: defineTable(userObject).index("by_email", ["email"]),
});
