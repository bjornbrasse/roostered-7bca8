import { v } from "convex/values";
import type { Id } from "./_generated/dataModel.js";
import { mutation, type QueryCtx, query } from "./_generated/server.js";

export const sessionCreateArgs = {
  expirationDate: v.float64(),
  userId: v.id("users"),
};

export const sessionObject = {
  ...sessionCreateArgs,
  updatedAt: v.float64(),
};

// MUTATIONS

export const create = mutation({
  args: sessionCreateArgs,
  handler: async (ctx, args) => {
    return ctx.db.insert("sessions", {
      ...args,
      updatedAt: new Date().getTime(),
    });
  },
});

// HELPERS

function _getDepartmentTasks(ctx: QueryCtx, departmentId: Id<"departments">) {
  return ctx.db
    .query("tasks")
    .withIndex("by_departmentId", (q) => q.eq("departmentId", departmentId))
    .collect();
}
