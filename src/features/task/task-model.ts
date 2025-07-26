import z from "zod";

const taskSchema = z.object({
  _id: z.string().cuid2(),
  name: z.string(),
  nameShort: z.string(),
  description: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

export const taskInputSchema = taskSchema.omit({ _id: true });

export type TaskInput = z.infer<typeof taskInputSchema>;
