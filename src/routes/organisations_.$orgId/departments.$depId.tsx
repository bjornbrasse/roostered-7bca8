import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { ScheduleDialog } from "~/features/schedule/components/schedule-dialog.tsx";
import { ListEmployees } from "~/routes/departments_/department_.$depId.employees";
import { DepartmentSchedules } from "~/routes/departments_/department_.$depId.schedules";

export const Route = createFileRoute(
  "/organisations_/$orgId/departments/$depId",
)({
  component: RouteComponent,
  loader: async (opts) => {
    const department = opts.context.queryClient.prefetchQuery(
      convexQuery(api.department.getById, {
        depId: opts.params.depId,
      }),
    );
    return { department };
  },
});

function RouteComponent() {
  const { depId, orgId } = Route.useParams({ shouldThrow: true });

  const { data: department } = useSuspenseQuery(
    convexQuery(api.department.getById, { depId }),
  );

  return (
    <div className="flex h-full w-full flex-col gap-4 md:flex-row">
      <div className="h-1/2 rounded-lg border-1 border-gray-300 p-4 shadow-sm md:h-full md:w-1/2">
        <div className="flex justify-between">
          <h2>Medewerkers</h2>
          <MemberDialog
            button={<button className="btn btn-primary">Add Member</button>}
            organisation={{ _id: orgId }}
            department={{ _id: depId }}
          />
        </div>
        {/* {data.employees?.map((employee) => (
          <li key={employee?._id}>{employee?.email}</li>
        ))} */}
        {department && (
          <div className="border-2 border-sky-500">
            department && <ListEmployees department={department} />
          </div>
        )}
      </div>
      <div className="h-1/2 rounded-lg border-1 border-gray-300 p-4 shadow-sm md:h-full md:w-1/2">
        <div className="flex justify-between">
          <h2>Roosters</h2>
          <ScheduleDialog
            button={<button className="btn btn-primary">Nieuw Rooster</button>}
            department={{ _id: Route.useParams().depId }}
          />
        </div>
        <DepartmentSchedules department={{ _id: depId }} />
      </div>
    </div>
  );
}
