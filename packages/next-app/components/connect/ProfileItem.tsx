import { Profile } from "@/types/graphql/generated";
import Link from "next/link";
import { Avatar } from "@/components/elements";
import { DoesFollow } from "@/components/profile";

interface IProfileItemProps {
  profile: Profile;
}

export const ProfileItem = ({ profile }: IProfileItemProps) => {
  return (
    <div className={`flex justify-between group hover:bg-stone-100`}>
      <Link
        href={`/profile/${profile.handle}`}
        className={`flex items-center justify-between py-3 px-6 group-hover:bg-stone-100 w-full`}
      >
        <div className={`flex justify-between w-full`}>
          <div className={`flex`}>
            <div className={``}>
              <Avatar profile={profile} size={`small`} />
            </div>

            <div className={`ml-4`}>
              <div className={`font-bold text-stone-800`}>{profile.name}</div>
              <div className={`text-stone-400`}>@{profile.handle}</div>
              <div className={`text-stone-600`}>{profile.bio}</div>
            </div>
          </div>
        </div>
      </Link>
      <div className={`pr-6 my-auto`}>
        <DoesFollow profile={profile} />
      </div>
    </div>
  );
};
