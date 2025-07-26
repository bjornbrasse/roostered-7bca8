import { type Dayjs } from 'dayjs';
import { Fragment, useState } from 'react';
import { useFetcher, useFetchers, useSubmit } from 'react-router';
// import { redirectBack } from 'remix-utils/redirect-back';
import { z } from 'zod';
import { AbsenceTypeTile } from '~/components/tiles/absence-type-tile.js';
import { CompetenceTile } from '~/components/tiles/competence-tile.js';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '~/components/ui/context-menu.js';
// import { createAssignment } from '#app/routes/api+/assignment.ts';
// import { createChangeBundle } from '#app/routes/api+/change.ts';
import {
  AbsenceCell,
  type Absence,
} from '~/components/schedule/day-cells/absence-day-cell.js';
// import { TaskAssignment } from '#app/routes/resources+/cells+/task-assignment.tsx';
// import { requireUserId } from '#app/utils/auth.server.ts';
import type { Doc } from 'convex/_generated/dataModel.js';
import {
  TaskAssignment,
  type Assignment,
} from '~/components/schedule/task-assignment.js';
import { DND_TYPES } from '~/lib/dnd.js';
import { cn } from '~/lib/utils.js';
import { useScheduleContext } from '~/components/schedule/schedule.js';
import { useDayContext } from '~/components/schedule/day-columns/day-context.js';

const INTENTS = {
  createAssignment: 'create-assignment',
  moveAssignment: 'moveAssignment',
  absenceCreate: 'absence-create',
} as const;

const schemaCreateAssignment = z.object({
  date: z.coerce.date(),
  supervisorId: z.string().cuid().optional(),
  taskId: z.string().cuid(),
  userId: z.string().cuid(),
});
const schema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal(INTENTS.absenceCreate),
    absenceTypeId: z.string().cuid(),
    date: z.coerce.date(),
    departmentId: z.string().cuid().optional(),
    userId: z.string().cuid(),
  }),
  z.object({
    intent: z.literal(INTENTS.moveAssignment),
    id: z.string().cuid(),
    userId: z.string().cuid(),
    date: z.coerce.date(),
  }),
  z
    .object({
      intent: z.literal(INTENTS.createAssignment),
    })
    .merge(schemaCreateAssignment),
]);

// export async function action({ request }: ActionFunctionArgs) {
//   const createdById = await requireUserId(request);
//   const submission = parseWithZod(await request.formData(), { schema });
//   if (submission.status !== 'success')
//     return json({ result: submission.reply() });
//   switch (submission.value.intent) {
//     case INTENTS.absenceCreate: {
//       const { intent, ...data } = submission.value;
//       const absence = await prisma.absence.create({
//         data: { ...data, createdById },
//       });
//       break;
//     }
//     case INTENTS.moveAssignment: {
//       const { intent, id, ...data } = submission.value;
//       await prisma.assignment.update({
//         where: { id },
//         data,
//       });
//       break;
//     }
//     case INTENTS.createAssignment: {
//       const { intent, supervisorId, ...data } = submission.value;
//       const assignment = await prisma.assignment.create({
//         data: {
//           ...data,
//           createdById,
//           supervisors: { connect: { id: supervisorId } },
//         },
//       });
//       return json({ result: submission.reply(), assignment });
//     }
//   }
//   return redirectBack(request, { fallback: '/' });
// }

export type MemberDayCellAssignment = Assignment & {
  supervisors: Array<Pick<Doc<'assignments'>, 'supervisors'>>;
};

