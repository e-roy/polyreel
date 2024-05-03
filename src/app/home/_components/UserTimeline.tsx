"use client";

import React, { useContext } from "react";
import { UserContext } from "@/context/UserContext/UserContext";
import { useQuery } from "@apollo/client";
import { GET_USER_FEED } from "../_graphql/user-feed";
import useInfiniteScroll from "react-infinite-scroll-hook";

import { logger } from "@/utils/logger";
import { FeedItem } from "@/types/graphql/generated";

import { LoadingMore } from "@/components/elements/LoadingMore";
import { Post } from "@/components/post/Post";
import { FeedSkeleton } from "@/components/skeletons/FeedSkeleton";

export type UserTimelineProps = {};

export const UserTimeline = ({}: UserTimelineProps) => {
  const { currentUser } = useContext(UserContext);

  const { loading, error, data, fetchMore } = useQuery(GET_USER_FEED, {
    variables: {
      request: {
        where: {
          for: currentUser?.id,
        },
      },
    },
    skip: !currentUser,
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        request: {
          where: {
            for: currentUser?.id,
          },
        },
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

  logger("UserTimeline.tsx", data.feed.items);

  return (
    <div className={`px-2 max-w-4xl mx-auto`}>
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
            <div key={index} className="sm:p-4 border-b-2 border-stone-400/40">
              <Post publication={item.root} />
            </div>
          ))}

        {loading && <FeedSkeleton />}
        {pageInfo?.next && (
          <div className="h-36" ref={sentryRef}>
            <LoadingMore />
          </div>
        )}
      </div>
    </div>
  );
};
