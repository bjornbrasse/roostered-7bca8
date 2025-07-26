import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$org/$dep_/$sdl")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="h-full p-8">Hello "/$org/$dep_/$sdl"!</div>;
}
