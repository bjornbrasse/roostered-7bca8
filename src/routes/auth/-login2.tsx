import { createFileRoute } from "@tanstack/react-router";
// import { Login } from "~/components/Login.tsx";

export const Route = createFileRoute("/auth/login2")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>{/* <Login /> */}</div>;
}
