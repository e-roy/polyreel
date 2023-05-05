import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { useAccount } from "wagmi";

import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "@/queries/profile/get-profile";

import { TwitterIcon } from "@/icons";
import {
  EditProfileButton,
  FollowersButton,
  DoesFollow,
  NavSelect,
  GetUserNfts,
  GetPublications,
} from "@/components/profile";
import { GlobeAltIcon, LocationMarkerIcon } from "@heroicons/react/outline";

import { Avatar, Loading, Error } from "@/components/elements";

import { LinkItUrl, LinkItProfile } from "@/lib/links";

// import { Profile } from "@/types/graphql/generated";

import { logger } from "@/utils/logger";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [navSelect, setNavSelect] = useState("POST");

  const { address } = useAccount();

  const {
    data: profileData,
    loading,
    error,
    refetch,
  } = useQuery(GET_PROFILE, {
    variables: {
      request: { handle: id },
    },
  });

  if (loading) return <Loading />;
  if (error) return <Error />;

  const { profile } = profileData;
  if (!profile) return null;

  logger("profile/[id].tsx", profile);

  const checkLocation = () => {
    const location = filterAttributes(profile.attributes, "location");
    if (location && location[0]) return location[0].value;
  };

  const checkWebsite = () => {
    const website = filterAttributes(profile.attributes, "website");
    if (website[0]) return website[0].value;
  };

  const checkTwitter = () => {
    const twitter = filterAttributes(profile.attributes, "twitter");
    if (twitter[0]) return twitter[0].value;
  };

  // console.log(profile);
  // console.log(profileData);

  const handleRefetch = async () => {
    await refetch();
  };

  return (
    <div>
      <Head>
        <title>polyreel - {profile.name}</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <div className="-mt-14">
          {profile.coverPicture ? (
            <div
              className="h-52 sm:h-80"
              style={{
                backgroundImage: profile.coverPicture.original.url
                  ? `url(${profile.coverPicture.original.url})`
                  : "none",
                backgroundColor: "#94a3b8",
                backgroundSize: profile.coverPicture.original.url
                  ? "cover"
                  : "30%",
                backgroundPosition: "center center",
                backgroundRepeat: profile.coverPicture.original.url
                  ? "no-repeat"
                  : "repeat",
              }}
            />
          ) : (
            <div className="bg-gradient-to-r from-sky-600 via-purple-700 to-purple-500 h-64 max-h-64 rounded-t shadow-xl"></div>
          )}
        </div>
        <div className="sm:flex mb-4 -mt-12 sm:-mt-16">
          <div className="flex pl-12">
            <div>
              <Avatar profile={profile} size={"profile"} />
            </div>
            <div className="mt-6 ml-2 px-2 py-1 my-auto bg-white border shadow-lg text-stone-800  rounded-xl">
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
              {profile.attributes && checkWebsite() && (
                <a
                  href={`${checkWebsite()}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <GlobeAltIcon className="h-8 w-8 text-stone-500 hover:text-stone-700 cursor-pointer" />
                </a>
              )}
              {profile.attributes && checkTwitter() && (
                <a
                  href={`https://twitter.com/${checkTwitter()}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-stone-500 hover:text-stone-700"
                >
                  <TwitterIcon size={30} />
                </a>
              )}
            </div>
            <div className="mt-2 sm:mt-16 sm:pt-2 sm:px-6">
              {address === profile.ownedBy ? (
                <div className="flex">
                  <EditProfileButton
                    refetch={handleRefetch}
                    profile={profile}
                  />
                </div>
              ) : (
                <DoesFollow profile={profile} profileId={profile.id} />
              )}
            </div>
          </div>
        </div>
        <div className="px-2 text-sm sm:text-base text-stone-700 font-medium">
          <div className="font-bold">
            <LinkItUrl className="text-sky-600 hover:text-sky-500 z-50">
              <LinkItProfile className="text-sky-600 hover:text-sky-500 cursor-pointer">
                Bio :<span className="font-medium pl-1">{profile.bio}</span>
              </LinkItProfile>
            </LinkItUrl>
          </div>
          {checkLocation() && (
            <div className="flex font-bold py-2">
              <LocationMarkerIcon className="h-4 w-4 sm:h-5 sm:w-5 text-stone-500 hover:text-stone-700 cursor-pointer" />
              <span className="font-medium pl-1">{checkLocation()}</span>
            </div>
          )}
          <div className="sm:flex justify-between">
            <div className="font-semibold">
              <FollowersButton
                ownedBy={profile.ownedBy}
                profileId={profile.id}
                followers={profile.stats.totalFollowers}
                following={profile.stats.totalFollowing}
              />
            </div>
            <NavSelect
              select={(res) => setNavSelect(res)}
              profile={profile}
              navSelect={navSelect}
            />
            <div className="sm:w-1/6"></div>
          </div>
        </div>
        <div className="mb-12">
          {navSelect === "NFTS" && <GetUserNfts ownedBy={profile.ownedBy} />}
          {(navSelect === "POST" ||
            navSelect === "COMMENT" ||
            navSelect === "MIRROR") && (
            <GetPublications profileId={profile.id} filter={navSelect} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

const filterAttributes = (attributes: any, key: string) => {
  return attributes?.filter((attribute: any) => attribute.key === key);
};
