import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useConvexMutation } from "@convex-dev/react-query";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import type z from "zod";
import { Field } from "~/components/forms.tsx";
import { Dialog, DialogContent } from "~/components/ui/dialog.tsx";
import { Label } from "~/components/ui/label.tsx";
import { Textarea } from "~/components/ui/textarea.tsx";
import { specialDateInputSchema } from "~/features/specialDate/special-date-model.ts";

export function SpecialDateDialog({
  departmentId,
  ...props
}: { departmentId?: string } & DialogProps) {
  const { mutate } = useMutation({
    mutationFn: useConvexMutation(api.specialDate.create),
  });

  const schema = specialDateInputSchema.omit({ authorId: true });

  const [form, fields] = useForm<z.infer<typeof schema>>({
    id: "special-date-form",
    constraint: getZodConstraint(schema),
    onSubmit: async (e, { submission }) => {
      e.preventDefault();
      if (submission?.status !== "success") return;
      console.log(`🚀 ~ SpecialDateDialog ~ submission:`, submission.value);
      // await mutate({ authorId: "123", ...submission.value, departmentId });
    },
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: specialDateInputSchema,
      });
    },
    shouldValidate: "onSubmit",
  });

  return (
    <Dialog {...props}>
      <DialogContent>
        <form {...getFormProps(form)}>
          <Field
            inputProps={{ ...getInputProps(fields.name, { type: "text" }) }}
            labelProps={{ children: "Naam" }}
            errors={fields.name.errors}
          />
          <Field
            inputProps={{ ...getInputProps(fields.start, { type: "date" }) }}
            labelProps={{ children: "Startdatum" }}
            errors={fields.start.errors}
          />
          <Field
            inputProps={{ ...getInputProps(fields.end, { type: "date" }) }}
            labelProps={{ children: "Einddatum" }}
            errors={fields.end.errors}
          />
          <Label htmlFor={fields.description.id}>Beschrijving</Label>
          <Textarea {...getTextareaProps(fields.description)} />
          <button type="button">Opslaan</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
