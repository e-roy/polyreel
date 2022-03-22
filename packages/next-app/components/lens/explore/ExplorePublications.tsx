import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { EXPLORE_PUBLICATIONS } from "@/queries/explore/explore-publications";

import { FeedCard } from "@/components/cards";

export const ExplorePublications = () => {
  const { loading, error, data } = useQuery(EXPLORE_PUBLICATIONS, {
    variables: {
      request: {
        sortCriteria: "TOP_COMMENTED",
        limit: 50,
      },
    },
  });

  console.log(data);
  if (!data) return null;
  return (
    <div className="p-2 rounded">
      <>
        {data.explorePublications &&
          data.explorePublications.items.map((item: any, index: number) => (
            <div key={index} className="m-2 p-2 rounded">
              <FeedCard publication={item} />
            </div>
          ))}
      </>
    </div>
  );
};
