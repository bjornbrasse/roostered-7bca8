import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/schedules_/$id/forwards")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/schedules_/$id/forwards"!</div>;
}
