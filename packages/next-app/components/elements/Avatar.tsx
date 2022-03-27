import { UserIcon } from "@heroicons/react/outline";

type AvatarProps = {
  profile: any;
  size: string;
};

export const Avatar = ({ profile, size }: AvatarProps) => {
  // console.log(profile.picture?.original.url);

  if (profile?.picture?.original.url === "") return null;
  if (
    profile?.picture?.original.url.startsWith(
      "https://statics-mumbai-lens.s3.amazonaws.com/profile"
    )
  )
    return null;

  return <AvatarIcon profile={profile} size={size} />;
};

const AvatarIcon = ({ profile, size }: AvatarProps) => {
  if (size === "profile") {
    return (
      <>
        {profile?.picture ? (
          <div
            className={`h-20 sm:h-28 md:h-32 w-20 sm:w-28 md:w-32 relative rounded-full border-4 border-white shadow-xl`}
          >
            <img
              src={profile?.picture.original.url}
              alt={`@${profile.handle}`}
              className={`rounded-full h-20 sm:h-28 md:h-32`}
            />
          </div>
        ) : (
          <div
            className={`flex justify-center h-20 sm:h-28 md:h-32 w-20 sm:w-28 md:w-32 rounded-full border-4 border-white bg-stone-200 shadow-xl`}
          >
            <UserIcon
              className={`h-18 sm:h-26 md:h-30 w-18 sm:w-26 md:w-30 text-stone-500`}
            />
          </div>
        )}
      </>
    );
  } else if (size === "medium") {
    return (
      <>
        {profile?.picture && profile.picture.original.url ? (
          <div
            className={`h-12 sm:h-12 md:h-12 w-12 sm:w-12 md:w-12 relative rounded-full border-4 border-white shadow-xl`}
          >
            <img
              src={profile?.picture.original.url}
              alt={`@${profile.handle}`}
              className={`rounded-full h-12 sm:h-12 md:h-12`}
            />
          </div>
        ) : (
          <div
            className={`flex justify-center h-12 sm:h-12 md:h-16 w-12 sm:w-12 md:w-16 rounded-full border-4 border-white bg-stone-200 shadow-xl`}
          >
            <UserIcon
              className={`h-10 sm:h-10 md:h-12 w-10 sm:w-10 md:w-12 text-stone-500`}
            />
          </div>
        )}
      </>
    );
  } else if (size === "small") {
    return (
      <>
        {profile?.picture && profile.picture.original.url ? (
          <div
            className={`h-12 relative rounded-full border-4 border-white shadow-xl`}
          >
            <img
              src={profile?.picture.original.url}
              alt={`@${profile.handle}`}
              className={`rounded-full h-12 w-12`}
            />
          </div>
        ) : (
          <div
            className={`flex justify-center h-10 w-10  rounded-full border-4 border-white bg-stone-200 shadow-xl`}
          >
            <UserIcon className={`h-10 w-10  text-stone-500`} />
          </div>
        )}
      </>
    );
  } else return null;
};
