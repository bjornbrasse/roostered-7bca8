import { convexQuery } from "@convex-dev/react-query";
// import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { Suspense } from "react";
import { OrganisationDialog } from "~/features/organisation/components/organisation-dialog.tsx";

export const Route = createFileRoute("/organisations")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full flex-col gap-4 p-12">
      <div className="flex items-center justify-between">
        <h1>Organisaties</h1>
        <OrganisationDialog button={<button>Nieuwe Organisatie</button>} />
      </div>
      <OrganisationList />
      <div className="flex-1 border border-fuchsia-400">
        <Outlet />
      </div>
    </div>
  );
}

function OrganisationList() {
  const organisations = useQuery(
    api.organisation.list
  );

  if(!organisations) return <div>Loading...</div>;

  return (
      <ul className="grid grid-cols-4 gap-12">
        {organisations.map((organisation) => (
          <Link
            to="/organisations/$id"
            params={{ id: organisation._id }}
            key={organisation._id}
            className="flex aspect-square overflow-hidden rounded-md border border-gray-400"
          >
            <div className="h-16 w-full place-self-end border-gray-200 border-t bg-gray-100 p-2">
              <p className="text-sm">{organisation.name}</p>
            </div>
          </Link>
        ))}
      </ul>
  )
}