export function MemberDayCell({
  absences,
  assignments,
  date,
  scheduleMember,
}: {
  absences: Array<Absence>;
  assignments: Array<MemberDayCellAssignment>;
  date: Dayjs;
  scheduleMember: {
    userId: string;
    user: {
      competences: Array<{ level: string; taskId: string }>;
    };
  };
}) {
  const dayContext = useDayContext();
  if (!dayContext) throw new Error('Set Day Context');
  const { isActive, isWeekend, unplannedTasks } = dayContext;

  const fetcher = useFetcher();
  const submit = useSubmit();
  const [draggingOver, setDraggingOver] = useState(false);

  const scheduleContext = useScheduleContext();
  if (!scheduleContext) throw new Error('Set Schedule Context');
  const { absenceTypes, schedule, selectedUserDays } = scheduleContext;
  if (!schedule) return;

  const isSelected =
    selectedUserDays.findIndex(
      (s) =>
        s.date.toDateString() === date.toString() &&
        s.userId === scheduleMember.userId
    ) > -1;

  // nogmaals te plannen taken moeten niet zijn reeds op de dag gepland, maar niet bij dit lid en daarvoor moet dit lid een competentie hebben!
  const otherUnplannedScheduleTasks = schedule.scheduleTasks.filter(
    ({ task }) =>
      !assignments.some((assignment) => assignment.task._id === task?._id) &&
      !unplannedTasks.some((unplannedTask) => unplannedTask._id === task?._id)
  );
  // .filter(({ task }) =>
  //   scheduleMember.user.competences.some(
  //     (competence) => competence.taskId === task?._id
  //   )
  // );

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {absences.length > 0 ? (
          <AbsenceCell absences={absences} />
        ) : (
          <div
            onClick={(event) => {
              event.stopPropagation();
              // console.log('Werkt alleen met deze console log')
              if (event.shiftKey) {
                // console.log('Werkt alleen met deze console log 2')
                // return addUserDay({
                // 	date: date.toDate(),
                // 	user: scheduleMember.user,
                // })
              }
              // selectUserDay({ date: date.toDate(), user: scheduleMember.user });
            }}
            onDragOver={(event) => {
              if (event.dataTransfer.types.includes(DND_TYPES.task)) {
                event.preventDefault();
                event.stopPropagation();
                const assignment = event.dataTransfer.getData(DND_TYPES.task);
                // const transfer = JSON.parse(
                // 	,
                // )
                // console.log('🚀 ~ transfer:', transfer)

                setDraggingOver(true);
              }
            }}
            onDragLeave={() => {
              setDraggingOver(false);
            }}
            onDrop={(event) => {
              event.stopPropagation();

              const assignment = JSON.parse(
                event.dataTransfer.getData(DND_TYPES.task)
              ) as { id: string };
              assignment.id, 'missing assignmentId';

              submit(
                {
                  intent: 'moveAssignment',
                  id: assignment.id,
                  userId: scheduleMember.userId,
                  date: date.toISOString(),
                },
                {
                  method: 'POST',
                  action: '/resources/cells/member-day-cell',
                  navigate: false,
                  fetcherKey: `assignment:${assignment.id}`,
                }
              );

              setDraggingOver(false);
            }}
            className={cn(
              'data-[state=open]:bg-open flex min-w-full cursor-pointer flex-wrap gap-1 border-b border-r border-gray-300 p-1 px-1.5 leading-tight dark:bg-gray-700',
              {
                'bg-green-500': draggingOver,
                'min-w-max p-1': isActive,
                // 'px-1 pt-0.5': !isActive,
                'bg-gray-200 dark:bg-gray-900': isWeekend,
                'border-l border-gray-400': date.day() === 6,
                'border-r border-gray-400': date.day() === 0,
                'bg-background-selected': isSelected,
              }
            )}
          >
            {isActive ? (
              <>
                {assignments.map((assignment) => (
                  <TaskAssignment
                    backgroundColor={
                      schedule.scheduleTasks.find(
                        (st) => st.taskId === assignment.task._id
                      )?.styles?.itemBackgroundColor ?? undefined
                    }
                    assignment={assignment}
                    key={assignment._id}
                  />
                ))}
              </>
            ) : (
              // <p>{assignments.map((b) => b.task.nameShort).join(', ')}</p>
              <p>
                {assignments.map((assignment, index) => (
                  <Fragment key={assignment._id}>
                    {Array.from(assignment.task.nameShort).map(
                      (char, charIndex) =>
                        assignment.supervisors.length > 0 ? (
                          <u key={index + '-' + charIndex}>{char}</u>
                        ) : (
                          <i key={index + '-' + charIndex}>{char}</i>
                        )
                    )}
                    {index < assignments.length - 1 && ', '}
                  </Fragment>
                ))}
              </p>
            )}
          </div>
        )}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Afwezig</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {absenceTypes.map((absenceType) => (
              <ContextMenuItem
                disabled={!schedule}
                onClick={() =>
                  submit(
                    {
                      intent: INTENTS.absenceCreate,
                      absenceTypeId: absenceType._id,
                      date: date.toISOString(),
                      departmentId: schedule!.departmentId,
                      userId: scheduleMember.userId,
                    },
                    {
                      action: '/resources/cells/member-day-cell',
                      method: 'POST',
                      navigate: false,
                    }
                  )
                }
                className="flex items-center justify-between"
                key={absenceType._id}
              >
                {absenceType.name}
                <AbsenceTypeTile
                  absenceType={absenceType}
                  key={absenceType._id}
                />
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
        {unplannedTasks.length > 0 && (
          <>
            <ContextMenuSeparator />
            <ContextMenuLabel>Nog plannen:</ContextMenuLabel>
            {unplannedTasks.map((task) => {
              const competence = scheduleMember.user.competences.find(
                (competence) => competence.taskId === task._id
              );
              const nonJuniorMembers = schedule.scheduleMembers.filter(
                (scheduleMember) =>
                  scheduleMember.user.competences.some(
                    (competence) =>
                      competence.taskId === task._id &&
                      competence.level !== 'junior'
                  )
              );
              return (
                <Fragment key={`task-${task._id}`}>
                  {competence?.level === 'junior' ? (
                    <ContextMenuSub>
                      <ContextMenuSubTrigger key={task._id}>
                        {task.name}
                        <CompetenceTile
                          competence={competence}
                          size="sm"
                          className="ml-2 mr-4"
                        />
                      </ContextMenuSubTrigger>
                      <ContextMenuSubContent>
                        {nonJuniorMembers.map(({ user }) => {
                          const competence = user.competences.find(
                            (competence) => competence.taskId === task._id
                          );
                          return (
                            <ContextMenuItem
                              // onClick={() =>
                              //   createAssignment(
                              //     {
                              //       date: date.toDate(),
                              //       taskId: task.id,
                              //       userId: scheduleMember.user.id,
                              //       supervisorId: user.id,
                              //     },
                              //     fetcher
                              //   )
                              // }
                              disabled={!competence}
                              key={task._id}
                            >
                              {`${user.firstName} ${user.lastName}`}
                              <CompetenceTile
                                competence={competence}
                                size="sm"
                                className="mx-2"
                              />
                            </ContextMenuItem>
                          );
                        })}
                      </ContextMenuSubContent>
                    </ContextMenuSub>
                  ) : (
                    <ContextMenuItem
                      // onClick={() =>
                      //   createAssignment(
                      //     {
                      //       date: date.toDate(),
                      //       taskId: task.id,
                      //       userId: scheduleMember.user.id,
                      //     },
                      //     fetcher
                      //   )
                      // }
                      disabled={!competence}
                      key={task._id}
                    >
                      {task.name}
                      <CompetenceTile
                        competence={competence}
                        size="sm"
                        className="ml-2"
                      />
                    </ContextMenuItem>
                  )}
                </Fragment>
              );
            })}
          </>
        )}
        {otherUnplannedScheduleTasks.length > 0 && (
          <>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>Nogmaals plannen</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                {otherUnplannedScheduleTasks.map(({ task }) => {
                  const competence = scheduleMember.user.competences.find(
                    (competence) => competence.taskId === task?._id
                  );
                  const nonJuniorMembers = schedule.scheduleMembers.filter(
                    (scheduleMember) =>
                      scheduleMember.user.competences.some(
                        (competence) =>
                          competence.taskId === task?._id &&
                          competence.level !== 'junior'
                      )
                  );
                  return (
                    <>
                      {competence?.level === 'junior' ? (
                        <ContextMenuSub>
                          <ContextMenuSubTrigger>
                            {task?.name}
                            <CompetenceTile
                              competence={competence}
                              size="sm"
                              className="ml-2 mr-4"
                            />
                          </ContextMenuSubTrigger>
                          <ContextMenuSubContent>
                            {nonJuniorMembers.map(
                              ({ user: { _id: supervisorId, ...user } }) => {
                                const competence = user.competences.find(
                                  (competence) =>
                                    competence.taskId === task?._id
                                );
                                return (
                                  <ContextMenuItem
                                    // onClick={() =>
                                    //   createAssignment(
                                    //     {
                                    //       date: date.toDate(),
                                    //       taskId: task.id,
                                    //       userId: scheduleMember.user.id,
                                    //       supervisorId,
                                    //     },
                                    //     fetcher
                                    //   )
                                    // }
                                    disabled={!competence}
                                    key={`supervisor-${supervisorId}`}
                                  >
                                    {`${user.firstName} ${user.lastName}`}
                                    <CompetenceTile
                                      competence={competence}
                                      size="sm"
                                      className="mx-2"
                                    />
                                  </ContextMenuItem>
                                );
                              }
                            )}
                          </ContextMenuSubContent>
                        </ContextMenuSub>
                      ) : (
                        <ContextMenuItem
                          // onClick={() =>
                          //   createAssignment(
                          //     {
                          //       date: date.toDate(),
                          //       taskId: task.id,
                          //       userId: scheduleMember.user.id,
                          //     },
                          //     fetcher
                          //   )
                          // }
                          key={task?._id}
                        >
                          {task?.name}
                          <CompetenceTile
                            competence={competence}
                            size="sm"
                            className="ml-2 mr-4"
                          />
                        </ContextMenuItem>
                      )}
                    </>
                  );
                })}
              </ContextMenuSubContent>
            </ContextMenuSub>
          </>
        )}
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>Maak wijziging</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuSub>
              <ContextMenuSubTrigger>Afwezig</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem
                // onClick={() => {
                //   createChangeBundle(
                //     {
                //       scheduleId: schedule.id,
                //       changeRequestItems: assignments.map((assignment) => ({
                //         date: date.toDate(),
                //         scheduleTaskId: assignment.task.id,
                //       })),
                //     },
                //     fetcher
                //   );
                // }}

                // 	{
                // 	const data: Record<string, any> = {
                // 		intent: 'create-mutation-bundle',
                // 		date: date.toString(),
                // 		userId: scheduleMember.user.id,
                // 	}
                // 	assignments.forEach((assignment, i) => {
                // 		data[`assignments[${i}].id`] = assignment.id
                // 	})
                // 	fetcher.submit(data, {
                // 		action: '/api/mutation',
                // 		method: 'POST',
                // 	})
                // }}
                >
                  Cursus
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function usePendingAbsence() {
  type PendingItem = ReturnType<typeof useFetchers>[number] & {
    formData: FormData;
  };
  return useFetchers()
    .filter((fetcher): fetcher is PendingItem => {
      if (!fetcher.formData) return false;
      let intent = fetcher.formData.get('intent');
      return intent === INTENTS.absenceCreate;
    })
    .map((fetcher) => {
      const result = z
        .object({
          absenceTypeId: z.string().cuid(),
          date: z.coerce.date(),
          departmentId: z.string().cuid().optional(),
          userId: z.string().cuid(),
        })
        .safeParse(fetcher.formData);

      return result.success ? result.data : null;
    });
}
