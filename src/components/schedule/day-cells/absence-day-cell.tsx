import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '~/components/ui/context-menu.js';
import { parseWithZod } from '@conform-to/zod';
import { useFetcher } from 'react-router';
import { z } from 'zod';
import type { Route } from './+types/absence-cell.js';
import type { Doc } from 'convex/_generated/dataModel.js';

export type Absence = Pick<Doc<'absences'>, '_id' | 'styles' | 'userId'> & {
  absenceType: Pick<Doc<'absenceTypes'>, '_id' | 'nameShort' | 'styles'>;
};

const INTENTS = {
  absenceDelete: 'absence-delete',
};

const schema = z.discriminatedUnion('intent', [
  z.object({ intent: z.literal(INTENTS.absenceDelete), id: z.string().cuid() }),
]);

export async function action({ request }: Route.ActionArgs) {
  const submission = parseWithZod(await request.formData(), { schema });
  if (submission.status !== 'success') return { result: submission.reply() };
  // switch (submission.value.intent) {
  //   case INTENTS.absenceDelete: {
  //     const absence = await prisma.absence.delete({
  //       select: { id: true },
  //       where: { id: submission.value.id },
  //     });
  //     return json({
  //       result: submission.reply({
  //         formErrors: absence ? undefined : ['Absence not deleted'],
  //       }),
  //     });
  //   }
  // }
  return { success: true };
}

export function AbsenceCell({ absences }: { absences: Array<Absence> }) {
  const fetcher = useFetcher();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className="flex w-full items-center justify-center border border-white text-lg"
          style={absences[0].absenceType.styles}
        >
          {absences[0]!.absenceType.nameShort}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() =>
            fetcher.submit(
              { intent: INTENTS.absenceDelete, id: absences[0]!._id },
              { action: '/resources/cells/absence-cell', method: 'POST' }
            )
          }
        >
          Verwijderen
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
