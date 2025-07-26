import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { Suspense } from "react";
import type { Department } from "~/features/department/department-model.ts";

export function DepartmentSchedules({
  department,
}: {
  department: Pick<Department, "_id">;
}) {
  const { data: schedules } = useSuspenseQuery(
    convexQuery(api.department.getSchedules, { departmentId: department._id }),
  );

  return (
    <Suspense fallback={<div>Loading schedules...</div>}>
      <ul>
        {schedules.map((schedule) => (
          <li key={schedule._id}>{schedule.name}</li>
        ))}
      </ul>
    </Suspense>
  );
}
