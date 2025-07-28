import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/profile2")({
  component: RouteComponent,
});

function RouteComponent() {
  // const user = useUser();
  // const matches = useMatches();
  // const breadcrumbs = matches
  //   .map((m) => {
  //     const result = BreadcrumbHandleMatch.safeParse(m);
  //     if (!result.success || !result.data.handle.breadcrumb) return null;
  //     return (
  //       <Link key={m.id} to={m.pathname} className="flex items-center">
  //         {result.data.handle.breadcrumb}
  //       </Link>
  //     );
  //   })
  //   .filter(Boolean);

  return (
    <div className="m-auto mt-16 mb-24 max-w-3xl">
      <div className="container">
        <ul className="flex gap-3">
          <li>
            <Link
              className="text-muted-foreground"
              to={`/users/${user.username}`}
            >
              Profile
            </Link>
          </li>
          {/* {breadcrumbs.map((breadcrumb, i, arr) => (
            <li
              key={i}
              className={cn("flex items-center gap-3", {
                "text-muted-foreground": i < arr.length - 1,
              })}
            >
              <Icon name="arrow-right" size="sm">
                {breadcrumb}
              </Icon>
            </li>
          ))} */}
        </ul>
      </div>
      {/* <Spacer size="xs" /> */}
      <main className="mx-auto bg-muted px-6 py-8 md:container md:rounded-3xl">
        <Outlet />
      </main>
    </div>
  );
}
