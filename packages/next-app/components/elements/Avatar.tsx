import { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";

import { Profile } from "@/types/graphql/generated";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/ui/hover-card";

// import * as HoverCard from "@radix-ui/react-hover-card";

type AvatarProps = {
  profile?: Profile;
  size: "xs" | "small" | "medium" | "profile";
};

const LargeAvatar = `inline-block rounded-full h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 text-stone-500 p-1 bg-white shadow-xl object-cover`;
const MediumAvatar = `inline-block rounded-full h-16 w-16 text-stone-500 p-1 bg-white shadow-xl object-cover`;
const SmallAvatar = `inline-block rounded-full h-10 w-10 md:h-10 md:w-10  text-stone-500 p-0.5 bg-white shadow-lg object-cover`;
const XSAvatar = `inline-block rounded-full h-7 w-7 text-stone-500 p-0.5 bg-white shadow-lg object-cover`;

const LargeBG = `h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32`;
const MediumBG = `h-16 w-16`;
const SmallBG = `h-10 w-10`;
const XSBG = `h-7 w-7`;

export const Avatar = ({ profile, size }: AvatarProps) => {
  const [avatarSize, setAvatarSize] = useState("");
  const [bgSize, setBgSize] = useState("");

  useEffect(() => {
    if (size) {
      if (size === "xs") {
        setAvatarSize(XSAvatar);
        setBgSize(XSBG);
      } else if (size === "small") {
        setAvatarSize(SmallAvatar);
        setBgSize(SmallBG);
      } else if (size === "medium") {
        setAvatarSize(MediumAvatar);
        setBgSize(MediumBG);
      } else if (size === "profile") {
        setAvatarSize(LargeAvatar);
        setBgSize(LargeBG);
      } else {
        setAvatarSize(LargeAvatar);
        setBgSize(LargeBG);
      }
    }
  }, [size]);

  if (!profile || avatarSize === "") return null;

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className="relative">
          <AvatarImage
            profile={profile}
            avatarSize={avatarSize}
            bgSize={bgSize}
          />
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="bg-white p-4">
          <div className={`grid grid-cols-4`}>
            <AvatarImage
              profile={profile}
              avatarSize={avatarSize}
              bgSize={bgSize}
            />
            <div className={`col-span-3`}>
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
  bgSize: string;
}

const AvatarImage = ({ profile, avatarSize, bgSize }: IAvatarImageProps) => {
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
      <div className={bgSize}>
        <img
          src={checkIpfs(profile?.picture.original.url)}
          alt={`@${profile.handle}`}
          className={avatarSize}
        />
      </div>
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
