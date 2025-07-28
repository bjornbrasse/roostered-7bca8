import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ErrorList, Field } from "~/components/forms.tsx";
import { Button } from "~/components/ui/button.tsx";
import { StatusButton } from "~/components/ui/status-button.tsx";
import { useMutation } from "~/hooks/use-mutation.ts";
import { logoutServerFn } from "~/routes/auth/logout.tsx";
import { PasswordAndConfirmPasswordSchema } from "~/utils/user-validation.ts";

export const Route = createFileRoute("/settings/profile/password_/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const logoutMutation = useMutation({ fn: useServerFn(logoutServerFn) });

  const [form, fields] = useForm({
    id: "password-create-form",
    constraint: getZodConstraint(PasswordAndConfirmPasswordSchema),
    // lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: PasswordAndConfirmPasswordSchema,
      });
    },
    shouldRevalidate: "onBlur",
  });

  return (
    <form method="POST" {...getFormProps(form)} className="mx-auto max-w-md">
      <Field
        labelProps={{ children: "New Password" }}
        inputProps={{
          ...getInputProps(fields.password, { type: "password" }),
          autoComplete: "new-password",
        }}
        errors={fields.password.errors}
      />
      <Field
        labelProps={{ children: "Confirm New Password" }}
        inputProps={{
          ...getInputProps(fields.confirmPassword, {
            type: "password",
          }),
          autoComplete: "new-password",
        }}
        errors={fields.confirmPassword.errors}
      />
      <ErrorList id={form.errorId} errors={form.errors} />
      <div className="grid w-full grid-cols-2 gap-6">
        <Button variant="secondary" asChild>
          <Link to="..">Cancel</Link>
        </Button>
        <StatusButton
          type="submit"
          status={
            logoutMutation.status === "pending"
              ? "pending"
              : (logoutMutation.status ?? "idle")
          }
        >
          Create Password
        </StatusButton>
      </div>
    </form>
  );
}
