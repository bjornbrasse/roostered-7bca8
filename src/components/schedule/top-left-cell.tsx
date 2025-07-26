import { Link, useSearchParams } from 'react-router';
import { Button } from '~/components/ui/button.js';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
} from '~/components/ui/dropdown-menu.js';
import {
  EllipsisVerticalIcon,
  BuildingIcon,
  CogIcon,
  SquareCheckBigIcon,
  UserRoundIcon,
} from 'lucide-react';

export function TopLeftCell({ view }: { view: 'members' | 'tasks' }) {
  const [searchParams, setSearchParams] = useSearchParams();

  function setView(view: 'members' | 'tasks') {
    setSearchParams((v) => {
      v.set('view', view);
      return v;
    });
  }

  return (
    <div className="sticky left-0 top-0 z-50 row-span-4 flex min-w-48 items-end justify-between border-r-4 border-cyan-700 bg-white p-2 pr-1 dark:bg-background">
      <div className="flex items-end gap-3">
        <h2 className="text-xl font-bold">
          {view === 'tasks' ? 'Taken' : 'Leden'}
        </h2>
        {view === 'members' ? (
          <Button
            onClick={() => setView('tasks')}
            variant="default"
            size="sm"
            className="mb-0.5"
          >
            <SquareCheckBigIcon size={18} />
          </Button>
        ) : (
          <Button
            onClick={() => setView('members')}
            variant="default"
            size="sm"
            className="mb-0.5"
          >
            <UserRoundIcon size={20} />
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex size-8 items-center justify-center">
          <EllipsisVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent sideOffset={8} align="end">
            <DropdownMenuItem asChild>
              <Link
                prefetch="intent"
                to={
                  view === 'tasks'
                    ? `schedule-tasks/new?${searchParams.toString()}`
                    : `schedule-members/select?${searchParams.toString()}`
                }
              >
                <BuildingIcon className="mr-2" />
                Nieuw
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Weergave</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuCheckboxItem
                  className="data-[disabled]:text-mauve8 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none text-cyan-700 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-cyan-50 data-[highlighted]:text-cyan-700"
                  checked={true}
                  onCheckedChange={(checked) => console.log('Hahaha', checked)}
                >
                  Weeknummers
                  <div className="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white">
                    ⌘+W
                  </div>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  className="data-[disabled]:text-mauve8 group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none text-cyan-700 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-cyan-50 data-[highlighted]:text-cyan-700"
                  checked={true}
                  onCheckedChange={(checked) => console.log('Hahaha', checked)}
                >
                  Maanden
                  <div className="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white">
                    ⌘+M
                  </div>
                </DropdownMenuCheckboxItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem
              onClick={() => {
                const sp = new URLSearchParams(searchParams);
                sp.set('view', view === 'members' ? 'task' : 'member');
                setSearchParams(sp, { replace: true });
              }}
            >
              <CogIcon className="mr-2" />
              {view === 'members' ? 'Groupeer Taken' : 'Groupeer Leden'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  );
}
