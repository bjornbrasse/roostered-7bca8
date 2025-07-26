import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Suspense } from "react";

export const Route = createFileRoute("/department_/$depId/employees")({
  component: RouteComponent,
  loader: async (opts) => {
    const employees = opts.context.queryClient.prefetchQuery(
      convexQuery(api.department.getEmployees, {
        departmentId: opts.params.depId,
      }),
    );
    return { employees };
  },
});

function RouteComponent() {
  const { data: employees } = useSuspenseQuery(
    convexQuery(api.department.getEmployees, {
      departmentId: Route.useParams().depId,
    }),
  );

  return (
    <Suspense name="ListEmployees" fallback={<div>Loading employees...</div>}>
      <ul>
        {employees.map((employee) => (
          <li key={employee._id}>{employee.email}</li>
        ))}
      </ul>
    </Suspense>
  );
}
