import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { ListEmployees } from "~/features/department/components/list-employees.tsx";
import { ScheduleDialog } from "~/features/schedule/components/schedule-dialog.tsx";
import { MemberDialog } from "~/features/user/components/member-dialog";

export const Route = createFileRoute("/organisations_/$id/departments/$depId")({
  component: RouteComponent,
  loader: async (opts) => {
    const department = opts.context.queryClient.prefetchQuery(
      convexQuery(api.department.getById, {
        id: opts.params.depId,
      }),
    );
    return { department };
  },
});

function RouteComponent() {
  const { depId: id } = Route.useParams({ shouldThrow: true });
  const { data: department } = useSuspenseQuery(
    convexQuery(api.department.getById, { id }),
  );

  return (
    <div className="flex h-full w-full flex-col gap-4 md:flex-row">
      <div className="h-1/2 rounded-lg border-1 border-gray-300 p-4 shadow-sm md:h-full md:w-1/2">
        <div className="flex justify-between">
          <h2>Medewerkers</h2>
          <MemberDialog
            button={<button className="btn btn-primary">Add Member</button>}
            organisation={{ _id: Route.useParams().id }}
            department={{ _id: Route.useParams().depId }}
          />
        </div>
        {/* {data.employees?.map((employee) => (
          <li key={employee?._id}>{employee?.email}</li>
        ))} */}
        {department && (
          <div className="border-2 border-sky-500">
            department && <ListEmployees department={department} />
          </div>
        )}
      </div>
      <div className="h-1/2 rounded-lg border-1 border-gray-300 p-4 shadow-sm md:h-full md:w-1/2">
        <div className="flex justify-between">
          <h2>Roosters</h2>
          <ScheduleDialog
            button={<button className="btn btn-primary">Nieuw Rooster</button>}
            department={{ _id: Route.useParams().depId }}
          />
        </div>
        {/* {data.schedules?.map((schedule) => (
          <Link
            to="/schedules/$id"
            params={{ id: schedule._id }}
            className="flex justify-between rounded-md border border-gray-200 p-2 shadow-sm"
            key={schedule._id}
          >
            <p>{schedule?.name}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <EllipsisVerticalIcon />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>Bewerken</DropdownMenuItem>
                  <DropdownMenuItem>
                    Billing
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Keyboard shortcuts
                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Invite users
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>Email</DropdownMenuItem>
                        <DropdownMenuItem>Message</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>More...</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem>
                    New Team
                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>GitHub</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem disabled>API</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Link>
        ))} */}
      </div>
    </div>
  );
}
