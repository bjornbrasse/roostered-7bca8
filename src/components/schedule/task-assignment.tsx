import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '~/components/ui/context-menu.js';
import { DND_TYPES } from '~/lib/dnd.js';
import { cn } from '~/lib/utils.js';
import { parseWithZod } from '@conform-to/zod';
import { useSubmit } from 'react-router';
import { z } from 'zod';
import type { Route } from '.react-router/types/app/components/schedule/cells/+types/task-assignment.js';
import type { Doc } from 'convex/_generated/dataModel.js';

export type Assignment = Pick<Doc<'assignments'>, '_id' | 'userId'> & {
  task: Pick<Doc<'tasks'>, '_id' | 'nameShort'>;
};

const schema = z.discriminatedUnion('intent', [
  z.object({ intent: z.literal('assignmentDelete'), id: z.string().cuid() }),
]);

export async function action({ request }: Route.ActionArgs) {
  const submission = parseWithZod(await request.formData(), { schema });
  if (submission.status !== 'success') return { result: submission.reply() };
  // switch (submission.value.intent) {
  //   case 'assignmentDelete': {
  //     await prisma.assignment.delete({ where: { id: submission.value.id } });
  //   }
  // }
  return { success: true };
}

export function TaskAssignment({
  backgroundColor,
  assignment,
}: {
  backgroundColor?: string;
  assignment: Assignment;
}) {
  const submit = useSubmit();

  return (
    <ContextMenu>
      <ContextMenuTrigger className="data-[state=open]:bg-cyan-200" asChild>
        <div
          draggable
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData(
              DND_TYPES.task,
              JSON.stringify(assignment)
            );
          }}
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-sm border border-cyan-700 bg-white p-1 dark:border-cyan-500 dark:bg-inherit'
          )}
          style={{ backgroundColor }}
          key={assignment._id}
        >
          {assignment.task.nameShort}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() =>
            submit(
              { intent: 'assignmentDelete', id: assignment._id },
              {
                method: 'POST',
                action: '/resources/cells/task-assignment',
                navigate: false,
                fetcherKey: assignment._id,
              }
            )
          }
        >
          Verwijderen
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
