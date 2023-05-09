import React, { useContext } from "react";
import { UserContext } from "@/context";
import { useQuery } from "@apollo/client";
import { GET_USER_FEED } from "@/queries/feed/user-feed";
import useInfiniteScroll from "react-infinite-scroll-hook";

import { logger } from "@/utils/logger";
import { FeedItem } from "@/types/graphql/generated";

import { FeedItemCard } from "@/components/home";
import { LoadingMore } from "@/components/elements";

export type UserTimelineProps = {};

export const UserTimeline = ({}: UserTimelineProps) => {
  const { currentUser } = useContext(UserContext);
  // console.log(currentUser);

  const { loading, error, data, fetchMore } = useQuery(GET_USER_FEED, {
    variables: {
      request: {
        profileId: currentUser?.id,
        // publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 10,
      },
      reactionRequest: {
        profileId: currentUser?.id || null,
      },
      profileId: currentUser?.id || null,
    },
    skip: !currentUser,
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        request: {
          profileId: currentUser?.id,
          // publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
          cursor: pageInfo?.next,
        },
        reactionRequest: {
          profileId: currentUser?.id || null,
        },
        profileId: currentUser?.id || null,
        skip: !pageInfo?.next || !currentUser,
      },
    });
  };

  const pageInfo = data?.feed?.pageInfo;

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
    <div className={`px-2`}>
      <div className={`py-6 px-4`}>
        <h1
          className={`text-2xl font-semibold text-stone-700 dark:text-stone-100`}
        >
          Home
        </h1>
      </div>
      <div className={``}>
        {data.feed &&
          data.feed.items &&
          data.feed.items.map((item: FeedItem, index: number) => (
            <div key={index} className="rounded">
              <FeedItemCard feedItem={item} />
            </div>
          ))}
        {pageInfo?.next && (
          <div className="h-36" ref={sentryRef}>
            <LoadingMore />
          </div>
        )}
      </div>
    </div>
  );
};
