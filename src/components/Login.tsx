import { createServerFn } from "@tanstack/react-start";
import { db } from "~/utils/convex.server.ts";
// import { signupFn } from "~/routes/signup";

export const loginFn = createServerFn({ method: "POST" })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    // const user = await db.user.getByMail(data.email);
    // console.log("🚀 ~ user:", user);
    return;

    // Check if the user exists
    if (!user) {
      return {
        error: true,
        userNotFound: true,
        message: "User not found",
      };
    }

    // Check if the password is correct
    // const hashedPassword = await hashPassword(data.password);

    // if (user.password !== hashedPassword) {
    //   return {
    //     error: true,
    //     message: "Incorrect password",
    //   };
    // }

    // Create a session
    // const session = await useAppSession();

    // Store the user's email in the session
    // await session.update({
    //   userEmail: user.email,
    // });
  });
