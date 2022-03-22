import React from "react";
import { TwitterIcon, WebIcon } from "@/icons";

export const ProfileCard = ({ profile }: any) => {
  return (
    <div
      className="m-2 p-2 border border-stone-600 rounded w-full h-full text-sm cursor-pointer hover:shadow-xl"
      // onClick={() => setProfileId(profile.id)}
    >
      <div className="h-20">
        {profile.coverPicture && (
          <img
            src={profile.coverPicture.original.url}
            alt=""
            className="rounded-lg"
            height={40}
          />
        )}
      </div>
      <div className="flex mb-4 -mt-6">
        {profile.picture ? (
          <div className="h-12 w-12 relative rounded-full border-2 cursor-pointer">
            <img
              src={profile.picture.original.url}
              alt=""
              className="rounded-full"
            />
          </div>
        ) : (
          <div className="rounded-full h-12 w-12 bg-gray-300 border-2"></div>
        )}
        <div className="ml-2 my-auto font-semibold bg-white px-1 rounded-xl">
          {profile.handle}
        </div>
      </div>

      <div className="text-xs italic">id: {profile.id}</div>
      <div className="font-semibold">
        Bio :<span className="font-normal">{profile.bio}</span>
      </div>
      <div className="font-semibold">
        Location : <span className="font-normal">{profile.location}</span>
      </div>
      <div className="my-2 flex space-x-4">
        {profile.website && (
          <a href={profile.website} target="_blank" rel="noreferrer noopener">
            <WebIcon size={20} />
          </a>
        )}
        {profile.twitterUrl && (
          <a
            href={profile.twitterUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            <TwitterIcon size={20} />
          </a>
        )}
      </div>

      {/* <div className="p-2 border border-stone-600 rounded text-xs space-y-auto">
        <div className="font-semibold">Stats</div>
        <div>Collects : {profile.stats.totalCollects}</div>
        <div>Comments : {profile.stats.totalComments}</div>
        <div>Followers : {profile.stats.totalFollowers}</div>
        <div>Following : {profile.stats.totalFollowing}</div>
        <div>Mirrors : {profile.stats.totalMirrors}</div>
        <div>Posts : {profile.stats.totalPosts}</div>
        <div>Publications : {profile.stats.totalPublications}</div>
      </div> */}
    </div>
  );
};
