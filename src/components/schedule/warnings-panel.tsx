import type { Id } from 'convex/_generated/dataModel.js';
import { type Dayjs } from 'dayjs';

type UnplannedTask = { id: Id<'tasks'>; name: string };

export function WarningsPanel({
  date,
  unplannedTasks,
}: {
  date?: Dayjs;
  unplannedTasks: Array<UnplannedTask>;
}) {
  return (
    <div className="h-full">
      <h2>Waarschuwingen</h2>
      <p>{date?.format('dddd D MMMM')}</p>
      <div className="flex flex-col gap-2">
        {unplannedTasks.map((task) => (
          <TaskItem task={task} key={task.id} />
        ))}
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: UnplannedTask }) {
  return (
    <div className="cursor-pointer select-none rounded-md bg-gray-200 p-2">
      {task.name}
    </div>
  );
}
