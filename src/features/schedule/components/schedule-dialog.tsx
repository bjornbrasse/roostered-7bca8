import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint } from "@conform-to/zod";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/dialog.tsx";
import type { Department } from "~/features/department/department-model.ts";
import { scheduleInputSchema } from "~/features/schedule/schedule-model";

export function ScheduleDialog({
  button,
  department,
}: {
  button: React.ReactNode;
  department: Pick<Department, "_id">;
}) {
  const createSchedule = useMutation(api.schedule.create);

  const [form, fields] = useForm({
    constraint: getZodConstraint(
      scheduleInputSchema.omit({
        departmentId: true,
      }),
    ),
    defaultValue: {
      name: "",
      slug: "",
    },
    onSubmit: async (e, { submission }) => {
      e.preventDefault();
      if (submission?.status !== "success") return;
      await createSchedule({
        ...submission.value,
        departmentId: department._id as Id<"departments">,
      });
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent>
        <form {...getFormProps(form)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <label>
              Naam:
              <input
                {...getInputProps(fields.name, { type: "text" })}
                className="w-full rounded border p-2"
              />
            </label>
            <label>
              Slug:
              <input
                {...getInputProps(fields.slug, { type: "text" })}
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
