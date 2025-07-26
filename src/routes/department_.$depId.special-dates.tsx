import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SpecialDateDialog } from "~/features/specialDate/components/special-date-dialog.tsx";

export const Route = createFileRoute("/department_/$depId/special-dates")({
  component: RouteComponent,
});

function RouteComponent() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Special Dates</h1>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md border border-gray-200 p-2"
        >
          Nieuw
        </button>
        <SpecialDateDialog
          departmentId={Route.useParams().depId}
          onOpenChange={setOpen}
          open={open}
        />
      </div>
    </div>
  );
}
