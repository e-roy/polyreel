import React from "react";
import { useQuery } from "@apollo/client";
import { GET_USERS_NFTS } from "@/queries/nfts/get-users-nfts";

type GetUserNftsProps = {
  ownedBy?: string;
};

export const GetUserNfts = ({ ownedBy }: GetUserNftsProps) => {
  const { loading, error, data } = useQuery(GET_USERS_NFTS, {
    variables: {
      request: { ownerAddress: ownedBy, chainIds: [80001], limit: 50 },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="mt-2">
      <div className="flex flex-wrap">
        {data.nfts.items.map((nft: any, index: number) => (
          <div key={index} className="w-full sm:w-1/3 space-2">
            <div className="m-2 p-2  border border-stone-400 shadow-lg rounded">
              <img src={nft.originalContent.uri} alt="" className="" />
              <div>
                <p>Collection : {nft.collectionName}</p>
                <p>Contract Name : {nft.contractName}</p>
                <p>Description : {nft.description}</p>
                <p>Name : {nft.name}</p>
                <p>type : {nft.ercType}</p>
              </div>
            </div>
          </div>
        ))}
        <div></div>
      </div>
    </div>
  );
};
