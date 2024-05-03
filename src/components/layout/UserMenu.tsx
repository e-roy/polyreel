"use client";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext/UserContext";
import { Avatar } from "@/components/elements/Avatar";
import { Logout } from "@/components/auth/Logout";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";

import { cn } from "@/lib/utils";

export const UserMenu = () => {
  const { currentUser, profiles, defaultProfile } = useContext(UserContext);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={`outline`}
          className={`xl:w-full flex justify-start space-x-2 xl:py-6 xl:px-2 rounded-full`}
          size={`icon`}
        >
          <Avatar profile={currentUser} size={"small"} hoverable={false} />
          <div className={`hidden xl:block pr-2`}>
            <div className={`flex justify-start`}>
              {currentUser?.metadata?.displayName}
            </div>
            <div className={`flex justify-start`}>
              @{currentUser?.handle?.localName}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          {profiles?.map((profile) => (
            <div
              key={profile.id}
              className={cn("flex space-x-6", {
                "text-xl": defaultProfile?.id === profile.id,
              })}
            >
              <Avatar profile={profile} size={"xs"} hoverable={false} />
              <div className={`flex flex-col`}>
                <div>{profile.metadata?.displayName}</div>
                <div>@{profile.handle?.localName}</div>
              </div>
            </div>
          ))}
          <Logout />
        </div>
      </PopoverContent>
    </Popover>
  );
};
