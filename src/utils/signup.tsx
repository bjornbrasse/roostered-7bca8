import { parseWithZod } from "@conform-to/zod";
import * as E from "@react-email/components";
import { createServerFn } from "@tanstack/react-start";
import { data, Form, redirect, useSearchParams } from "react-router";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { z } from "zod";
import { GeneralErrorBoundary } from "#app/components/error-boundary.tsx";
import { ErrorList, Field } from "#app/components/forms.tsx";
import { StatusButton } from "#app/components/ui/status-button.tsx";
import { requireAnonymous } from "#app/utils/auth.server.ts";
import {
  ProviderConnectionForm,
  providerNames,
} from "#app/utils/connections.tsx";
import { prisma } from "#app/utils/db.server.ts";
import { db } from "~/utils/convex.server.ts";
import { sendEmail } from "~/utils/email.server.ts";
// import { sendEmail } from '#app/utils/email.server.ts'
import { prepareVerification } from "./verify.server.ts";

const EmailSchema = z
  .string({ required_error: "Email is required" })
  .email({ message: "Email is invalid" })
  .min(3, { message: "Email is too short" })
  .max(100, { message: "Email is too long" })
  // users can type the email in any case, but we store it in lowercase
  .transform((value) => value.toLowerCase());

const SignupSchema = z.object({
  email: EmailSchema,
});

export const signupServerFn = createServerFn({
  method: "POST",
})
  .validator((formData: FormData) => {
    const submission = parseWithZod(formData, {
      schema: z.object({ email: z.string().email() }),
    });
    if (submission.status !== "success") throw new Error("Invalid form data");
    return submission.value.email;
  })
  .handler(async ({ data: email }) => {
		const existingUser = await db.user.getByMail(data.email);
        if (existingUser) 22
        }
    const { verifyUrl, redirectTo, otp } = await prepareVerification({
      period: 10 * 60,
      request,
      type: "onboarding",
      target: data.email,
    });

    const response = await sendEmail({
      to: email,
      subject: `Welcome to Epic Notes!`,
      react: <SignupEmail onboardingUrl={verifyUrl.toString()} otp={otp} />,
    });

    if (response.status === "success") {
      return redirect(redirectTo.toString());
    } else {
      return data(
        {
          result: submission.reply({ formErrors: [response.error.message] }),
        },
        {
          status: 500,
        },
      );
    }
  });

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  await checkHoneypot(formData);
}

export function SignupEmail({
  onboardingUrl,
  otp,
}: {
  onboardingUrl: string;
  otp: string;
}) {
  return (
    <E.Html lang="en" dir="ltr">
      <E.Container>
        <h1>
          <E.Text>Welcome to Epic Notes!</E.Text>
        </h1>
        <p>
          <E.Text>
            Here's your verification code: <strong>{otp}</strong>
          </E.Text>
        </p>
        <p>
          <E.Text>Or click the link to get started:</E.Text>
        </p>
        <E.Link href={onboardingUrl}>{onboardingUrl}</E.Link>
      </E.Container>
    </E.Html>
  );
}

export const meta: Route.MetaFunction = () => {
  return [{ title: "Sign Up | Epic Notes" }];
};

export default function SignupRoute({ actionData }: Route.ComponentProps) {
  const isPending = useIsPending();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const [form, fields] = useForm({
    id: "signup-form",
    constraint: getZodConstraint(SignupSchema),
    lastResult: actionData?.result,
    onValidate({ formData }) {
      const result = parseWithZod(formData, { schema: SignupSchema });
      return result;
    },
    shouldRevalidate: "onBlur",
  });

  return (
    <div className="container flex flex-col justify-center pt-20 pb-32">
      <div className="text-center">
        <h1 className="text-h1">Let's start your journey!</h1>
        <p className="mt-3 text-body-md text-muted-foreground">
          Please enter your email.
        </p>
      </div>
      <div className="mx-auto mt-16 min-w-full max-w-sm sm:min-w-[368px]">
        <Form method="POST" {...getFormProps(form)}>
          <HoneypotInputs />
          <Field
            labelProps={{
              htmlFor: fields.email.id,
              children: "Email",
            }}
            inputProps={{
              ...getInputProps(fields.email, { type: "email" }),
              autoFocus: true,
              autoComplete: "email",
            }}
            errors={fields.email.errors}
          />
          <ErrorList errors={form.errors} id={form.errorId} />
          <StatusButton
            className="w-full"
            status={isPending ? "pending" : (form.status ?? "idle")}
            type="submit"
            disabled={isPending}
          >
            Submit
          </StatusButton>
        </Form>
        <ul className="flex flex-col gap-4 py-4">
          {providerNames.map((providerName) => (
            <>
              <hr />
              <li key={providerName}>
                <ProviderConnectionForm
                  type="Signup"
                  providerName={providerName}
                  redirectTo={redirectTo}
                />
              </li>
            </>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
