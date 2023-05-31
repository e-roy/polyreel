"use client";

import React, { useContext } from "react";
import { UserContext } from "@/context";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";

import { CreateProfile } from "@/components/create-profile";
import { Avatar } from "@/components/elements";

import { CURRENT_CHAIN_ID } from "@/lib/constants";

const SelectProfile: NextPage = () => {
  const router = useRouter();
  const { profiles } = useContext(UserContext);
  // console.log(profiles);

  const handleSelectProfile = (profile: any) => {
    // localStorage.setItem("polyreel_current_user_profile_id", profile.id);
    router.push(`/profile/${profile.handle}`);
  };

  // console.log(profiles);

  const baseClass =
    "flex cursor-pointer py-2 px-2 sm:px-6 rounded-lg uppercase text-stone-700 dark:text-stone-100 font-semibold hover:bg-sky-200 transition ease-in-out duration-150";

  return (
    <div className="flex flex-col text-stone-700 dark:text-stone-100">
      <div className="py-2 text-center text-2xl font-bold">
        Select A Profile
      </div>

      {profiles?.map((profile, index) => (
        <div
          key={index}
          className={`${baseClass}`}
          onClick={() => handleSelectProfile(profile)}
        >
          <Avatar profile={profile} size={"small"} />
          <div className="mt-2 px-4">{profile.handle}</div>
        </div>
      ))}

      {CURRENT_CHAIN_ID === 80001 && (
        <div className="my-6 text-center font-semibold text-lg">or</div>
      )}
      {CURRENT_CHAIN_ID === 80001 && (
        <div className={`${baseClass}`}>
          <CreateProfile />
        </div>
      )}
    </div>
  );
};

export default SelectProfile;
