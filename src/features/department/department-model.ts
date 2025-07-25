import z from 'zod'

const departmentSchema = z.object({
  _id: z.string().cuid2(),
  name: z.string(),
  nameShort: z.string(),
  slug: z.string(),
})

export type Department = z.infer<typeof departmentSchema>

export const departmentInputSchema = departmentSchema.omit({ _id: true })

export type DepartmentInput = z.infer<typeof departmentInputSchema>