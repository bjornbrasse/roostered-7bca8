import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import type { Department } from "~/features/department/department-model.ts";

export function ListEmployees({
  department,
}: {
  department: Pick<Department, "_id">;
}) {
  const { data: employees } = useQuery(
    convexQuery(api.department.getEmployees, { departmentId: department._id }),
  );

  return (
    <>
      {employees && (
        <ul>
          {employees.map((employee) => (
            <li key={employee._id}>{employee.email}</li>
          ))}
        </ul>
      )}
    </>
  );
}
