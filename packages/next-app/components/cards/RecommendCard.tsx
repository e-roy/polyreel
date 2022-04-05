import React from "react";
import { Avatar } from "@/components/elements";

export const RecommendCard = ({ profile }: any) => {
  return (
    <div className="mb-2 p-2 border border-stone-400 shadow rounded w-full text-sm cursor-pointer hover:shadow-xl">
      <div className="flex justify-between mb-2 pr-4">
        <div className="flex">
          <Avatar profile={profile} size={"small"} />
          <div className="ml-4 px-2 py-1 my-auto text-stone-800  rounded-xl">
            <div className="my-auto font-semibold text-lg">
              @{profile.handle}
            </div>
            <div className="my-auto font-semibold text-xs">{profile.name}</div>
          </div>
        </div>
        <div></div>
      </div>
      {profile.bio && (
        <div className="text-stone-700 font-medium line-clamp-3">
          Bio : <span className="font-normal">{profile.bio}</span>
        </div>
      )}

      <div className="flex">
        <div className="font-semibold">
          Following :
          <span className="font-normal pl-1">
            {profile.stats.totalFollowing}
          </span>
        </div>
        <div className="font-semibold  ml-4">
          Followers :
          <span className="font-normal pl-1">
            {profile.stats.totalFollowers}
          </span>
        </div>
      </div>
    </div>
  );
};
