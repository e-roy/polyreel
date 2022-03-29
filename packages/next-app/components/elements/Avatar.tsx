import { UserIcon } from "@heroicons/react/outline";

type AvatarProps = {
  profile: any;
  size: string;
};

export const Avatar = ({ profile, size }: AvatarProps) => {
  if (profile?.picture?.original.url === "") return null;
  if (
    profile?.picture?.original.url.startsWith(
      "https://statics-mumbai-lens.s3.amazonaws.com/profile"
    )
  )
    return null;

  return <AvatarIcon profile={profile} size={size} />;
};

const checkIpfs = (url: string) => {
  if (url.startsWith("ipfs://")) {
    const ipfs = url.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${ipfs}`;
  } else return url;
};

const AvatarIcon = ({ profile, size }: AvatarProps) => {
  if (size === "profile") {
    return (
      <>
        {profile?.picture ? (
          <img
            src={checkIpfs(profile?.picture.original.url)}
            alt={`@${profile.handle}`}
            className={`inline-block rounded-full h-20 sm:h-24 md:h-32 w-20 sm:w-24 md:w-32 p-1 bg-white shadow-xl`}
          />
        ) : (
          <UserIcon
            className={`inline-block rounded-full h-20 sm:h-24 md:h-32 w-20 sm:w-24 md:w-32 text-stone-500 p-1 bg-white shadow-xl`}
          />
        )}
      </>
    );
  } else if (size === "medium") {
    return (
      <>
        {profile?.picture && profile.picture.original.url ? (
          <img
            src={checkIpfs(profile?.picture.original.url)}
            alt={`@${profile.handle}`}
            className={`inline-block rounded-full h-16 w-16 p-1 bg-white shadow-xl`}
          />
        ) : (
          <UserIcon
            className={`inline-block rounded-full h-16 w-16 text-stone-500 p-1 bg-white shadow-xl`}
          />
        )}
      </>
    );
  } else if (size === "small") {
    return (
      <>
        {profile?.picture && profile.picture.original.url ? (
          <img
            src={checkIpfs(profile?.picture.original.url)}
            alt={`@${profile.handle}`}
            className={`inline-block rounded-full h-10 w-10 p-0.5 bg-white shadow-xl`}
          />
        ) : (
          <UserIcon
            className={`inline-block rounded-full h-10 w-10  text-stone-500 p-0.5 bg-white shadow-xl`}
          />
        )}
      </>
    );
  } else return null;
};
