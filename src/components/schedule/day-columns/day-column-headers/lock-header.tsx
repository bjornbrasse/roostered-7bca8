import { Button } from '~/components/ui/button.js';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '~/components/ui/context-menu.js';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '~/components/ui/hover-card.js';
import { Input } from '~/components/ui/input.js';
import { Label } from '~/components/ui/label.js';
import { type Dayjs } from 'dayjs';
import { useState } from 'react';
import { z } from 'zod';
import { useFetcher } from 'react-router';
import { cn } from '~/lib/utils.js';
import { useScheduleContext } from '~/components/schedule/schedule.js';
import type { Doc } from 'convex/_generated/dataModel.js';

const statuses = ['open', 'closing', 'closed'] as const;

const schema = z.object({
  scheduleId: z.string().cuid(),
  start: z.coerce.date().optional(),
  end: z.coerce.date(),
  status: z.enum(statuses),
});

// export async function action({ request }: ActionFunctionArgs) {
//   const createdById = await requireUserId(request);
//   const user = await prisma.user.findUniqueOrThrow({
//     select: { firstName: true, lastName: true },
//     where: { id: createdById },
//   });
//   const submission = parseWithZod(await request.formData(), { schema });
//   if (submission.status !== 'success')
//     return json({ result: submission.reply() });
//   const data = submission.value;
//   const scheduleLock = await prisma.scheduleLock.create({
//     data: {
//       ...data,
//       statusHistory: `${dayjs().format("dd D MMM. 'YY - H:mm uur")}, ${user.firstName} ${user.lastName} - ${data.status}`,
//       createdById,
//     },
//   });
//   if (!scheduleLock)
//     return json({
//       result: submission.reply({ formErrors: ['Schedule lock not crated'] }),
//     });
//   return json({ success: true });
// }

export function LockHeader({
  date,
  scheduleLocks,
}: {
  date: Dayjs;
  scheduleLocks: Array<Doc<'scheduleLocks'>>;
}) {
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);

  const scheduleContext = useScheduleContext();
  if (!scheduleContext) throw new Error('Set Schedule Context');
  const { schedule } = scheduleContext;
  if (!schedule) return;

  return (
    <HoverCard open={open} onOpenChange={(open) => setOpen(!open)}>
      <ContextMenu>
        <HoverCardTrigger className="data-[state=open]:bg-sky-400" asChild>
          <ContextMenuTrigger
            className="data-[state=open]:bg-green-400"
            asChild
          >
            <div
              onClick={() => setOpen(false)}
              className={cn('sticky top-0 border-b border-r border-gray-400', {
                'bg-green-300': scheduleLocks.some(
                  (sl) => sl.status === 'open'
                ),
                'bg-amber-300': scheduleLocks.some(
                  (sl) => sl.status === 'closing'
                ),
                'bg-red-500': scheduleLocks.some(
                  (sl) => sl.status === 'closed'
                ),
              })}
            />
          </ContextMenuTrigger>
        </HoverCardTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setOpen(true)}>Nieuw</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <HoverCardContent className="w-48 border border-gray-400 bg-white shadow-xl">
        <h1>Nieuwe Lock</h1>
        <fetcher.Form
          method="POST"
          action="/resources/headers/lock-header"
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="scheduleId" value={schedule._id} />
          <div>
            <Label htmlFor="end">Tot:</Label>
            <Input
              id="end"
              name="end"
              type="date"
              defaultValue={date.format('YYYY-MM-DD')}
              min={date.format('YYYY-MM-DD')}
            />
          </div>
          <div>
            <Label htmlFor="start">Vanaf:</Label>
            <Input
              id="start"
              name="start"
              type="date"
              max={date.format('YYYY-MM-DD')}
            />
          </div>
          <div>
            <Label htmlFor="status">Status:</Label>
            <select id="status" name="status">
              <option value="open">open</option>
              <option value="closing">closing</option>
              <option value="closed">closed</option>
            </select>
          </div>
          <Button>Opslaan</Button>
        </fetcher.Form>
      </HoverCardContent>
    </HoverCard>
  );
}
