import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu.tsx";
import { TaskDialog } from "~/features/task/components/task-dialog";

export const Route = createFileRoute("/schedules_/$id/tasks")({
  component: RouteComponent,
});

function RouteComponent() {
  const [open, setOpen] = useState(false);
  const { data: tasks } = useSuspenseQuery(
    convexQuery(api.schedule.listTasks, { scheduleId: Route.useParams().id }),
  );
  return (
    <>
      <div>
        <table className="w-full text-left">
          <thead>
            <tr className="h-10 border-indigo-700 border-b-2">
              <th>Naam</th>
              <th>Korte naam</th>
              <th>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button>
                      <EllipsisVerticalIcon />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                      Nieuwe taak
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task: any) => (
              <tr className="h-10" key={task._id}>
                <td>{task.name}</td>
                <td>{task.nameShort}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TaskDialog
        department={{ _id: Route.useParams().id }}
        open={open}
        onSaved={() => {
          setOpen(false);
        }}
        schedule={{ _id: Route.useParams().id }}
      />
    </>
  );
}
