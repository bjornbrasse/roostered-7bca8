// import { Img } from 'openimg/react'

import { Link } from "@tanstack/react-router";
import { logoutServerFn } from "~/routes/auth/logout.tsx";
import type { SessionData } from "~/utils/session.server.ts";
// import { getUserImgSrc } from '#app/utils/misc.tsx'
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
// import { Icon } from "./ui/icon";

export function UserDropdown({ user }: { user: SessionData["user"] }) {
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button asChild variant="secondary">
          <Link
            // to={`/users/${user.username}`}
            to="/route-a"
            // this is for progressive enhancement
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-2"
          >
            {/* <Img
              className="size-8 rounded-full object-cover"
              alt={user.name ?? user.username}
              src={getUserImgSrc(user.image?.objectKey)}
              width={256}
              height={256}
            /> */}
            <span className="font-bold text-body-sm">{`${user.firstName} ${user.lastName}`}</span>
          </Link>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent sideOffset={8} align="end">
          <DropdownMenuItem asChild>
            <Link preload="intent" to="/">
              {/* <Icon className="text-body-md" name="avatar"> */}
              Profile
              {/* </Icon> */}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link preload="intent" to="/">
              {/* <Icon className="text-body-md" name="pencil-2"> */}
              Notes
              {/* </Icon> */}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button
              type="button"
              onClick={() => logoutServerFn()}
              className="w-full"
            >
              {/* <Icon className="text-body-md" name="exit"> */}
              Logout
              {/* </Icon> */}
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
