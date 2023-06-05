"use client";
// components/elements/Avatar.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserAlt } from "react-icons/fa";

import { Profile } from "@/types/graphql/generated";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { checkIpfsUrl } from "@/utils/check-ipfs-url";
import { checkFollowerCount } from "@/utils/check-follower-count";

type AvatarProps = {
  profile?: Profile;
  size: "xs" | "small" | "medium" | "profile";
  loading?: boolean;
  href?: string;
};

const avatarSizeMap = {
  xs: `inline-block rounded-full h-7 w-7 text-stone-500 bg-white shadow object-cover`,
  small: `inline-block rounded-full h-10 w-10 md:h-10 md:w-10  text-stone-500 bg-white shadow object-cover`,
  medium: `inline-block rounded-full h-16 w-16 text-stone-500 p-0.5 bg-white dark:bg-stone-950 shadow-xl object-cover`,
  profile: `inline-block rounded-full h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 text-stone-500 p-0.5 bg-white dark:bg-stone-950 shadow-xl object-cover`,
};

export const Avatar = ({ profile, size, loading, href }: AvatarProps) => {
  const router = useRouter();
  const [avatarSize, setAvatarSize] = useState("");

  useEffect(() => {
    setAvatarSize(avatarSizeMap[size] || avatarSizeMap["profile"]);
  }, [size]);

  if (!profile || avatarSize === "") return null;

  if (loading) {
    const pulseSize = avatarSize
      .match(/(h-\d+ w-\d+)/g)?.[0]
      .concat(" animate-pulse");

    return (
      <div className={pulseSize}>
        <div className="rounded-full bg-stone-300 h-10 w-10"></div>
      </div>
    );
  }

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (href) {
      router.push(href);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (href) {
        router.push(href);
      }
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div
          role="link"
          tabIndex={0}
          aria-label={`Profile of ${profile.name}`}
          className={avatarSize}
          onClick={handleClick}
          onKeyDown={handleKeyPress}
        >
          <AvatarImage profile={profile} avatarSize={avatarSize} />
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="bg-white p-4 w-72 rounded dark:bg-stone-900">
          <div className={`flex`}>
            <div className={``}>
              <AvatarImage
                profile={profile}
                avatarSize={avatarSizeMap["medium"]}
              />
            </div>

            <div className={`ml-4`}>
              <div className="text-base font-semibold text-stone-800 dark:text-stone-100">
                {profile.name}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-300">
                @{profile.handle}
              </div>
            </div>
          </div>
          <div
            className={`grid grid-cols-2 my-2 text-xs text-stone-600 dark:text-stone-200 font-medium`}
          >
            <div className={`col-span-1`}>
              {checkFollowerCount(profile?.stats?.totalFollowing)} Following
            </div>
            <div className={`col-span-1`}>
              {checkFollowerCount(profile?.stats?.totalFollowers)} Followers
            </div>
          </div>
          <div className={`text-stone-600 dark:text-stone-200 text-sm`}>
            {profile.bio}
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

const AvatarImage = ({ profile, avatarSize }: IAvatarImageProps) => {
  const imageElement = (
    <>
      {profile.picture?.__typename === "NftImage" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.picture.uri}
          alt={`@${profile.handle}`}
          className={`${avatarSize} cursor-pointer`}
        />
      ) : profile.picture?.__typename === "MediaSet" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={checkIpfsUrl(profile?.picture.original.url)}
          alt={`@${profile.handle}`}
          className={`${avatarSize} cursor-pointer`}
        />
      ) : (
        <FaUserAlt className={avatarSize} />
      )}
    </>
  );
  return imageElement;
};
