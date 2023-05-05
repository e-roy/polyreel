import React, { useContext } from "react";
import { UserContext } from "@/components/layout";
import { useQuery } from "@apollo/client";
import { GET_TIMELINE } from "@/queries/timeline/user-timeline";
import useInfiniteScroll from "react-infinite-scroll-hook";

import { logger } from "@/utils/logger";

// import { FeedCard } from "@/components/cards"; old card

export type UserTimelineProps = {};

export const UserTimeline = ({}: UserTimelineProps) => {
  const { currentUser } = useContext(UserContext);
  // console.log(currentUser);

  const { loading, error, data, fetchMore } = useQuery(GET_TIMELINE, {
    variables: {
      request: {
        profileId: currentUser?.id,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 10,
      },
    },
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        request: {
          profileId: currentUser?.id,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
          cursor: pageInfo?.next,
        },
      },
    });
  };

  const pageInfo = data?.explorePublications.pageInfo;

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: pageInfo?.next,
    onLoadMore: loadMore,
    disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });

  if (!data) return null;

  logger("UserTimeline.tsx", data);

  return (
    <div className="">
      <div className="p-2">
        {data.explorePublications &&
          data.explorePublications.items &&
          data.explorePublications.items.map((item: any, index: number) => (
            <div key={index} className="rounded">
              feed card here
              {/* <FeedCard publication={item} /> */}
            </div>
          ))}
        {pageInfo.next && (
          <div className="h-4 bg-slate-600" ref={sentryRef}></div>
        )}
      </div>
    </div>
  );
};
