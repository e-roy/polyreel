import React from "react";
import { useQuery } from "@apollo/client";
import { GET_USERS_NFTS } from "@/graphql/nfts/get-users-nfts";

import { Loading, Error } from "@/components/elements";

import { CURRENT_CHAIN_ID } from "@/lib/constants";

import { logger } from "@/utils/logger";
import { checkIpfsUrl } from "@/utils/check-ipfs-url";

type GetUserNftsProps = {
  ownedBy?: string;
};

export const GetUserNfts = ({ ownedBy }: GetUserNftsProps) => {
  const { loading, error, data } = useQuery(GET_USERS_NFTS, {
    variables: {
      request: {
        ownerAddress: ownedBy,
        chainIds: [CURRENT_CHAIN_ID],
        limit: 50,
      },
    },
    skip: !ownedBy,
  });

  if (loading) return <Loading />;
  if (error) return <Error />;
  if (!data) return null;

  logger("GetUserNfts.tsx", data);

  return (
    <div className="mt-2">
      <div className="flex flex-wrap">
        {data.nfts.items.map((nft: any, index: number) => (
          <div key={index} className="w-full sm:w-1/2 space-2">
            <div className="m-2 border border-stone-300 shadow-lg rounded">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={checkIpfsUrl(nft.originalContent.uri)}
                alt=""
                className={`w-full rounded-t`}
              />
              <div className={`p-2`}>
                <p className={`font-semibold text-stone-800`}>{nft.name}</p>
                <p className={`text-stone-600 font-medium`}>
                  {nft.collectionName}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div></div>
      </div>
    </div>
  );
};
