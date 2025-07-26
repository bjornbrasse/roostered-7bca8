import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/schedules_/$id/members")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="h-full">Hello "/schedules_/$id/members"!</div>;
}
