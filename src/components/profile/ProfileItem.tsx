"use client";
// search/_components/ProfileItem.tsx

import { Profile } from "@/types/graphql/generated";
import { Avatar } from "@/components/elements/Avatar";
import { useRouter } from "next/navigation";
import { useCallback, memo } from "react";

interface IProfileItemProps {
  profile: Profile;
}

const ProfileItem = memo(({ profile }: IProfileItemProps) => {
  const router = useRouter();

  const redirectToProfile = useCallback(() => {
    if (profile?.handle?.localName) {
      router.push(`/profile/${profile.handle.localName}`);
    }
  }, [router, profile?.handle?.localName]);

  if (!profile) return null;

  const { metadata, handle } = profile;

  return (
    <div className="flex justify-between group hover:bg-stone-100 dark:hover:bg-stone-700">
      <button
        type="button"
        aria-label={`View profile of ${metadata?.displayName}`}
        onClick={redirectToProfile}
        className="flex items-start py-3 px-6 group-hover:bg-stone-100 dark:group-hover:bg-stone-700 w-full cursor-pointer text-left"
      >
        <div className="flex space-x-6">
          <Avatar
            profile={profile}
            size="small"
            href={`/profile/${handle?.localName}`}
          />
          <div className="w-full">
            <div className="font-bold text-stone-800 dark:text-stone-100">
              {metadata?.displayName}
            </div>
            <div className="text-stone-400 dark:text-stone-200">
              @{handle?.localName}
            </div>
            <div className="text-stone-600 dark:text-stone-400">
              {metadata?.bio}
            </div>
          </div>
        </div>
      </button>
      <div className="pr-6 my-auto"></div>
    </div>
  );
});

ProfileItem.displayName = "ProfileItem";

export { ProfileItem };
