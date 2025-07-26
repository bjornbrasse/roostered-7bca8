import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Suspense } from "react";

export const Route = createFileRoute("/department_/$depId/schedules")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: schedules } = useSuspenseQuery(
    convexQuery(api.department.getSchedules, {
      departmentId: Route.useParams().depId,
    }),
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
