import type { Id } from 'convex/_generated/dataModel.js';
import { Link, useSearchParams } from 'react-router';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '~/components/ui/context-menu.js';

export function MemberRow({
  scheduleMember,
}: {
  scheduleMember: {
    user: { _id: Id<'users'>; firstName: string; lastName: string };
  };
}) {
  const [searchParams] = useSearchParams();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className="data-[state=open]:bg-background-selected sticky left-0 flex min-w-48 items-end border border-gray-300 bg-white px-2 pb-0.5 pt-1.5 dark:bg-background"
          style={{ borderRight: '4px solid #155e75' }}
          draggable
        >
          {`${scheduleMember.user.firstName} ${scheduleMember.user.lastName}`}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <Link
          to={`schedule-members/${scheduleMember.user._id}?${searchParams.toString()}`}
        >
          <ContextMenuItem>Bewerken</ContextMenuItem>
        </Link>
      </ContextMenuContent>
    </ContextMenu>
  );
}
