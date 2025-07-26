import { useFetcher } from 'react-router';
import { AbsenceTypeTile } from '~/components/tiles/absence-type-tile.js';
import { CompetenceTile } from '~/components/tiles/competence-tile.js';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '~/components/ui/context-menu.js';
// import { createAssignment } from '~/routes/api+/assignment.ts';
// import { MemberAssignment } from '~/routes/resources+/cells+/member-assignment.js';
import { useState } from 'react';
import { DND_TYPES } from '~/lib/dnd.js';
import { cn } from '~/lib/utils.js';
import { useDayContext } from '~/components/schedule/day-columns/day-context.js';
import { AssignmentTile } from '~/components/schedule/assignment-tile.js';
import type { Doc, Id } from 'convex/_generated/dataModel.js';

export function TaskDayCell({
  assignments,
}: {
  assignments: Array<{
    _id: string;
    caption: string;
  }>;
  scheduleTask: {
    _id: Id<'scheduleTasks'>;
    task: Pick<Doc<'tasks'>, '_id'>;
  };
}) {
  const dayContext = useDayContext();
  if (!dayContext) throw new Error('Set Day Context');
  const { isActive, isWeekend } = dayContext;

  const fetcher = useFetcher();
  const [draggingOver, setDraggingOver] = useState(false);

  // const scheduleMembersAbsent = scheduleMembers.filter(
  //   (s) => s.user.absences.length > 0
  // );
  // const scheduleMembersPresent = scheduleMembers.filter(
  //   (s) => s.user.absences.length === 0
  // );
  // const scheduleMembersPresentAndCompetent = scheduleMembersPresent.filter(
  //   ({ user }) =>
  //     user.competences.some(
  //       (competence) => competence.taskId === scheduleTask.task.id
  //     )
  // );

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          onDragOver={(event) => {
            if (event.dataTransfer.types.includes(DND_TYPES.task)) {
              // event.preventDefault()
              event.stopPropagation();
              // const transfer = JSON.parse(
              // 	event.dataTransfer.getData(DND_TYPES.task),
              // )
              setDraggingOver(true);
            }
          }}
          onDragLeave={() => {
            setDraggingOver(false);
          }}
          className={cn(
            'data-[state=open]:bg-open flex gap-1 border-b border-r border-gray-300 p-1 leading-tight',
            {
              'bg-green-500': draggingOver,
              'bg-gray-200 dark:bg-gray-900': isWeekend,
              'min-w-min': isActive,
              'px-1 pt-0.5': !isActive,
            }
          )}
        >
          {isActive ? (
            <>
              {assignments.map((assignment) => (
                <AssignmentTile assignment={assignment} key={assignment._id} />
              ))}
            </>
          ) : (
            <p>
              {assignments.map((assignment) => assignment.caption).join(', ')}
            </p>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {/* {scheduleMembersPresentAndCompetent.map((availableMember) => {
          const competence = availableMember.user.competences.find(
            (competence) => competence.taskId === scheduleTask.task.id
          );
          const nonJuniorMembers = scheduleMembers.filter((scheduleMember) =>
            scheduleMember.user.competences.some(
              (competence) =>
                competence.taskId === scheduleTask.task.id &&
                competence.level !== 'junior'
            )
          );
          return (
            <>
              {competence?.level === 'junior' ? (
                <ContextMenuSub>
                  <ContextMenuSubTrigger>
                    <span className="block">{`${availableMember.user.firstName} ${availableMember.user.lastName}`}</span>
                    <CompetenceTile
                      competence={competence}
                      size="sm"
                      className="ml-2 mr-4"
                    />
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    {nonJuniorMembers.map(
                      ({ user: { id: supervisorId, ...user } }) => {
                        const competence = user.competences.find(
                          (competence) =>
                            competence.taskId === scheduleTask.task.id
                        );
                        return (
                          <ContextMenuItem
                            // onClick={() =>
                            //   createAssignment(
                            //     {
                            //       date,
                            //       taskId: scheduleTask.task.id,
                            //       userId: availableMember.user.id,
                            //       supervisorId,
                            //     },
                            //     fetcher
                            //   )
                            // }
                            disabled={!competence}
                            key={supervisorId}
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
                  // createAssignment(
                  //   {
                  //     date,
                  //     taskId: scheduleTask.task.id,
                  //     userId: availableMember.user.id,
                  //   },
                  //   fetcher
                  // )
                  // }
                  // className={cn('flex w-full items-center justify-between', {
                  // 'pr-12': !user.absences[0],
                  // 'p-1': user.absences[0],
                  // })}
                  key={availableMember.user.id}
                >
                  <span className="block">{`${availableMember.user.firstName} ${availableMember.user.lastName}`}</span>
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
        {scheduleMembersPresent.length > 0 &&
          scheduleMembersAbsent.length > 0 && <ContextMenuSeparator />}
        {scheduleMembersAbsent.map(({ user }) => (
          <ContextMenuItem
            disabled
            className={cn('flex justify-between', {
              'pr-12': !user.absences[0],
              'p-1': user.absences[0],
            })}
            key={user.id}
          >
            {`${user.firstName} ${user.lastName}`}
            {user.absences[0] && (
              <AbsenceTypeTile absenceType={user.absences[0].absenceType} />
            )}
          </ContextMenuItem>
        ))} */}
      </ContextMenuContent>
    </ContextMenu>
  );
}
