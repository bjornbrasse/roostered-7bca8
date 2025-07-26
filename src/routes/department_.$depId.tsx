import { convexQuery } from "@convex-dev/react-query";
import { Label } from "@radix-ui/react-label";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  type LinkComponentProps,
  Outlet,
} from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Input } from "postcss";
import { Suspense } from "react";
import { Button } from "~/components/ui/button.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs.tsx";
import { ScheduleDialog } from "~/features/schedule/components/schedule-dialog.tsx";
import { DepartmentEmployeeDialog } from "~/features/user/components/department-employee-dialog";
import { cn } from "~/lib/utils.ts";

export const Route = createFileRoute("/department_/$depId")({
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
  const { depId } = Route.useParams({ shouldThrow: true });

  const { data: department } = useSuspenseQuery(
    convexQuery(api.department.getById, { depId }),
  );

  return (
    <div className="flex h-full flex-col gap-8 p-8">
      <div id="header">
        <h1>{department.name}</h1>
      </div>
      <div className="flex flex-1">
        <div className="flex w-1/4 flex-col border-gray-200 border-r pr-8">
          <TabButton to="/department/$depId/employees">Medewerkers</TabButton>
          <TabButton to="/department/$depId/tasks">Taken</TabButton>
          <TabButton to="/department/$depId/schedules">Roosters</TabButton>
          <TabButton to="/department/$depId/special-dates">
            Bijzondere data
          </TabButton>
        </div>
        <div className="flex-1 pl-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function TabButton({ className, ...props }: LinkComponentProps) {
  return (
    <div className="border-gray-200 border-b last:border-0">
      <Link
        {...props}
        className={cn("my-2 block rounded-sm px-4 py-3", className)}
        activeProps={{
          className: "bg-sky-100 shadow-sm border border-gray-200",
        }}
        inactiveProps={{ className: "hover:bg-gray-100" }}
      />
    </div>
  );
}
