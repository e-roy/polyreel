import { useContext } from "react";
import { UserContext } from "@/components/layout";
import type { NextPage } from "next";
// import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { useQuery } from "@apollo/client";
import { GET_PROFILES } from "@/queries/profile/get-profiles";

import { GetPublications } from "@/components/lens/publications";

import { TwitterIcon, WebIcon } from "@/icons";
import {
  EditProfileButton,
  FollowersButton,
  DoesFollow,
} from "@/components/profile";

import { Avatar } from "@/components/elements";

const ProfilePage: NextPage = () => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();
  const { id } = router.query;
  // console.log("currentUser", currentUser);

  const { loading, error, data, refetch } = useQuery(GET_PROFILES, {
    variables: {
      request: { handles: [id] },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  let profile = data.profiles.items[0];
  // console.log(profile);

  if (!profile) return null;
  return (
    // <div className="flex flex-col h-screen overflow-hidden">
    <div>
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <div className="-mt-14">
          {profile.coverPicture ? (
            <div className="rounded-t-xl h-64 max-h-64 w-full shadow-xl -z-10">
              <img
                src={profile.coverPicture.original.url}
                alt=""
                className="h-64 max-h-64 w-full"
                object-fit="fill"
              />
            </div>
          ) : (
            <div className="bg-gradient-to-r from-sky-600 via-purple-700 to-purple-500 h-64 max-h-64 rounded-t shadow-xl"></div>
          )}
        </div>
        <div className="sm:flex mb-4 -mt-12 sm:-mt-16">
          <div className="flex px-12">
            <Avatar profile={profile} size={"profile"} />

            <div className="mt-6 ml-6 px-2 py-1 my-auto bg-white border shadow-lg text-stone-800  rounded-xl">
              <div className="py-1 my-auto font-semibold text-md sm:text-xl md:text-2xl lg:text-3xl">
                @{profile.handle}
              </div>
              <div className="py-1 my-auto font-semibold text-sm sm:text-md md:text-xl">
                {profile.name}
              </div>
            </div>
          </div>

          <div className="flex justify-between w-full px-8">
            <div className="mt-4 sm:mt-20 sm:ml-8 flex space-x-8">
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <WebIcon size={30} />
                </a>
              )}
              {profile.twitterUrl && (
                <a
                  href={profile.twitterUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <TwitterIcon size={30} />
                </a>
              )}
            </div>
            <div className="mt-2 sm:mt-16 sm:pt-2 sm:px-6">
              {currentUser?.handle === id ? (
                <EditProfileButton />
              ) : (
                <DoesFollow profileId={profile.id} />
              )}
            </div>
          </div>
        </div>
        <div className="px-2 text-sm sm:text-base text-stone-800">
          <div className="font-semibold">
            Bio :<span className="font-normal pl-1">{profile.bio}</span>
          </div>
          <div className="font-semibold py-2">
            Location :
            <span className="font-normal pl-1">{profile.location}</span>
          </div>
          <div className="flex">
            <div className="font-semibold py-2">
              <FollowersButton
                ownedBy={profile.ownedBy}
                profileId={profile.id}
                followers={profile.stats.totalFollowers}
                following={profile.stats.totalFollowing}
              />
            </div>
          </div>
          <div className="flex">
            <div className="font-semibold py-2">
              Posts :
              <span className="font-normal pl-1">
                {profile.stats.totalPosts}
              </span>
            </div>
            <div className="font-semibold py-2 ml-4">
              Comments :
              <span className="font-normal pl-1">
                {profile.stats.totalComments}
              </span>
            </div>
            <div className="font-semibold py-2 ml-4">
              Collects :
              <span className="font-normal pl-1">
                {profile.stats.totalCollects}
              </span>
            </div>
            <div className="font-semibold py-2 ml-4">
              Mirrors :
              <span className="font-normal pl-1">
                {profile.stats.totalMirrors}
              </span>
            </div>
          </div>
        </div>

        {/* <UserTimeline profileId={profile.id} /> */}
        <GetPublications profileId={profile.id} />
      </div>
    </div>
  );
};

export default ProfilePage;
