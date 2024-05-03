"use client";

import React, { useContext } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";

import { Maybe, Profile } from "@/types/graphql/generated";

import { EditProfileButton } from "./edit/EditProfileButton";
import { FollowProfileButton } from "./FollowProfileButton";
import { UnFollowProfileButton } from "./UnFollowProfileButton";

import { Avatar } from "@/components/elements/Avatar";

import { LinkItUrl, LinkItProfile } from "@/lib/links";

import { checkIpfsUrl } from "@/utils/check-ipfs-url";
import { checkFollowerCount } from "@/utils/check-follower-count";

import { FaTwitter, FaGlobeAmericas } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

import { MetadataAttribute } from "@/types/graphql/generated";
import { UserContext } from "@/context/UserContext/UserContext";

interface ProfileHeaderProps {
  profile: Profile;
  loading: boolean;
  refetch: () => void;
}

export const ProfileHeader = ({
  profile,
  loading,
  refetch,
}: ProfileHeaderProps) => {
  const { verified } = useContext(UserContext);

  const { address } = useAccount();

  if (!profile) return null;

  const filterAttributes = (
    attributes: Maybe<MetadataAttribute[]> | undefined,
    key: string
  ): MetadataAttribute[] => {
    return attributes?.filter((attribute) => attribute.key === key) || [];
  };

  const checkAttribute = (key: string): string | undefined => {
    const attribute = filterAttributes(profile.metadata?.attributes, key);
    return attribute[0]?.value;
  };

  const location = checkAttribute("location");
  const website = checkAttribute("website");
  const twitter = checkAttribute("x");

  const backgroundImageStyle = {
    backgroundImage: profile.metadata?.coverPicture?.optimized?.uri
      ? `url(${checkIpfsUrl(profile.metadata.coverPicture.optimized.uri)})`
      : "none",
    backgroundColor: "#94a3b8",
    backgroundSize: profile.metadata?.coverPicture?.optimized?.uri
      ? "cover"
      : "30%",
    backgroundPosition: "center center",
    backgroundRepeat: profile.metadata?.coverPicture?.optimized?.uri
      ? "no-repeat"
      : "repeat",
  };

  const socialIconClassName =
    "h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-stone-500 hover:text-stone-700 dark:text-stone-300 dark:hover:text-stone-200";

  return (
    <>
      <div className="-mt-14">
        {profile.metadata?.coverPicture?.optimized?.uri ? (
          <div className="h-52 sm:h-80" style={backgroundImageStyle} />
        ) : (
          <div className="bg-gradient-to-r from-sky-600 via-purple-700 to-purple-500 h-56 rounded-t shadow-xl" />
        )}
      </div>

      <div className="flex mb-4 -mt-12 sm:-mt-16 w-full justify-between">
        <div className="ml-12">
          <Avatar
            profile={profile}
            size="profile"
            loading={loading}
            hoverable={false}
          />
        </div>

        <div className="flex space-x-6">
          <div className="mt-16 pt-2 sm:pt-1 sm:mt-20 flex space-x-8">
            {website && (
              <a href={website} target="_blank" rel="noreferrer noopener">
                <FaGlobeAmericas className={socialIconClassName} />
              </a>
            )}
            {twitter && (
              <a
                href={`https://twitter.com/${twitter}`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-stone-500 hover:text-stone-700"
              >
                <FaTwitter className={socialIconClassName} />
              </a>
            )}
          </div>
          <div className="mt-16 sm:mt-20 px-2 sm:px-6">
            {verified && (
              <>
                {address === profile.ownedBy.address ? (
                  <EditProfileButton refetch={refetch} profile={profile} />
                ) : profile.operations.isFollowedByMe.value ? (
                  <UnFollowProfileButton
                    profileId={profile.id}
                    refetch={refetch}
                  />
                ) : (
                  <FollowProfileButton
                    profileId={profile.id}
                    refetch={refetch}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="px-2 md:px-6 text-sm sm:text-base text-stone-700 dark:text-stone-300 font-medium">
        <div className="pb-4">
          <div className="font-bold text-stone-900 dark:text-stone-100 text-md md:text-lg lg:text-xl">
            {profile.metadata?.displayName}
          </div>
          <div className="font-medium text-xs sm:text-sm md:text-md text-stone-500 dark:text-stone-400">
            @{profile.handle?.localName}
          </div>
        </div>
        <div className="font-bold">
          <LinkItUrl className="text-sky-600 hover:text-sky-500 z-50">
            <LinkItProfile className="text-sky-600 hover:text-sky-500 cursor-pointer">
              <span className="font-medium pl-1">{profile.metadata?.bio}</span>
            </LinkItProfile>
          </LinkItUrl>
        </div>
        {location && (
          <div className="flex font-bold py-2">
            <MdLocationOn className="h-4 w-4 sm:h-5 sm:w-5 text-stone-500" />
            <span className="font-medium pl-1">{location}</span>
          </div>
        )}
        <div className="sm:flex justify-between">
          <div className="flex bg-transparent space-x-4 font-semibold">
            <Link
              href={`/profile/${profile.handle?.localName}/following`}
              className="font-semibold py-2 hover:underline"
            >
              {checkFollowerCount(profile.stats.following)}{" "}
              <span className="text-stone-500 dark:text-stone-400 font-normal">
                Following
              </span>
            </Link>
            <Link
              href={`/profile/${profile.handle?.localName}/followers`}
              className="font-semibold py-2 hover:underline"
            >
              {checkFollowerCount(profile.stats.followers)}{" "}
              <span className="text-stone-500 dark:text-stone-400 font-normal">
                Followers
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
