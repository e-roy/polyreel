import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";

import { GET_PROFILES } from "@/queries/profile/get-profiles";
import { Button } from "@/components/elements";

import { addressShorten } from "@/utils/address-shorten";

import { ProfileCard } from "@/components/cards";

export type GetProfilesProps = {
  ownedBy?: string;
  setProfileId: (profileId: string) => void;
};

export const GetProfiles = ({
  ownedBy = "0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3",
  setProfileId,
}: GetProfilesProps) => {
  // const ownedBy = "0xd8c789626cdb461ec9347f26ddba98f9383aa457";
  // const ownedBy = "0x28Db2b440686A1adCA8d841b090330d88234A8c9";

  const ownedBy1 = "0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3";

  const [{ data: accountData }, getAccount] = useAccount();

  const [isOpen, setIsOpen] = useState(true);
  console.log(ownedBy);
  // if (!ownedBy) return null;

  const { loading, error, data } = useQuery(GET_PROFILES, {
    variables: {
      request: { ownedBy: ownedBy, limit: 10 },
    },
  });
  // console.log(accountData?.address);
  // console.log("data", data);
  // console.log("error", error);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log(data);

  let profiles = data.profiles.items.map((profile: any, index: number) => {
    return (
      <div
        key={index}
        className="w-1/4 m-2"
        onClick={() => setProfileId(profile.id)}
      >
        <ProfileCard profile={profile} />
      </div>
    );
  });

  return (
    <div className="p-2 border rounded">
      <div className="text-xl cursor-pointer flex flex-wrap">{profiles}</div>
    </div>
  );
};

const ProfilesHook = () => {
  return <></>;
};
