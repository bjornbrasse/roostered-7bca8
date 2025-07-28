import z from "zod";

export const userSchema = z.object({
  _id: z.string().cuid2(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  organisationId: z.string().cuid2(),
});

export type user = z.infer<typeof userSchema>;

export const userInputSchema = userSchema.omit({ _id: true });

export type userInput = z.infer<typeof userInputSchema>;
