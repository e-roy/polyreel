import { useContext, useState } from "react";
import { UserContext } from "@/components/layout";
import type { NextPage } from "next";
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
  NavSelect,
} from "@/components/profile";

import { Avatar, Loading } from "@/components/elements";

import { GetUserNfts } from "@/components/lens/nfts";

import Linkify from "linkify-react";
import { linkifyOptions } from "@/lib/linkifyOptions";
import "linkify-plugin-mention";

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

  if (loading) return <Loading />;
  if (error) return <p>Error :(</p>;

  let profile = data.profiles.items[0];

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
          {/* {profile.id} */}
          <div className="font-semibold">
            <Linkify tagName="div" options={linkifyOptions}>
              Bio :
              <span className="font-normal pl-1 linkify">{profile.bio}</span>
            </Linkify>
          </div>
          <div className="font-semibold py-2">
            Location :
            <span className="font-normal pl-1">{profile.location}</span>
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

        {/* <UserTimeline profileId={profile.id} /> */}
      </div>
    </div>
  );
};

export default ProfilePage;
