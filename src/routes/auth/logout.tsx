import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "~/utils/session.server.ts";

export const Route = createFileRoute("/auth/logout")({
  preload: false,
  loader: () => logoutServerFn(),
});

export const logoutServerFn = createServerFn().handler(async () => {
  const session = await useAppSession();

  session.clear();

  throw redirect({
    href: "/",
  });
});
