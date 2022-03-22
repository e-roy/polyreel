import React, { useState } from "react";
import { Button, TextField } from "@/components/elements";

import { useMutation, useQuery } from "@apollo/client";

import { GET_TIMELINE } from "@/queries/timeline/user-timeline";

// import { uploadIpfs } from "@/lib/ipfs";

import { useSigner, useContract } from "wagmi";

import { omit } from "@/lib/helpers";

import LENS_ABI from "@/abis/Lens.json";

import { PublicationCard } from "@/components/cards";

export type UserTimelineProps = {
  profileId: string;
};

export const UserTimeline = ({ profileId }: UserTimelineProps) => {
  const { loading, error, data } = useQuery(GET_TIMELINE, {
    variables: {
      request: {
        profileId,
        // publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 50,
      },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log(data);
  return (
    <div className="p-2 border rounded">
      <div className="flex flex-wrap">
        {data.timeline.items.map((timelineItem: any, index: number) => (
          <div key={index} className="w-1/4 m-2">
            <div>{timelineItem.appId}</div>
            <PublicationCard publication={timelineItem} />
          </div>
        ))}
      </div>
    </div>
  );
};
