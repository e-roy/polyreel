import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/elements";

interface ProfileHeaderProps {
  profile: any;
  appId?: string;
}

export const ProfileHeader = ({ profile, appId }: ProfileHeaderProps) => {
  const [adjustBorder, setAdjustBorder] = useState("hover:shadow-stone-500");
  useEffect(() => {
    // console.log(appId);
    if (appId?.toLocaleLowerCase().includes("lenster"))
      setAdjustBorder("border-purple-600 hover:shadow-purple-600");
    if (appId?.toLocaleLowerCase() === "lenstube")
      setAdjustBorder("border-green-500 hover:shadow-green-500");

    if (appId?.toLocaleLowerCase() === "polyreel.xyz")
      setAdjustBorder("border-blue-500 hover:shadow-blue-500");
  }, [appId]);
  if (!profile) return null;
  return (
    <>
      <Link href={`/profile/${profile.handle}`}>
        <div
          className={`${adjustBorder} flex cursor-pointer hover:text-stone-900 shadow hover:shadow rounded-r-xl rounded-l-3xl border-r border-b pr-4 w-48 sm:w-52 md:w-60`}
        >
          <div>
            <Avatar profile={profile} size={"small"} />
          </div>
          <div
            className={`-mt-0.5 text-xs sm:text-sm lg:text-medium text-stone-800`}
          >
            <div className="ml-2 my-auto font-semibold">@{profile.handle}</div>
            <div className="ml-2 my-auto text-xs">{profile.name}</div>
          </div>
        </div>
      </Link>
    </>
  );
};
