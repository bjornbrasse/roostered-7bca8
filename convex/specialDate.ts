import { v } from "convex/values";
import { specialDateInputSchema } from "../src/features/specialDate/special-date-model.ts";
import type { Id } from "./_generated/dataModel";
import { zMutation } from "./utils.ts";

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
  updatedAt: v.optional(v.float64()),
};

export const create = zMutation({
  args: specialDateInputSchema,
  handler: async (
    ctx,
    { authorId, departmentId, organisationId, scheduleId, ...data },
  ) => {
    return await ctx.db.insert("specialDates", {
      ...data,
      authorId: authorId as Id<"users">,
      departmentId: departmentId as Id<"departments">,
      organisationId: organisationId as Id<"organisations">,
      scheduleId: scheduleId as Id<"schedules">,
    });
  },
});
