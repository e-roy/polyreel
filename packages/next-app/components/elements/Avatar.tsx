import { useState, useEffect } from "react";
import { UserIcon } from "@heroicons/react/outline";
import { Profile } from "@/types/lenstypes";

type AvatarProps = {
  profile: Profile;
  size: string;
};

const LargeAvatar = `inline-block rounded-full h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 text-stone-500 p-1 bg-white shadow-xl`;
const MediumAvatar = `inline-block rounded-full h-16 w-16 text-stone-500 p-1 bg-white shadow-xl`;
const SmallAvatar = `inline-block rounded-full h-10 w-10  text-stone-500 p-0.5 bg-white shadow-lg`;

export const Avatar = ({ profile, size }: AvatarProps) => {
  const [avatarSize, setAvatarSize] = useState("");

  useEffect(() => {
    if (size) {
      if (size === "small") {
        setAvatarSize(SmallAvatar);
      } else if (size === "medium") {
        setAvatarSize(MediumAvatar);
      } else {
        setAvatarSize(LargeAvatar);
      }
    }
  }, [size]);

  if (!profile || avatarSize === "") return null;

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
        className={avatarSize}
      />
    );
  } else {
    return <UserIcon className={avatarSize} />;
  }
};

const checkIpfs = (url: string) => {
  if (url.startsWith("ipfs://")) {
    const ipfs = url.replace("ipfs://", "");
    return `https://ipfs.infura.io/ipfs/${ipfs}`;
  } else return url;
};
