import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";
import { addressShorten } from "@/utils/address-shorten";

import { GET_USERS_NFTS } from "@/queries/nfts/get-users-nfts";

export const GetUserNfts = () => {
  const ownedBy = "0x28Db2b440686A1adCA8d841b090330d88234A8c9";
  //   const ownedBy = "0x505c2b951D87B8969B1Aa797997b96E5471A4E46";

  const [isOpen, setIsOpen] = useState(true);
  const { loading, error, data } = useQuery(GET_USERS_NFTS, {
    variables: {
      request: { ownerAddress: ownedBy, chainIds: [80001] },
    },
  });

  //   if (loading) return <p>Loading...</p>;
  //   if (error) return <p>Error :(</p>;
  console.log(data);
  return (
    <div className="p-2 border rounded">
      <h1
        className="text-xl font-bold text-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        Get NFTs ownedBy {addressShorten(ownedBy)}
      </h1>
    </div>
  );
};
