import z from "zod";

export const specialDateSchema = z.object({
  _id: z.string().cuid2(),
  _creationTime: z.date(),
  _updateTime: z.date(),

  authorId: z.string().cuid2(),
  departmentId: z.string().cuid2().optional(),
  description: z.string().optional(),
  end: z.date(),
  name: z.string(),
  organisationId: z.string().cuid2().optional(),
  scheduleId: z.string().cuid2().optional(),
  start: z.date(),
  styles: z
    .object({
      backgroundColor: z.string().optional(),
    })
    .optional(),
});

export type SpecialData = z.infer<typeof specialDateSchema>;

export const specialDateInputSchema = specialDateSchema.omit({
  _id: true,
  _creationTime: true,
  _updateTime: true,
});

export type SpecialDateInput = z.infer<typeof specialDateInputSchema>;
