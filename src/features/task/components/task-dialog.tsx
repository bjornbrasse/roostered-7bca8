import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint } from "@conform-to/zod";
import type * as DialogPrimitive from "@radix-ui/react-dialog";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/dialog.tsx";
import type { Department } from "~/features/department/department-model.ts";
import type { Schedule } from "~/features/schedule/schedule-model.ts";
import { taskInputSchema } from "~/features/task/task-model.ts";

export function TaskDialog({
  button,
  department,
  onSaved,
  schedule,
  ...props
}: {
  department: Pick<Department, "_id">;
  schedule?: Pick<Schedule, "_id">;
} & (
  | ({
      button: React.ReactNode;
      onSaved?: never;
    } & React.ComponentProps<typeof DialogPrimitive.Root>)
  | ({
      button?: never;
      onSaved: () => void;
    } & React.ComponentProps<typeof DialogPrimitive.Root>)
)) {
  const createTask = useMutation(api.task.create);
  const [open, setOpen] = useState(props.open);

  const [form, fields] = useForm({
    id: "task-form",
    constraint: getZodConstraint(taskInputSchema),
    defaultValue: {
      description: "",
      nameShort: "",
      name: "",
    },
    onSubmit: async (_e, { submission }) => {
      if (submission?.status !== "success") return;
      await createTask({
        ...submission.value,
        departmentId: department._id as Id<"departments">,
        scheduleId: schedule?._id as Id<"schedules">,
      });
      form.reset();
      onSaved?.();
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent>
        <form {...getFormProps(form)}>
          <div className="flex flex-col gap-4">
            <label>
              Naam:
              <input
                {...getInputProps(fields.name, { type: "text" })}
                className="w-full rounded border p-2"
              />
            </label>
            <label>
              Korte naam:
              <input
                {...getInputProps(fields.nameShort, { type: "text" })}
                className="w-full rounded border p-2"
              />
            </label>
            <label>
              Omschrijving:
              <textarea
                {...getTextareaProps(fields.description)}
                className="w-full rounded border p-2"
              />
            </label>
          </div>
          <button type="submit" className="btn btn-primary mt-4">
            Save
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
