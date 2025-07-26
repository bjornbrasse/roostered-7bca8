import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/dialog.tsx";
import type { Department } from "~/features/department/department-model.ts";
import { userInputSchema } from "~/features/user/user-model.ts";

export function DepartmentEmployeeDialog({
  button,
  department,
}: {
  button?: React.ReactNode;
  department: Pick<Department, "_id">;
}) {
  const createDepartmentEmployee = useMutation(api.department.addEmployee);

  const schema = userInputSchema.omit({ organisationId: true });

  const [form, fields] = useForm({
    constraint: getZodConstraint(schema),
    defaultValue: {
      email: "",
      firstName: "",
      lastName: "",
    },
    onSubmit: async (e, { submission }) => {
      e.preventDefault();
      if (submission?.status !== "success") return;
      if (department) {
        return await createDepartmentEmployee({
          ...submission.value,
          departmentId: department._id,
        });
      }
      // if (organisation) {
      //   const member = await createMember({
      //     ...values,
      //     organisationId: organisation._id,
      //   });
      //   console.log("🚀 ~ MemberDialog ~ member:", member);
      // }
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: userInputSchema });
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent>
        <form {...getFormProps(form)}>
          <div className="flex flex-col gap-4">
            <label>
              Email:
              <input
                {...getInputProps(fields.email, { type: "email" })}
                className="w-full rounded border p-2"
              />
            </label>
            <label>
              Voornaam:
              <input
                {...getInputProps(fields.firstName, { type: "text" })}
                className="w-full rounded border p-2"
              />
            </label>
            <label>
              Achternaam:
              <input
                {...getInputProps(fields.lastName, { type: "text" })}
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
