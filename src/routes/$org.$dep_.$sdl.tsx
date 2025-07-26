import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$org/$dep_/$sdl")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="border-4 border-indigo-800 bg-sky-100 p-8">
      Hello "/$org/$dep_/$sdl"!
    </div>
  );
}
