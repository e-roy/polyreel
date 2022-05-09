import React, { useContext, useState } from "react";
import { UserContext } from "@/components/layout";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { useQuery } from "@apollo/client";
import { GET_PROFILES } from "@/queries/profile/get-profiles";

import { TwitterIcon, WebIcon } from "@/icons";
import {
  EditProfileButton,
  FollowersButton,
  DoesFollow,
  NavSelect,
  GetUserNfts,
  GetPublications,
} from "@/components/profile";

import { Avatar, Loading } from "@/components/elements";

import { LinkItUrl, LinkItProfile } from "@/lib/links";

const ProfilePage: NextPage = () => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();
  const { id } = router.query;
  const [navSelect, setNavSelect] = useState("POST");

  const { loading, error, data, refetch } = useQuery(GET_PROFILES, {
    variables: {
      request: { handles: [id] },
    },
  });

  // console.log(error);

  if (loading) return <Loading />;
  if (error) return <p>Error :(</p>;

  const checkWebsite = (url: string) => {
    // console.log(handle);
    return url;
  };

  const checkTwitter = (handle: string) => {
    // console.log(handle);
    return handle;
  };

  let profile = data.profiles.items[0];

  if (!profile) return null;
  // console.log(data);

  const handleRefetch = async () => {
    await refetch();
  };

  return (
    <div>
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <div className="-mt-14">
          {profile.coverPicture ? (
            <div className="flex justify-center h-64 max-h-64 w-full shadow-xl -z-10 bg-stone-900/50">
              <img
                src={profile.coverPicture.original.url}
                alt=""
                className="h-64"
                object-fit=""
              />
            </div>
          ) : (
            <div className="bg-gradient-to-r from-sky-600 via-purple-700 to-purple-500 h-64 max-h-64 rounded-t shadow-xl"></div>
          )}
        </div>
        <div className="sm:flex mb-4 -mt-12 sm:-mt-16">
          <div className="flex pl-12">
            <Avatar profile={profile} size={"profile"} />
            <div className="w-24"></div>
            <div className="mt-6 px-2 py-1 my-auto bg-white border shadow-lg text-stone-800  rounded-xl">
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
                  href={`${checkWebsite(profile.website)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <WebIcon size={30} />
                </a>
              )}
              {profile.twitter && (
                <a
                  href={`https://twitter.com/${checkTwitter(profile.twitter)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <TwitterIcon size={30} />
                </a>
              )}
            </div>
            <div className="mt-2 sm:mt-16 sm:pt-2 sm:px-6">
              {currentUser?.handle === id ? (
                <EditProfileButton refetch={handleRefetch} />
              ) : (
                <DoesFollow profileId={profile.id} />
              )}
            </div>
          </div>
        </div>
        <div className="px-2 text-sm sm:text-base text-stone-700 font-medium">
          {/* {profile.id} */}
          <div className="font-bold">
            <LinkItUrl className="text-sky-600 hover:text-sky-500 z-50">
              <LinkItProfile className="text-sky-600 hover:text-sky-500 cursor-pointer">
                Bio :<span className="font-medium pl-1">{profile.bio}</span>
              </LinkItProfile>
            </LinkItUrl>
          </div>
          <div className="font-bold py-2">
            Location :
            <span className="font-medium pl-1">{profile.location}</span>
          </div>
          <div className="sm:flex justify-between">
            <div className="font-semibold">
              <FollowersButton
                ownedBy={profile.ownedBy}
                profileId={profile.id}
                followers={profile.stats.totalFollowers}
                following={profile.stats.totalFollowing}
              />
            </div>
            <NavSelect select={(res) => setNavSelect(res)} profile={profile} />
            <div className="sm:w-1/6"></div>
          </div>
        </div>
        {navSelect === "NFTS" && <GetUserNfts ownedBy={profile.ownedBy} />}
        {(navSelect === "POST" ||
          navSelect === "COMMENT" ||
          navSelect === "MIRROR") && (
          <GetPublications profileId={profile.id} filter={navSelect} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
