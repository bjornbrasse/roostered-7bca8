import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { Field } from "~/components/forms.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/dialog.tsx";
import { organisationInputSchema } from "../organisation-model.ts";

export function OrganisationDialog({ button }: { button: React.ReactNode }) {
  const _createOrganisation = useMutation(api.organisation.create);
  const _navigate = useNavigate();

  const [form, fields] = useForm({
    id: "organisation-form",
    constraint: getZodConstraint(organisationInputSchema),
    onSubmit: (e, { submission }) => {
      e.preventDefault();
      if (submission?.status !== "success") return;
      console.log("Gaat goed?", submission.value);
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: organisationInputSchema });
    },
    shouldValidate: "onBlur",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent>
        <form {...getFormProps(form)}>
          <Field
            labelProps={{ children: "New Password" }}
            inputProps={{
              ...getInputProps(fields.password, { type: "password" }),
              autoComplete: "new-password",
            }}
            errors={fields.password.errors}
          />
          <Field
            labelProps={{ children: "Korte naam" }}
            inputProps={{
              ...getInputProps(fields.nameShort, { type: "text" }),
              autoComplete: "new-password",
            }}
            errors={fields.nameShort.errors}
          />
          <Field
            labelProps={{ children: "Slug" }}
            inputProps={{
              ...getInputProps(fields.slug, { type: "text" }),
              autoComplete: "new-password",
            }}
            errors={fields.slug.errors}
          />

          <button>Opslaan</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
