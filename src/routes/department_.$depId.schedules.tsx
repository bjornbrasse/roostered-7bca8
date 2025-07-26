import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Suspense } from "react";

export const Route = createFileRoute("/department_/$depId/schedules")({
  component: RouteComponent,
  loader: async ({ context, params }) =>
    context.queryClient.prefetchQuery(
      convexQuery(api.department.getSchedules, {
        departmentId: params.depId,
      }),
    ),
});

function RouteComponent() {
  const { data: schedules } = useSuspenseQuery(
    convexQuery(api.department.getSchedules, {
      departmentId: Route.useParams().depId,
    }),
  );

  return (
    <Suspense fallback={<div>Loading schedules...</div>}>
      <div className="pl-8">
        {schedules.map(({ org, dep, slug: sdl, ...schedule }) => (
          <Link
            to="/$org/$dep/$sdl"
            params={{
              org,
              dep,
              sdl,
            }}
            className="block rounded-sm bg-indigo-100 p-2"
            key={schedule._id}
          >
            {schedule.name}
          </Link>
        ))}
      </div>
    </Suspense>
  );
}
