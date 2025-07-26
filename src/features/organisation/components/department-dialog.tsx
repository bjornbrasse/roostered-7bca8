import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useConvexMutation } from "@convex-dev/react-query";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import type React from "react";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/dialog.tsx";
import type { Organisation } from "~/features/organisation/organisation-model";

export function DepartmentDialog({
  button,
  organisation,
}: {
  button: React.ReactNode;
  organisation: Pick<Organisation, "_id">;
}) {
  const { mutate } = useMutation({
    mutationFn: useConvexMutation(api.department.create),
    mutationKey: ["organisation"],
  });

  const [form, fields] = useForm({
    constraint: getZodConstraint(
      z.object({
        name: z.string().min(1, "Naam is verplicht"),
        slug: z.string().min(1, "Slug is verplicht"),
      }),
    ),
    defaultValue: { name: "", slug: "" },
    onSubmit(e, { submission }) {
      e.preventDefault();
      console.log("🚀 ~ DepartmentDialog ~ submission: FAIL?", submission);
      if (!submission || submission.status !== "success") return;
      console.log("🚀 ~ DepartmentDialog ~ submission:", submission.value);
      mutate({
        ...submission.value,
        organisationId: organisation._id,
      });
      form.reset();
    },
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: z.object({
          name: z.string().min(1, "Naam is verplicht"),
          slug: z.string().min(1, "Slug is verplicht"),
        }),
      });
      console.log("🚀 ~ onValidate ~ submission:", submission);
      return submission;
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Maak nieuwe afdeling</DialogTitle>
        <form {...getFormProps(form)}>
          <div className="flex flex-col gap-4">
            <label>
              Naam:
              <input
                {...getInputProps(fields.name, { type: "text" })}
                aria-describedby="name-error"
                className="w-full rounded border p-2"
              />
            </label>
            <label>
              Slug:
              <input
                {...getInputProps(fields.slug, { type: "text" })}
                aria-describedby="slug-error"
                className="w-full rounded border p-2"
              />
            </label>
          </div>
          <button type="submit" className="btn btn-primary mt-4">
            Opslaan
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
