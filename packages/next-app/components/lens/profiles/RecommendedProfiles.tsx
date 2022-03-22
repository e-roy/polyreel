import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";

import { RECOMMENDED_PROFILES } from "@/queries/profile/recommended-profiles";

import { ProfileCard } from "@/components/cards";

type RecommendedProfilesProps = {
  setSelectedOwner: (profileId: string) => void;
};

export const RecommendedProfiles = ({
  setSelectedOwner,
}: RecommendedProfilesProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [{ data: accountData }] = useAccount();
  // const [selectedOwner, setSelectedOwner] = useState(null);

  const { loading, error, data } = useQuery(RECOMMENDED_PROFILES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log(data);

  return (
    <div className="p-2 border rounded">
      <h1
        className="text-xl font-bold text-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        Recommended Profiles
      </h1>
      {isOpen && (
        <div className="flex flex-wrap">
          {data.recommendedProfiles.map((profile: any, index: number) => (
            <div
              key={index}
              className="w-1/4 m-2"
              onClick={() => setSelectedOwner(profile.ownedBy)}
            >
              <ProfileCard profile={profile} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
