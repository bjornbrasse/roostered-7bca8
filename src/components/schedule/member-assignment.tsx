import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '~/components/ui/context-menu.js';
import { DND_TYPES } from '~/lib/dnd.js';

export function MemberAssignment({
  assignment,
}: {
  assignment: {
    _id: string;
    user: { _id: string; firstName: string; lastName: string };
  };
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          draggable
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData(
              DND_TYPES.task,
              JSON.stringify(assignment)
            );
          }}
          className="h-[25px] items-center justify-center rounded-sm border border-cyan-700 bg-white px-1 dark:border-cyan-500 dark:bg-inherit"
          key={assignment._id}
        >
          {`${assignment.user.firstName.charAt(0)}${assignment.user.lastName.charAt(0)}`}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Verwijderen</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
