// src/services/session.server.ts

import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";

export type SessionData = {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  } | null;
};

export function useAppSession() {
  return useSession<SessionData>({
    password: "vT9#Lmq28Z@uXy1$Pe!rFbC5^GnHwK7d",
    name: "RIM_session",
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    },
  });
}

export const userSessionMiddleware = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const userSession = await useAppSession();
  return next({ context: { userSession } });
});

export const requireUserMiddleware = createMiddleware({
  type: "function",
})
  .middleware([userSessionMiddleware])
  .server(async ({ context, next }) => {
    const user = context.userSession.data?.user;
    if (!user?._id) {
      throw redirect({ to: "/auth/login" });
    }
    return next({ context: { user } });
  });

export const requireAnonymousMiddleware = createMiddleware({
  type: "function",
})
  .middleware([userSessionMiddleware])
  .server(async ({ context, next }) => {
    const user = context.userSession.data?.user;
    if (user?._id) {
      throw redirect({ to: "/" });
    }
    return next();
  });
