"use client";
// components/elements/Avatar.tsx

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { Profile } from "@/types/graphql/generated";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { checkIpfsUrl } from "@/utils/check-ipfs-url";
import { checkFollowerCount } from "@/utils/check-follower-count";
import { UserIcon } from "lucide-react";
import React from "react";

type AvatarProps = {
  profile?: Profile;
  size: "xs" | "small" | "medium" | "profile";
  loading?: boolean;
  href?: string;
  hoverable?: boolean;
};

const avatarSizeMap = {
  xs: "inline-block rounded-full h-7 w-7 text-stone-500 bg-stone-50 dark:bg-stone-900 shadow-md object-cover",
  small:
    "inline-block rounded-full h-8 w-8 md:h-10 md:w-10 text-stone-500 bg-stone-50 dark:bg-stone-900 shadow-md object-cover",
  medium:
    "inline-block rounded-full h-16 w-16 text-stone-500 p-0.5 bg-stone-50 dark:bg-stone-900 shadow-md object-cover",
  profile:
    "inline-block rounded-full h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 text-stone-500 p-0.5 bg-stone-50 dark:bg-stone-900 shadow-md object-cover",
};

export const Avatar = ({
  profile,
  size,
  loading,
  href,
  hoverable = true,
}: AvatarProps) => {
  const router = useRouter();
  const avatarSize = avatarSizeMap[size] || avatarSizeMap["profile"];

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (href) {
        router.push(href);
      }
    },
    [href, router]
  );

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (href) {
          router.push(href);
        }
      }
    },
    [href, router]
  );

  if (!profile || !avatarSize) return null;

  if (loading) {
    const pulseSize = avatarSize
      .match(/(h-\d+ w-\d+)/g)?.[0]
      .concat("animate-pulse");

    return (
      <div className={pulseSize}>
        <div className="rounded-full h-10 w-10"></div>
      </div>
    );
  }

  if (!hoverable) {
    return (
      <div
        tabIndex={0}
        aria-label={`Profile of ${profile.metadata?.displayName}`}
        className={avatarSize}
      >
        <AvatarImage profile={profile} avatarSize={avatarSize} />
      </div>
    );
  }
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div
          role="link"
          tabIndex={0}
          aria-label={`Profile of ${profile.metadata?.displayName}`}
          className={avatarSize}
          onClick={handleClick}
          onKeyDown={handleKeyPress}
        >
          <AvatarImage profile={profile} avatarSize={avatarSize} />
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="bg-white p-4 w-72 rounded dark:bg-stone-900">
          <div className="flex">
            <div>
              <AvatarImage
                profile={profile}
                avatarSize={avatarSizeMap["medium"]}
              />
            </div>

            <div className="ml-4">
              <div className="text-base font-semibold text-stone-800 dark:text-stone-100">
                {profile.metadata?.displayName}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-300">
                @{profile.handle?.localName}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 my-2 text-xs text-stone-600 dark:text-stone-200 font-medium">
            <div className="col-span-1">
              {checkFollowerCount(profile?.stats?.following)} Following
            </div>
            <div className="col-span-1">
              {checkFollowerCount(profile?.stats?.followers)} Followers
            </div>
          </div>
          <div className="text-stone-600 dark:text-stone-200 text-sm">
            {profile.metadata?.bio}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

interface IAvatarImageProps {
  profile: Profile;
  avatarSize: string;
}

export const AvatarImage = React.memo(function AvatarImage({
  profile,
  avatarSize = "h-24 w-24",
}: IAvatarImageProps) {
  if (!profile) return null;

  const metadata = profile.metadata;

  if (!metadata || !metadata.picture) {
    return <UserIcon className={`${avatarSize} md rounded-full relative`} />;
  }

  const picture = metadata.picture;

  if (picture?.__typename === "ImageSet") {
    const optimizedUri = picture.optimized?.uri;
    if (optimizedUri) {
      return (
        <img
          src={checkIpfsUrl(optimizedUri)}
          alt={`@${profile.handle?.localName}`}
          className={`${avatarSize} md rounded-full relative`}
        />
      );
    }
  }

  if (picture?.__typename === "NftImage") {
    const rawUri = picture.image.raw.uri;
    if (rawUri) {
      return (
        <img
          src={rawUri}
          alt={`@${profile.handle?.localName}`}
          className={`${avatarSize} md rounded-full relative`}
        />
      );
    }
  }

  return null;
});
