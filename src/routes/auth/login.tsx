import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import z from "zod";
import { cn } from "~/lib/utils.ts";
import { db } from "~/utils/convex.server.ts";
import { useAppSession } from "~/utils/session.server.ts";

export const loginSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("password"),
    email: z.string().email(),
    password: z
      .string()
      // .min(6, "Password must be at least 6 characters long")
      .optional(),
  }),
  z.object({
    type: z.literal("email"),
    email: z.string().email(),
  }),
  z.object({
    type: z.literal("phone"),
    email: z.string().email(),
  }),
]);
type Mode = z.infer<typeof loginSchema>["type"];

export const loginFn = createServerFn({ method: "POST" })
  .validator((formData: FormData) => {
    return loginSchema.safeParse(Object.fromEntries(formData));
  })
  .handler(async ({ data }) => {
    if (data.error) {
      console.log("🚀 ~ result:", data.error.flatten());
      return { ...data };
    }
    const values = data.data;
    console.log("🚀 ~ values:", values);
    const user = await db.user.get_WITH_CREDENTIALS(values.email);

    if (!user) {
      return {
        error: true,
        userNotFound: true,
        message: "User not found",
      };
    }
    const { _id, firstName, lastName } = user;

    if (values.type === "password") {
      // Check if the password is correct
      // const hashedPassword = await hashPassword(data.password);
      // if (user.password !== hashedPassword) {
      //   return {
      //     error: true,
      //     message: "Incorrect password",
      //   };
      // }
      // Create a session
      // biome-ignore lint/correctness/useHookAtTopLevel: "first check if works..."
      const session = await useAppSession();

      // Store the user's email in the session
      await session.update({
        user: {
          _id,
          firstName,
          lastName,
        },
      });

      throw redirect({ to: "/" });
    }
  });

export const Route = createFileRoute("/auth/login")({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: "/" });
  },
  component: RouteComponent,
});

export function RouteComponent() {
  const [mode, setMode] = useState<Mode>("password");

  return (
    <div className="flex h-full items-center justify-center pb-12">
      <form
        action={loginFn.url}
        method="POST"
        className="flex w-96 flex-col gap-4 rounded-md border border-gray-300 p-8 shadow-md"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            id="email"
            type="email"
            className="rounded-sm border border-gray-300 px-2 py-1"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Section
            type="password"
            title="Wachtwoord & 2FA"
            className="border-emerald-700 bg-emerald-100/50"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="password">Wachtwoord:</label>
              <input
                name="password"
                id="password"
                type="password"
                className="rounded-sm border border-gray-300 px-2 py-1"
              />
            </div>
            <button
              type="submit"
              name="type"
              value="password"
              className="rounded-sm bg-blue-500 px-4 py-2 text-white"
            >
              Inloggen
            </button>
          </Section>
          <Section
            type="email"
            title="Email"
            className="border-fuchsia-700 bg-fuchsia-100/50"
          >
            <button
              type="submit"
              className="rounded-sm bg-blue-500 px-4 py-2 text-white"
            >
              Stuur Email met OTP
            </button>
          </Section>
          <Section
            type="phone"
            title="Scan QR-code"
            className="border-sky-700 bg-sky-100/50"
          >
            <label htmlFor="extra">Extra Informatie:</label>
            <input
              name="extra"
              id="extra"
              type="text"
              className="rounded-sm border border-gray-300 px-2 py-1"
            />
          </Section>
        </div>
      </form>
    </div>
  );

  function Section({
    children,
    className,
    title,
    type,
  }: {
    title: string;
    type: Mode;
  } & React.HTMLAttributes<HTMLDivElement>) {
    const isActive = mode === type;

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: "later..."
      // biome-ignore lint/a11y/useKeyWithClickEvents: "later..."
      <div
        onClick={() => setMode(type)}
        className={cn(
          "flex flex-col gap-4 rounded-md border-[3px] p-4 pt-2",
          { "h-12 overflow-hidden border-gray-200 bg-gray-100": !isActive },
          isActive ? className : null,
        )}
      >
        <div className="flex">
          <input
            type="radio"
            className="mr-2"
            checked={isActive}
            onChange={() => setMode(type)}
          />
          <h2 className="font-semibold text-lg">{title}</h2>
        </div>
        <div className="ml-5 flex flex-col gap-4">{children}</div>
      </div>
    );
  }
}
