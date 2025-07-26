import { v } from "convex/values";

export const specialDateObject = {
  authorId: v.id("users"),
  departmentId: v.optional(v.id("departments")),
  description: v.optional(v.string()),
  end: v.float64(),
  name: v.string(),
  organisationId: v.optional(v.id("organisations")),
  scheduleId: v.optional(v.id("schedules")),
  start: v.float64(),
  styles: v.optional(
    v.object({
      backgroundColor: v.optional(v.string()),
    }),
  ),
  updatedAt: v.float64(),
};
