import type { Route } from './+types/task-row.js';
import { parseWithZod } from '@conform-to/zod';
import type { api } from 'convex/_generated/api.js';
import { useState } from 'react';
import { useSearchParams, useSubmit } from 'react-router';
import { z } from 'zod';
import { TaskTile } from '~/components/tiles/task-tile.js';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '~/components/ui/context-menu.js';
import { viewSessionStorage } from '~/lib/cookies.server.js';
import { DND_TYPES } from '~/lib/dnd.js';
import { cn } from '~/lib/utils.js';

const INTENTS = {
  open: 'open',
  reorder: 'reorder',
};

const schema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal(INTENTS.open),
    id: z.string().cuid(),
  }),
]);

export async function action({ request }: Route.ActionArgs) {
  const submission = parseWithZod(await request.formData(), { schema });
  if (submission.status !== 'success') return { result: submission.reply() };
  switch (submission.value.intent) {
    case INTENTS.open: {
      const viewSession = await viewSessionStorage.getSession(
        request.headers.get('cookie')
      );
      viewSession.set('activeScheduleTask', submission.value.id);
      return {};
      // {
      //   headers: {
      //     'set-cookie': await viewSessionStorage.commitSession(viewSession),
      //   },
      // }
    }
  }
}

type ScheduleTask =
  (typeof api.schedule.findFirst._returnType)['scheduleTasks'][number];

export function TaskRow({
  onEdit,
  scheduleTask,
}: {
  onEdit: (scheduleTask: ScheduleTask) => void;
  scheduleTask: ScheduleTask;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();

  if (!scheduleTask.task) return null;

  const [acceptDrop, setAcceptDrop] = useState<'none' | 'top' | 'bottom'>(
    'none'
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={cn(
            'data-[state=open]:bg-background-selected sticky left-0 flex w-48 cursor-pointer items-end justify-between border-b bg-white px-2 pb-0.5 pt-1.5 dark:bg-background',
            acceptDrop === 'top'
              ? 'border-b-transparent border-t-red-500'
              : acceptDrop === 'bottom'
                ? 'border-b-red-500 border-t-transparent'
                : 'border-b-gray-300 border-t-transparent'
          )}
          style={{
            backgroundColor:
              scheduleTask.styles?.itemBackgroundColor ?? undefined,
            borderRight: '4px solid #155e75',
          }}
          draggable
          onDragLeave={() => {
            setAcceptDrop('none');
          }}
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData(
              DND_TYPES['task-row'],
              JSON.stringify({ scheduleTask })
            );
          }}
          onDragOver={(event) => {
            if (event.dataTransfer.types.includes(DND_TYPES['task-row'])) {
              event.preventDefault();
              event.stopPropagation();
              let rect = event.currentTarget.getBoundingClientRect();
              let midpoint = (rect.top + rect.bottom) / 2;
              setAcceptDrop(event.clientY <= midpoint ? 'top' : 'bottom');
            }
          }}
          onDrop={(event) => {
            event.stopPropagation();

            let transfer = JSON.parse(
              event.dataTransfer.getData(DND_TYPES['task-row'])
            );
            // invariant(transfer.id, 'missing cardId')
            // invariant(transfer.title, 'missing title')

            // let droppedOrder = acceptDrop === 'top' ? previousOrder : nextOrder
            // let moveOrder = (droppedOrder + order) / 2

            // let mutation: ItemMutation = {
            // 	order: moveOrder,
            // 	columnId: columnId,
            // 	id: transfer.id,
            // 	title: transfer.title,
            // }

            // submit(
            // 	{ ...mutation, intent: INTENTS. },
            // 	{
            // 		method: 'post',
            // 		navigate: false,
            // 		fetcherKey: `card:${transfer.id}`,
            // 	},
            // )

            setAcceptDrop('none');
          }}
        >
          <p className="hidden md:block">{scheduleTask.task.name}</p>
          <TaskTile
            backgroundColor={
              scheduleTask.styles?.itemBackgroundColor ?? undefined
            }
            size="sm"
            task={scheduleTask.task}
            className="place-self-start"
          />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
        // onClick={() =>
        // 	submit(
        // 		{ intent: INTENTS.open, id: scheduleTask.id },
        // 		{
        // 			action: '/resources/rows/schedule-task-row',
        // 			method: 'POST',
        // 			navigate: false,
        // 		},
        // 	)
        // }
        // onClick={() =>
        // setSearchParams((searchParams) => {
        //   searchParams.set('task', scheduleTask.task._id);
        //   return searchParams;
        // })
        // }
        >
          Openen
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onEdit(scheduleTask)}>
          Bewerken
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
