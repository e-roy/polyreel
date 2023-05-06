import { Profile } from "@/types/graphql/generated";
import Link from "next/link";
import { Avatar } from "@/components/elements";

interface IProfileItemProps {
  profile: Profile;
}

export const ProfileItem = ({ profile }: IProfileItemProps) => {
  return (
    <Link
      href={`/profile/${profile.handle}`}
      className={`flex items-center justify-between py-3 hover:bg-stone-100`}
    >
      <div className={`flex justify-between w-full`}>
        <div className={`flex`}>
          <div>
            <Avatar profile={profile} size={`small`} />
          </div>

          <div className={`ml-4`}>
            <div className={`font-bold text-stone-800`}>{profile.name}</div>
            <div className={`text-stone-400`}>@{profile.handle}</div>
            <div className={`text-stone-600`}>{profile.bio}</div>
          </div>
        </div>
        <div>
          <button
            className={`bg-stone-500 text-white rounded-lg px-4 py-2 justify-end`}
          >
            Follow
          </button>
        </div>
      </div>
    </Link>
  );
};
