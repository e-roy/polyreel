import { UserIcon } from "@heroicons/react/outline";

type AvatarProps = {
  profile: any;
  size?: number;
};

export const Avatar = ({ profile, size }: AvatarProps) => {
  return (
    <>
      {profile.picture ? (
        <div
          className={`h-20 sm:h-28 md:h-${size} w-20 sm:w-28 md:w-${size} relative rounded-full border-4 border-white shadow-xl`}
        >
          <img
            src={profile.picture.original.url}
            alt={`@${profile.handle}`}
            className={`rounded-full h-20 sm:h-28 md:h-${size}`}
          />
        </div>
      ) : (
        <div
          className={`flex justify-center h-20 sm:h-28 md:h-${size} w-20 sm:w-28 md:w-${size} rounded-full border-4 border-white bg-stone-200 shadow-xl`}
        >
          <UserIcon
            className={`h-16 sm:h-24 md:h-28 w-16 sm:w-24 md:w-28 text-stone-500`}
          />
        </div>
      )}
    </>
  );
};
