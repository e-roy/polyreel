import { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";

import { Profile } from "@/types/graphql/generated";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/ui/hover-card";

type AvatarProps = {
  profile?: Profile;
  size: "xs" | "small" | "medium" | "profile";
};

const LargeAvatar = `inline-block rounded-full h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 text-stone-500 p-0.5 bg-white shadow-xl object-cover`;
const MediumAvatar = `inline-block rounded-full h-16 w-16 text-stone-500 p-0.5 bg-white shadow-xl object-cover`;
const SmallAvatar = `inline-block rounded-full h-10 w-10 md:h-10 md:w-10  text-stone-500 bg-white shadow object-cover`;
const XSAvatar = `inline-block rounded-full h-7 w-7 text-stone-500 bg-white shadow object-cover`;

export const Avatar = ({ profile, size }: AvatarProps) => {
  const [avatarSize, setAvatarSize] = useState("");

  useEffect(() => {
    if (size) {
      if (size === "xs") {
        setAvatarSize(XSAvatar);
      } else if (size === "small") {
        setAvatarSize(SmallAvatar);
      } else if (size === "medium") {
        setAvatarSize(MediumAvatar);
      } else if (size === "profile") {
        setAvatarSize(LargeAvatar);
      } else {
        setAvatarSize(LargeAvatar);
      }
    }
  }, [size]);

  if (!profile || avatarSize === "") return null;

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div
          className={
            avatarSize === LargeAvatar
              ? `h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32`
              : avatarSize === MediumAvatar
              ? `h-16 w-16`
              : avatarSize === SmallAvatar
              ? `h-10 w-10 md:h-10 md:w-10`
              : `h-7 w-7`
          }
        >
          <AvatarImage profile={profile} avatarSize={avatarSize} />
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="bg-white p-4 w-72">
          <div className={`flex`}>
            <div className={``}>
              <AvatarImage profile={profile} avatarSize={MediumAvatar} />
            </div>

            <div className={`ml-4`}>
              <div className="text-base font-semibold text-stone-800">
                {profile.name}
              </div>
              <div className="text-xs text-stone-500">@{profile.handle}</div>
            </div>
          </div>
          <div
            className={`grid grid-cols-2 my-2 text-xs text-stone-600 font-medium`}
          >
            <div className={`col-span-1`}>
              {profile.stats.totalFollowing} Following
            </div>
            <div className={`col-span-1`}>
              {profile.stats.totalFollowers} Followers
            </div>
          </div>
          <div className={`text-stone-600 text-sm`}>{profile.bio}</div>
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
  if (profile.picture?.__typename === "NftImage") {
    return (
      <img
        src={profile.picture.uri}
        alt={`@${profile.handle}`}
        className={avatarSize}
      />
    );
  } else if (profile.picture?.__typename === "MediaSet") {
    return (
      <img
        src={checkIpfs(profile?.picture.original.url)}
        alt={`@${profile.handle}`}
        className={`${avatarSize}`}
      />
    );
  } else {
    return <FaUserAlt className={avatarSize} />;
  }
};

const checkIpfs = (url: string) => {
  if (url.startsWith("ipfs://")) {
    const ipfs = url.replace("ipfs://", "");
    return `https://gateway.ipfscdn.io/ipfs/${ipfs}`;
  } else return url;
};
