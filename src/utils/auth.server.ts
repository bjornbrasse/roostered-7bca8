import crypto from "node:crypto";
import { request } from "node:http";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { db } from "~/utils/convex.server.ts";
import {
  requireUserMiddleware,
  userSessionMiddleware,
} from "~/utils/session.server.ts";
import { PasswordAndConfirmPasswordSchema } from "~/utils/user-validation.ts";
// import { providers } from "./connections.server.ts";
// import { type ProviderUser } from './providers/provider.ts'

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30;
export const getSessionExpirationDate = () =>
  new Date(Date.now() + SESSION_EXPIRATION_TIME);

export const sessionKey = "sessionId";

// export const authenticator = new Authenticator<ProviderUser>();

// for (const [providerName, provider] of Object.entries(providers)) {
//   const strategy = provider.getAuthStrategy();
//   if (strategy) {
//     authenticator.use(strategy, providerName);
//   }
// }

export const requireUserWithoutPasswordMiddleware = createMiddleware({
  type: "function",
})
  .middleware([requireUserMiddleware])
  .server(async ({ context, next }) => {
    const hasPassword = await db.user.password.has(context.user._id);
    if (hasPassword) {
      throw redirect({ to: "/settings/profile/password" });
    }
    return next();
  });

export const createPasswordServerFn = createServerFn({
  method: "POST",
})
  .validator((formData: FormData) => {
    const res = parseWithZod(formData, {
      schema: PasswordAndConfirmPasswordSchema,
    });
    if (res.status !== "success") {
      throw new Error("Invalid form data");
    }
    return res.value;
  })
  .middleware([requireUserWithoutPasswordMiddleware])
  .handler(async ({ context, data }) => {
    // const isCommonPassword = await checkIsCommonPassword(password);
    // if (isCommonPassword) {
    //   throw new Error(
    //     "This password is too common. Please choose a different one.",
    //   );
    // }

    await db.user.password.create({
      userId: context.user._id,
      passwordHash: await hashPassword(data.password),
    });

    throw redirect({ to: "/settings/profile", statusCode: 302 });
  });

export function hashPassword(password: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(password, "salt", 100000, 64, "sha256", (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(derivedKey.toString("hex"));
      }
    });
  });
}

// export async function resetUserPassword({
//   username,
//   password,
// }: {
//   username: User["username"];
//   password: string;
// }) {
//   const hashedPassword = await getPasswordHash(password);
//   return prisma.user.update({
//     where: { username },
//     data: {
//       password: {
//         update: {
//           hash: hashedPassword,
//         },
//       },
//     },
//   });
// }

// export async function signup({
//   email,
//   username,
//   password,
//   name,
// }: {
//   email: User["email"];
//   username: User["username"];
//   name: User["name"];
//   password: string;
// }) {
//   const hashedPassword = await getPasswordHash(password);

//   const session = await prisma.session.create({
//     data: {
//       expirationDate: getSessionExpirationDate(),
//       user: {
//         create: {
//           email: email.toLowerCase(),
//           username: username.toLowerCase(),
//           name,
//           roles: { connect: { name: "user" } },
//           password: {
//             create: {
//               hash: hashedPassword,
//             },
//           },
//         },
//       },
//     },
//     select: { id: true, expirationDate: true },
//   });

//   return session;
// }

// export async function signupWithConnection({
//   email,
//   username,
//   name,
//   providerId,
//   providerName,
//   imageUrl,
// }: {
//   email: User["email"];
//   username: User["username"];
//   name: User["name"];
//   providerId: Connection["providerId"];
//   providerName: Connection["providerName"];
//   imageUrl?: string;
// }) {
//   const user = await prisma.user.create({
//     data: {
//       email: email.toLowerCase(),
//       username: username.toLowerCase(),
//       name,
//       roles: { connect: { name: "user" } },
//       connections: { create: { providerId, providerName } },
//     },
//     select: { id: true },
//   });

//   if (imageUrl) {
//     const imageFile = await downloadFile(imageUrl);
//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         image: {
//           create: {
//             objectKey: await uploadProfileImage(user.id, imageFile),
//           },
//         },
//       },
//     });
//   }

//   // Create and return the session
//   const session = await prisma.session.create({
//     data: {
//       expirationDate: getSessionExpirationDate(),
//       userId: user.id,
//     },
//     select: { id: true, expirationDate: true },
//   });

//   return session;
// }

// export async function logout(
//   {
//     request,
//     redirectTo = "/",
//   }: {
//     request: Request;
//     redirectTo?: string;
//   },
//   responseInit?: ResponseInit,
// ) {
//   const authSession = await authSessionStorage.getSession(
//     request.headers.get("cookie"),
//   );
//   const sessionId = authSession.get(sessionKey);
//   // if this fails, we still need to delete the session from the user's browser
//   // and it doesn't do any harm staying in the db anyway.
//   if (sessionId) {
//     // the .catch is important because that's what triggers the query.
//     // learn more about PrismaPromise: https://www.prisma.io/docs/orm/reference/prisma-client-reference#prismapromise-behavior
//     void prisma.session
//       .deleteMany({ where: { id: sessionId } })
//       .catch(() => {});
//   }
//   throw redirect(safeRedirect(redirectTo), {
//     ...responseInit,
//     headers: combineHeaders(
//       { "set-cookie": await authSessionStorage.destroySession(authSession) },
//       responseInit?.headers,
//     ),
//   });
// }

// export async function verifyUserPassword(
//   where: Pick<User, "username"> | Pick<User, "id">,
//   password: Password["hash"],
// ) {
//   const userWithPassword = await prisma.user.findUnique({
//     where,
//     select: { id: true, password: { select: { hash: true } } },
//   });

//   if (!userWithPassword || !userWithPassword.password) {
//     return null;
//   }

//   const isValid = await bcrypt.compare(
//     password,
//     userWithPassword.password.hash,
//   );

//   if (!isValid) {
//     return null;
//   }

//   return { id: userWithPassword.id };
// }

export function getPasswordHashParts(password: string) {
  const hash = crypto
    .createHash("sha1")
    .update(password, "utf8")
    .digest("hex")
    .toUpperCase();
  return [hash.slice(0, 5), hash.slice(5)] as const;
}

// export async function checkIsCommonPassword(password: string) {
//   const [prefix, suffix] = getPasswordHashParts(password);

//   try {
//     const response = await fetch(
//       `https://api.pwnedpasswords.com/range/${prefix}`,
//       { signal: AbortSignal.timeout(1000) },
//     );

//     if (!response.ok) return false;

//     const data = await response.text();
//     return data.split(/\r?\n/).some((line) => {
//       const [hashSuffix, ignoredPrevalenceCount] = line.split(":");
//       return hashSuffix === suffix;
//     });
//   } catch (error) {
//     if (error instanceof DOMException && error.name === "TimeoutError") {
//       console.warn("Password check timed out");
//       return false;
//     }

//     console.warn("Unknown error during password check", error);
//     return false;
//   }
// }
