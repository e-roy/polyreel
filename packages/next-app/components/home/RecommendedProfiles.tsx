import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";

import { RECOMMENDED_PROFILES } from "@/queries/profile/recommended-profiles";
import { RecommendCard } from "@/components/cards";

type RecommendedProfilesProps = {};

export const RecommendedProfiles = ({}: RecommendedProfilesProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const { loading, error, data } = useQuery(RECOMMENDED_PROFILES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  // console.log(data);

  return (
    <div className="">
      <h1
        className="text-xl font-bold text-center text-stone-700 sticky top-0 z-10 bg-white py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        Recommended Profiles
      </h1>
      {isOpen && (
        <div className="flex flex-wrap">
          {data.recommendedProfiles.map((profile: any, index: number) => (
            <div
              key={index}
              className="w-full"
              onClick={() => router.push(`/profile/${profile.handle}`)}
            >
              <RecommendCard profile={profile} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
