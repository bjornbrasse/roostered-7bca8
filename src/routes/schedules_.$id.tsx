import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/schedules_/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full flex-col gap-8 bg-emera-200 p-12">
      <div>
        <h1>Rooster</h1>
        <div className="mt-4 flex gap-2 rounded-md bg-gray-100 px-4 py-3">
          <Link
            to="/schedules/$id/members"
            activeProps={{ className: "bg-sky-400" }}
            inactiveProps={{ className: "border border-gray-200" }}
            className="rounded-md px-8 py-1.5"
            params={{ id: Route.useParams().id }}
          >
            Leden
          </Link>
          <Link
            to="/schedules/$id/tasks"
            activeProps={{ className: "bg-sky-400" }}
            inactiveProps={{ className: "border border-gray-200" }}
            className="rounded-md px-8 py-1.5"
            params={{ id: Route.useParams().id }}
          >
            Taken
          </Link>
          <Link
            to="/schedules/$id/forwards"
            activeProps={{ className: "bg-sky-400" }}
            inactiveProps={{ className: "border border-gray-200" }}
            className="rounded-md px-8 py-1.5"
            params={{ id: Route.useParams().id }}
          >
            Doorschakelen
          </Link>
        </div>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
