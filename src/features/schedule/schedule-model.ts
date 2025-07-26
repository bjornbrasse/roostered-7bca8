import z from "zod";

const scheduleSchema = z.object({
  _id: z.string().cuid2(),
  departmentId: z.string().cuid2(),
  name: z.string(),
  slug: z.string(),
});

export type Schedule = z.infer<typeof scheduleSchema>;

export const scheduleInputSchema = scheduleSchema.omit({ _id: true });

export type ScheduleInput = z.infer<typeof scheduleInputSchema>;
