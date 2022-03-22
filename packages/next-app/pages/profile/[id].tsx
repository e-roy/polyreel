import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Header } from "@/components/layout";

import { useQuery } from "@apollo/client";
import { GET_PROFILES } from "@/queries/profile/get-profiles";
// import { UserTimeline } from "@/components/lens/timeline";
import { GetPublications } from "@/components/lens/publications";

import { TwitterIcon, WebIcon } from "@/icons";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, data } = useQuery(GET_PROFILES, {
    variables: {
      request: { handles: [id] },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  let profile = data.profiles.items[0];
  //   console.log(profile);
  if (!profile) return null;
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex-1 overflow-y-scroll px-4">
        <div className="">
          {profile.coverPicture ? (
            <div className="rounded-t-xl relative h-64 max-h-64 w-full shadow-xl -z-10">
              <Image
                src={profile.coverPicture.original.url}
                alt=""
                className=""
                layout="fill"
              />
            </div>
          ) : (
            <div className="bg-sky-500 h-64 max-h-64 rounded-t shadow-xl"></div>
          )}
        </div>
        <div className="flex mb-4 -mt-16 ml-8">
          {profile.picture ? (
            <div className="h-32 w-32 relative rounded-full border-2 shadow-xl">
              <Image
                src={profile.picture.original.url}
                alt=""
                className="rounded-full"
                layout="fill"
                objectFit="cover"
              />
            </div>
          ) : (
            <div className="rounded-full h-32 w-32 bg-gray-300 border-2"></div>
          )}
          <div className="ml-2 px-2 py-1 my-auto font-semibold text-3xl bg-white border shadow-lg text-stone-800  rounded-xl">
            @{profile.handle}
          </div>
          <div className="mt-20 ml-8 flex space-x-8">
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
        </div>
        <div className="font-semibold">
          Bio :<span className="font-normal">{profile.bio}</span>
        </div>
        <div className="font-semibold">
          Location : <span className="font-normal">{profile.location}</span>
        </div>
        {/* <UserTimeline profileId={profile.id} /> */}
        <GetPublications profileId={profile.id} />
      </main>

      {/* <footer className="px-4 py-2">footer</footer> */}
    </div>
  );
};

export default ProfilePage;
