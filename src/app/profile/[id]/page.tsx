"use client";
// pages/profile/[id]/page.tsx

import React, { useState } from "react";

import { useAccount } from "wagmi";

import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "@/graphql/profile/get-profile";

import { FaTwitter, FaGlobeAmericas } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import {
  EditProfileButton,
  DoesFollow,
  NavSelect,
  GetUserNfts,
  GetPublications,
} from "@/components/profile";

import { Avatar, Loading, Error } from "@/components/elements";

import { LinkItUrl, LinkItProfile } from "@/lib/links";

import { checkIpfsUrl } from "@/utils/check-ipfs-url";
import { checkFollowerCount } from "@/utils/check-follower-count";

import { logger } from "@/utils/logger";
import Link from "next/link";

const endSuffix = process.env.NODE_ENV === "production" ? ".lens" : ".test";

const filterAttributes = (
  attributes: Attribute[],
  key: string
): Attribute[] => {
  return attributes?.filter((attribute) => attribute.key === key);
};

interface Props {
  params: {
    id: string;
  };
}

interface Attribute {
  key: string;
  value: string;
}

const ProfilePage = ({ params }: Props) => {
  const id =
    typeof params.id === "string" && !params.id.endsWith(endSuffix)
      ? `${params.id}` + endSuffix
      : params.id;

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
    skip: !id,
  });

  if (loading) return <Loading />;
  if (error) return <Error />;

  if (!profileData) return null;

  const { profile } = profileData;

  // TODO: need a screen for no profile found
  if (!profile) return <>profile not found</>;

  logger("profile/[id].tsx", profile);

  const checkAttribute = (key: string) => {
    const attribute = filterAttributes(profile.attributes, key);
    if (attribute && attribute[0]) return attribute[0].value;
  };

  const location = checkAttribute("location");
  const website = checkAttribute("website");
  const twitter = checkAttribute("twitter");

  const handleRefetch = async () => {
    await refetch();
  };

  return (
    <div>
      <div className="-mt-14">
        {profile.coverPicture && profile.coverPicture.original.url ? (
          <div
            className="h-52 sm:h-80"
            style={{
              backgroundImage: profile.coverPicture.original.url
                ? `url(${checkIpfsUrl(profile.coverPicture.original.url)})`
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
          <div
            className={`bg-gradient-to-r from-sky-600 via-purple-700 to-purple-500 h-56 rounded-t shadow-xl`}
          ></div>
        )}
      </div>

      <div className="flex mb-4 -mt-12 sm:-mt-16 w-full justify-between">
        <div className="ml-12">
          <Avatar profile={profile} size={"profile"} loading={loading} />
        </div>

        <div className="flex space-x-6">
          <div className="mt-16 pt-2 sm:pt-1 sm:mt-20 flex space-x-8">
            {profile.attributes && website && (
              <a href={`${website}`} target="_blank" rel="noreferrer noopener">
                <FaGlobeAmericas className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-stone-500 hover:text-stone-700 dark:text-stone-300 dark:hover:text-stone-200" />
              </a>
            )}
            {profile.attributes && twitter && (
              <a
                href={`https://twitter.com/${twitter}`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-stone-500 hover:text-stone-700"
              >
                <FaTwitter className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-stone-500 hover:text-stone-700 dark:text-stone-300 dark:hover:text-stone-200" />
              </a>
            )}
          </div>
          <div className="mt-16 sm:mt-20 px-2 sm:px-6">
            {address === profile.ownedBy ? (
              <EditProfileButton refetch={handleRefetch} profile={profile} />
            ) : (
              <DoesFollow profile={profile} />
            )}
          </div>
        </div>
      </div>
      <div className="px-2 text-sm sm:text-base text-stone-700 dark:text-stone-300 font-medium">
        <div className={`pb-4`}>
          <div className="font-bold text-stone-900 dark:text-stone-100 text-md md:text-lg lg:text-xl">
            {profile.name}
          </div>
          <div className="font-medium text-xs sm:text-sm md:text-md text-stone-500 dark:text-stone-400">
            @{profile.handle}
          </div>
        </div>
        <div className="font-bold">
          <LinkItUrl className="text-sky-600 hover:text-sky-500 z-50">
            <LinkItProfile className="text-sky-600 hover:text-sky-500 cursor-pointer">
              <span className="font-medium pl-1">{profile.bio}</span>
            </LinkItProfile>
          </LinkItUrl>
        </div>
        {location && (
          <div className="flex font-bold py-2">
            <MdLocationOn className="h-4 w-4 sm:h-5 sm:w-5 text-stone-500 hover:text-stone-700 cursor-pointer" />
            <span className="font-medium pl-1">{location}</span>
          </div>
        )}
        <div className="sm:flex justify-between">
          <div className="flex bg-transparent space-x-4 font-semibold">
            <Link
              href={`/profile/${profile.handle}/following`}
              className="font-semibold py-2 hover:underline"
            >
              {checkFollowerCount(profile.stats.totalFollowing)}{" "}
              <span
                className={`text-stone-500 dark:text-stone-400 font-normal`}
              >
                Following
              </span>
            </Link>
            <Link
              href={`/profile/${profile.handle}/followers`}
              className="font-semibold py-2 hover:underline"
            >
              {checkFollowerCount(profile.stats.totalFollowers)}{" "}
              <span
                className={`text-stone-500 dark:text-stone-400 font-normal`}
              >
                Followers
              </span>
            </Link>
          </div>
        </div>
      </div>
      <NavSelect
        select={(res) => setNavSelect(res)}
        profile={profile}
        navSelect={navSelect}
      />
      <div className="mb-12">
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
