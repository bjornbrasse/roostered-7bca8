import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { CrossIcon } from "lucide-react";
import { DepartmentDialog } from "~/features/organisation/components/department-dialog.tsx";

export const Route = createFileRoute("/organisations_/$id")({
  component: RouteComponent,
  loader: async (opts) => {
    const organisation = opts.context.queryClient.prefetchQuery(
      convexQuery(api.organisation.getById, {
        organisationId: opts.params.id,
      }),
    );
    return { organisation };
  },
});

function RouteComponent() {
  const { data: organisation } = useSuspenseQuery(
    convexQuery(api.organisation.getById, {
      organisationId: Route.useParams().id,
    }),
  );

  const organisationId = Route.useParams().id;

  return (
    <div className="flex h-full flex-col gap-4 p-12">
      <div className="flex">
        <h1>{organisation?.name}</h1>
      </div>
      <div className="flex flex-1 gap-8">
        <div className="w-1/4 rounded-md bg-gray-200 p-2">
          <div className="mb-4 flex items-center justify-between">
            <h2>Afdelingen</h2>
            {organisation && (
              <DepartmentDialog
                button={
                  <button
                    type="button"
                    className="flex size-8 items-center justify-center rounded-full border border-gray-600 text-gray-600"
                  >
                    <CrossIcon size={16} />
                  </button>
                }
                organisation={organisation}
              />
            )}
          </div>
          <ul className="no-list">
            {organisation?.departments.map((department) => (
              <Link
                to="/"
                params={{ id: organisationId, depId: department._id }}
                activeProps={{ className: "bg-gray-300" }}
                className="block rounded-md p-2"
                key={department._id}
              >
                {department.name}
              </Link>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
