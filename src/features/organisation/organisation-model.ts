import z from 'zod'

const organisationSchema = z.object({
  _id: z.string().cuid2(),
  name: z.string(),
  nameShort: z.string(),
  slug: z.string(),
})

export type Organisation = z.infer<typeof organisationSchema>

export const organisationInputSchema = organisationSchema.omit({ _id: true })

export type OrganisationInput = z.infer<typeof organisationInputSchema>
