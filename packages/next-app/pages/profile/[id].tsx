import type { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Header } from "@/components/layout";

import { useQuery } from "@apollo/client";
import { GET_PROFILES } from "@/queries/profile/get-profiles";

import { TwitterIcon, WebIcon } from "@/icons";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, data } = useQuery(GET_PROFILES, {
    variables: {
      request: { profileIds: [id] },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  let profile = data.profiles.items[0];
  console.log(profile);
  if (!profile) return null;
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex-1 overflow-y-scroll bg-stone-100 px-4">
        <div className="h-48 max-h-48">
          {profile.coverPicture ? (
            <img
              src={profile.coverPicture.original.url}
              alt=""
              className="rounded-lg"
            />
          ) : (
            <div className="bg-sky-500 h-48 max-h-48 rounded-t"></div>
          )}
        </div>
        <div className="flex mb-4 -mt-16 ml-8">
          {profile.picture ? (
            <img
              src={profile.picture.original.url}
              alt=""
              className="rounded-full h-32 border-2"
            />
          ) : (
            <div className="rounded-full h-32 w-32 bg-gray-300 border-2"></div>
          )}
          <div className="ml-2 my-auto font-semibold text-3xl bg-white px-1 rounded-xl">
            {profile.handle}
          </div>
        </div>
        <div className="font-semibold">
          Bio :<span className="font-normal">{profile.bio}</span>
        </div>
        <div className="font-semibold">
          Location : <span className="font-normal">{profile.location}</span>
        </div>
      </main>

      {/* <footer className="px-4 py-2">footer</footer> */}
    </div>
  );
};

export default ProfilePage;
