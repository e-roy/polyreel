import { Profile } from "@/types/graphql/generated";
import { Avatar } from "@/components/elements";
import { DoesFollow } from "@/components/profile";
import { useRouter } from "next/navigation";

interface IProfileItemProps {
  profile: Profile;
}

export const ProfileItem = ({ profile }: IProfileItemProps) => {
  const router = useRouter();
  if (!profile) return null;
  return (
    <div
      className={`flex justify-between group hover:bg-stone-100 dark:hover:bg-stone-700`}
    >
      <div
        role="link"
        tabIndex={0}
        aria-label={`Profile of ${profile?.name}`}
        onClick={() => router.push(`/profile/${profile?.handle}`)}
        className={`flex items-center justify-between py-3 px-6 group-hover:bg-stone-100 dark:group-hover:bg-stone-700 w-full cursor-pointer`}
      >
        <div className={`flex justify-between w-full`}>
          <div className={`flex`}>
            <div className={``}>
              <Avatar
                profile={profile}
                size={`small`}
                href={`/profile/${profile?.handle}`}
              />
            </div>

            <div className={`ml-4`}>
              <div className={`font-bold text-stone-800 dark:text-stone-100`}>
                {profile?.name} {profile?.id}
              </div>
              <div className={`text-stone-400 dark:text-stone-200`}>
                @{profile?.handle}
              </div>
              <div className={`text-stone-600 dark:text-stone-400`}>
                {profile?.bio}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`pr-6 my-auto`}>
        <DoesFollow profile={profile} />
      </div>
    </div>
  );
};
