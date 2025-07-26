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
        <div className="flex w-1/4 flex-col gap-4 border-gray-500 border-r pr-8">
          <TabButton to="/department/$depId/employees">Medewerkers</TabButton>
          <TabButton to="/department/$depId/tasks">Taken</TabButton>
          <TabButton to="/department/$depId/schedules">Roosters</TabButton>
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function TabButton({ className, ...props }: LinkComponentProps) {
  return (
    <Link
      {...props}
      className={cn("rounded-sm border border-gray-100 p-4", className)}
    />
  );
}
