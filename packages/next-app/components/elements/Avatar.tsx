import { useState, useEffect } from "react";
import { UserIcon } from "@heroicons/react/outline";
import { Profile } from "@/types/lenstypes";

type AvatarProps = {
  profile?: Profile;
  size: string;
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
    return <UserIcon className={avatarSize} />;
  }
};

const checkIpfs = (url: string) => {
  if (url.startsWith("ipfs://")) {
    const ipfs = url.replace("ipfs://", "");
    return `https://ipfs.infura.io/ipfs/${ipfs}`;
  } else return url;
};
