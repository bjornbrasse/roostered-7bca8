import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const convex = new ConvexHttpClient("https://handsome-oriole-237.convex.cloud");

export const db = {
  user: {
    getByMail: (email: string) => convex.query(api.user.getByEmail, { email }),
    get_WITH_CREDENTIALS: (email: string) =>
      convex.query(api.user.get_WITH_CREDENTIALS, { email }),
    password: {
      create: (data: { passwordHash: string; userId: string }) =>
        convex.mutation(api.user.createPassword, data),
      has: (_id: string) => convex.query(api.user.hasPassword, { _id }),
    },
  },
};
